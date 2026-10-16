import { Module } from '@nestjs/common';
import { ProgramAssignmentsModule } from '../program-assignments/module';
import { ProgramsModule } from '../programs/module';
import { ProgramApplicationsController } from './controller';
import { ProgramApplicationsService } from './service';

@Module({
  imports: [ProgramAssignmentsModule, ProgramsModule],
  controllers: [ProgramApplicationsController],
  providers: [ProgramApplicationsService],
  exports: [ProgramApplicationsService],
})
export class ProgramApplicationsModule {}
