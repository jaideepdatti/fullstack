import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SECURITY_QUESTIONS = ['first_school', 'childhood_friend', 'first_pet', 'birth_city'];
const normalizeAnswer = (answer: string) => answer.normalize('NFKC').trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' ');
const hashAnswer = (answer: string) => {
  const salt = randomBytes(16);
  return `${salt.toString('hex')}:${scryptSync(normalizeAnswer(answer), salt, 32).toString('hex')}`;
};
const answerMatches = (answer: string, stored?: string) => {
  if (!stored) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(normalizeAnswer(answer), Buffer.from(saltHex, 'hex'), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

const ROLE_DASHBOARDS: Record<string, string> = {
  superuser: 'platform-admin.html',
  admin: 'org-admin.html',
  volunteer: 'volunteer-dashboard.html',
  donor: 'donor-dashboard.html',
  beneficiary: 'beneficiary-dashboard.html',
  seller: 'seller-dashboard.html',
};

const ROLE_AVATARS: Record<string, string> = {
  superuser: '#6366f1',
  admin: '#0f1a2e',
  volunteer: '#10b981',
  donor: '#f59e0b',
  beneficiary: '#8b5cf6',
  seller: '#14b8a6',
};

const IMMEDIATE_ACCESS_ROLES = ['donor', 'beneficiary', 'superuser'];

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 'su_001', name: 'Kavita Sharma', email: 'super@kindred.org', password: 'Super@123',
      role: 'superuser', status: 'approved', initials: 'KS', avatar: '#6366f1', dashboard: 'platform-admin.html', registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'su_team1', name: 'Kavita Sharma (Team 1 Admin)', email: 'admin1@kindred.org', password: 'Admin1@123',
      role: 'superuser', team: 'team1', status: 'approved', initials: 'T1', avatar: '#6366f1', dashboard: 'platform-admin.html', registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'su_team2', name: 'Neha Gupta (Team 2 Admin)', email: 'admin2@kindred.org', password: 'Admin2@123',
      role: 'superuser', team: 'team2', status: 'approved', initials: 'T2', avatar: '#0d9488', dashboard: 'platform-admin.html', registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'adm_001', name: 'Rajesh Verma', email: 'admin@hopeconnect.org', password: 'Admin@123',
      role: 'admin', org: 'HopeConnect', status: 'approved', initials: 'RV', avatar: '#0f1a2e', dashboard: 'org-admin.html', registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'vol_001', name: 'Priya Singh', email: 'volunteer@kindred.org', password: 'Vol@123',
      role: 'volunteer', status: 'approved', initials: 'PS', avatar: '#10b981', dashboard: 'volunteer-dashboard.html', registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'don_001', name: 'Arun Patel', email: 'donor@kindred.org', password: 'Donor@123',
      role: 'donor', status: 'approved', initials: 'AP', avatar: '#f59e0b', dashboard: 'donor-dashboard.html', registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'ben_001', name: 'Meena Devi', email: 'beneficiary@kindred.org', password: 'Ben@123',
      role: 'beneficiary', status: 'approved', initials: 'MD', avatar: '#8b5cf6', dashboard: 'beneficiary-dashboard.html', registeredAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'seller_001', name: 'Ravi Kumar', email: 'seller@kindred.org', password: 'Seller@123',
      role: 'seller', status: 'approved', initials: 'RK', avatar: '#14b8a6', dashboard: 'seller-dashboard.html', registeredAt: '2024-01-01T00:00:00Z',
    },
  ];
  private counter = 100;

  private generateId(): string {
    return `usr_${Date.now()}_${this.counter++}`;
  }

  findAll(): User[] {
    return this.users.slice();
  }

  findById(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    return { ...user };
  }

  findByEmail(email: string): User | null {
    return this.users.find((u) => u.email === email) || null;
  }

  search(q: string): User[] {
    if (!q) return this.users.slice();
    const lq = q.toLowerCase();
    return this.users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(lq)) ||
        (u.email && u.email.toLowerCase().includes(lq)) ||
        (u.role && u.role.toLowerCase().includes(lq)),
    );
  }

  getPending(): User[] {
    return this.users.filter((u) => u.status === 'pending');
  }

  getApproved(): User[] {
    return this.users.filter((u) => u.status === 'approved');
  }

  getRejected(): User[] {
    return this.users.filter((u) => u.status === 'rejected');
  }

  create(dto: CreateUserDto): User {
    // Check for duplicate email
    const existing = this.users.find((u) => u.email === dto.email);
    if (existing) throw new BadRequestException(`User with email '${dto.email}' already exists`);
    const hasRecoveryDetails = dto.securityQuestion1 || dto.securityQuestion2 || dto.securityAnswer1 || dto.securityAnswer2;
    if (hasRecoveryDetails && (!SECURITY_QUESTIONS.includes(dto.securityQuestion1 || '') || !SECURITY_QUESTIONS.includes(dto.securityQuestion2 || '') || dto.securityQuestion1 === dto.securityQuestion2 || !dto.securityAnswer1?.trim() || !dto.securityAnswer2?.trim())) {
      throw new BadRequestException('Choose two different security questions and provide both answers.');
    }

    const initials = (dto.name || '')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    const newUser: User = {
      id: this.generateId(),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      status: IMMEDIATE_ACCESS_ROLES.includes(dto.role) ? 'approved' : 'pending',
      initials,
      avatar: ROLE_AVATARS[dto.role] || '#6366f1',
      dashboard: ROLE_DASHBOARDS[dto.role] || 'beneficiary-dashboard.html',
      org: dto.org,
      phone: dto.phone,
      bio: dto.bio,
      skills: dto.skills,
      registeredAt: new Date().toISOString(),
      ...(hasRecoveryDetails ? { securityQuestion1: dto.securityQuestion1, securityAnswerHash1: hashAnswer(dto.securityAnswer1!), securityQuestion2: dto.securityQuestion2, securityAnswerHash2: hashAnswer(dto.securityAnswer2!) } : {}),
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  update(id: string, dto: UpdateUserDto): User {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException(`User with id '${id}' not found`);

    this.users[idx] = { ...this.users[idx], ...Object.fromEntries(Object.entries(dto).filter(([, value]) => value !== undefined)) };
    return { ...this.users[idx] };
  }

  approve(id: string): User {
    return this.update(id, { status: 'approved' });
  }

  reject(id: string): User {
    return this.update(id, { status: 'rejected' });
  }

  delete(id: string): boolean {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException(`User with id '${id}' not found`);
    this.users.splice(idx, 1);
    return true;
  }

  // Sign-in logic
  signIn(email: string, password: string, role: string): User | null {
    return this.users.find(
      (u) => u.email === email && u.password === password && u.role === role,
    ) || null;
  }

  recoverPassword(input: { email: string; role: string; securityAnswer1: string; securityAnswer2: string; newPassword: string }): void {
    const user = this.users.find((candidate) => candidate.email.toLowerCase() === input.email.trim().toLowerCase() && candidate.role === input.role);
    if (!user || !answerMatches(input.securityAnswer1, user.securityAnswerHash1) || !answerMatches(input.securityAnswer2, user.securityAnswerHash2)) {
      throw new BadRequestException('Account details or security answers do not match. Your password has not changed.');
    }
    if (input.newPassword.length < 8) throw new BadRequestException('Password must be at least 8 characters.');
    user.password = input.newPassword;
  }

  recoveryQuestions(email: string, role: string): string[] {
    const user = this.users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.role === role && candidate.securityQuestion1 && candidate.securityQuestion2);
    if (!user) throw new BadRequestException('No recovery questions are available for those account details. Check your email and role, or contact support.');
    return [user.securityQuestion1!, user.securityQuestion2!];
  }

  setRecoveryQuestions(id: string, email: string, role: string, input: { securityQuestion1: string; securityAnswer1: string; securityQuestion2: string; securityAnswer2: string }): void {
    const user = this.users.find((candidate) => candidate.id === id && candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.role === role);
    if (!user) throw new BadRequestException('You can only update recovery questions for your signed-in account.');
    if (!SECURITY_QUESTIONS.includes(input.securityQuestion1) || !SECURITY_QUESTIONS.includes(input.securityQuestion2) || input.securityQuestion1 === input.securityQuestion2 || !input.securityAnswer1?.trim() || !input.securityAnswer2?.trim()) {
      throw new BadRequestException('Choose two different security questions and provide both answers.');
    }
    user.securityQuestion1 = input.securityQuestion1;
    user.securityAnswerHash1 = hashAnswer(input.securityAnswer1);
    user.securityQuestion2 = input.securityQuestion2;
    user.securityAnswerHash2 = hashAnswer(input.securityAnswer2);
  }
}
