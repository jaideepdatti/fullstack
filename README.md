# Kindred

A community support platform with React and NestJS. Includes platform and organization administration, volunteering, beneficiary resource requests, donor contributions, and an artisan shop.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install

Run these commands from the repository root:

```powershell
cd back-end
npm ci
npm run build
cd ../front-end
npm ci
cd ..
```

## Run

On Windows, run `START_PROJECT.bat` after installing dependencies and building the backend.

Alternatively, open two terminals:

```powershell
cd back-end
npm run start:prod
```

```powershell
cd front-end
npm run dev
```

- Frontend: http://127.0.0.1:5173
- Backend: http://localhost:3000
- API documentation: http://localhost:3000/api/docs

To change the frontend API address, copy `front-end/.env.example` to `front-end/.env.local`, edit `VITE_API_BASE_URL`, and restart Vite.

## Checks

Frontend:

```powershell
cd front-end
npm test
npm run lint
npm run build
```

Backend:

```powershell
cd back-end
npm run build
npm run test:e2e -- --runInBand fulfillment.e2e-spec.ts participation.e2e-spec.ts public-listing.e2e-spec.ts workflows.e2e-spec.ts
```

## Local data

The backend uses local demo records. Runtime records are saved as encrypted files in `.run/`; Windows protects the encryption key using the current Windows account. Uploaded files are stored in `back-end/uploads/`. Runtime records, keys, uploaded files, dependencies, build output, and local environment files are excluded from Git.

Card payments are a demo: no money is charged or settled. Seeded accounts and bank details are demonstration data.
