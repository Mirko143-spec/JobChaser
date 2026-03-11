# JobChaser

En full-stack jobbapplikation som låter användare söka och spara jobbannonser från Arbetsförmedlingens JobTech API.

## Teknisk Stack

### Frontend

- **React 19** med **TypeScript**
- **Vite 7** som byggverktyg
- **Tailwind CSS 4** för styling
- **React Router 7** för routing
- **Zustand** för state management (med localStorage persistens)
- **React Hook Form** + **Zod** för formulärhantering och validering

### Backend

- **Express** med **TypeScript**
- **Drizzle ORM** med **PostgreSQL**
- **JWT-autentisering** med httpOnly cookies
- **Bcrypt** för lösenordshashning
- **Rate limiting** för inloggningsförsök

### Externa API:er

- **JobTech API** (`jobsearch.api.jobtechdev.se`) - riktiga jobbannonser

## Funktioner

- Sök jobb i realtid via JobTech API
- Filtrera efter ort, kategori, nivå, anställningsform
- Dark/light theme (sparas i localStorage)
- Fullständig användarautentisering (signup/signin/logout)
- Spara favoritjobb (kopplade till användarkonto)
- Jobbdetaljer i modal
- Skyddade routes för inloggade användare

## Kom igång

### Förutsättningar

- Node.js 18+
- PostgreSQL
- pnpm

### Installation

```bash
# Frontend
cd jobchaser
pnpm install

# Backend
cd server
pnpm install
```

### Konfiguration

Kopiera `.env.example` till `.env` och konfigurera:

**Frontend (.env)**

```
VITE_API_URL=http://localhost:3000
```

**Server (.env)**

```
PORT=3000
DATABASE_URL=postgresql://localhost:5432/your-database-name
JWT_SECRET=your-super-secret-jwt-key
```

### Kör applikationen

```bash
# Starta backend (terminal 1)
cd server
pnpm dev

# Starta frontend (terminal 2)
pnpm dev
```

Frontend körs på `http://localhost:5173` och backend på `http://localhost:3000`.

## Projektstruktur

```
├── src/                    # Frontend-källkod
│   ├── components/        # React-komponenter
│   ├── pages/            # Sidkomponenter
│   ├── stores/           # Zustand state stores
│   ├── contexts/         # React contexts
│   ├── schemas/          # Zod valideringsscheman
│   └── router.tsx        # React Router-konfiguration
├── server/               # Backend-källkod
│   └── src/
│       ├── routes/       # Express-rutter
│       ├── middleware/  # Auth-middleware
│       └── db/           # Drizzle schema & konfiguration
└── public/              # Statiska tillgångar
```

## Styrkor

- **Full-stack applikation** - komplett med frontend och backend
- **Real API-integration** - faktiska jobbannonser från JobTech/Arbetsförmedlingen
- **Modern techstack** - senaste versioner av React, TypeScript, Vite, etc.
- **Säker autentisering** - JWT i httpOnly cookies, bcrypt-hashning, rate limiting
- **Databas** - PostgreSQL med Drizzle ORM, användarrelationer med cascading delete
- **Typat med TypeScript** - full typsäkerhet i både frontend och backend
- **Separerad state management** - Zustand med persistens
- **Formulärvalidering** - Zod scheman med react-hook-form
- **RESTful API** - proper CRUD för jobs med auth-middleware
- **Miljövariabler** - konfiguration via .env-filer

## Brister

- **Inga tester** - varken frontend eller backend har enhetstester eller integrationstester
- **Endast svenska jobb** - JobTech API är Sverige-specifikt
- **Begränsad felhantering** - grundläggande error states på vissa ställen
- **Ingen API-dokumentation** - ingen OpenAPI/Swagger
- **Ingen containerisering** - ingen Docker setup
- **Ingen CI/CD** - inga GitHub Actions eller liknande
- **Ingen extern databas** - kräver lokal PostgreSQL-installation
