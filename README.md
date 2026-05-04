# ATS HRMS

Web-based Applicant Tracking System for a single company. Covers the full recruitment lifecycle: job posting → candidate registration → CV parsing + AI scoring → pipeline management → interviews → offer → employee conversion.

## Stack

| Layer       | Tech                                                     |
| ----------- | -------------------------------------------------------- |
| Frontend    | Next.js 15 (App Router), TypeScript strict, Tailwind CSS |
| Data / Auth | Firebase Auth, Firestore, Storage, Cloud Functions       |
| AI          | OpenAI GPT-4o-mini (CV parsing + fit scoring)            |
| State       | TanStack Query (server state), useState/useReducer (UI)  |
| Monorepo    | pnpm workspaces + Turborepo                              |
| Icons       | lucide-react                                             |

**Deployment:** Firebase Hosting + Cloud Functions (Node 20).

## Monorepo structure

```
apps/web/src/
  app/
    (public)/       SSG — job board, no auth
    (hr)/           SSR — recruiter dashboard, auth required
    (candidate)/    CSR — candidate portal
  features/         Co-located by feature (jobs, candidates, pipeline, interviews, offers)
  repositories/
    interfaces/     TypeScript interfaces — Firebase never imported here
    firebase/       Firebase implementations — ONLY place Firebase is imported
    index.ts        Swap here to migrate to another DB
  shared/
    lib/firebase.ts SDK init only
packages/shared-types/   DTOs shared between web and functions
apps/functions/src/
  triggers/         Thin Cloud Function handlers
  services/         Business logic
  ai/               CV parsing, scoring, matching
```

## Setup

**Prerequisites**

```bash
npm install -g pnpm firebase-tools
node >= 22
```

**Install**

```bash
pnpm install
pnpm audit --fix      # fix outdated deps if needed
```

**Firebase login**

```bash
firebase login        # use grupo.quatro.ort@gmail.com
```

## Development

```bash
# Start Next.js dev server
pnpm dev-web
# or
pnpm turbo run dev --filter=@ats/web

# Start Firebase emulators (run once to init, then just start)
firebase init emulators
firebase emulators:start

# Compile Cloud Functions
pnpm compile-fn
# or
pnpm turbo run build --filter=@ats/functions
```

## All scripts

| Command            | Description                      |
| ------------------ | -------------------------------- |
| `pnpm dev`         | Start all apps in dev mode       |
| `pnpm dev-web`     | Start Next.js only               |
| `pnpm build`       | Build all apps                   |
| `pnpm compile-fn`  | Build Cloud Functions only       |
| `pnpm lint`        | Lint all packages                |
| `pnpm format`      | Prettier format all TS/MD files  |
| `pnpm check-types` | TypeScript check across monorepo |
| `pnpm test`        | Run all tests                    |
| `pnpm test:watch`  | Tests in watch mode              |

**Deploy**

```bash
pnpm deploy               # full deploy
pnpm deploy:functions     # functions only
pnpm deploy:rules         # Firestore + Storage rules only
pnpm deploy:hosting       # hosting only
pnpm deploy:staging       # deploy to staging alias
```

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org/es/). A pre-commit hook runs lint + format + tests automatically.

```
feat(pipeline): add discard reason validation
fix(auth): handle expired session redirect
```

**Before every PR**

- No Firebase imports outside `repositories/firebase/` and `shared/lib/`
- New fields added to `packages/shared-types`
- Side effects (emails, scoring, counters) in Cloud Functions — not frontend
- Colors from palette only, no raw hex
- Only lucide-react icons
- `pnpm check-types` passes, no `any`

**Adding a feature**

```
1. Define/update types in packages/shared-types
2. Add method to repository interface (interfaces/)
3. Implement in Firebase repository (firebase/)
4. Write service method — business logic here, not in repository
5. Build component/page — calls service only, never Firebase directly
6. Add Cloud Function if feature has side effects
```
