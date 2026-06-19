# Cloud Functions

Backend del ATS implementado con Firebase Cloud Functions v2 y Node.js 22.

## Responsabilidades

- endpoints HTTP y Firebase Callables;
- validación y autorización;
- persistencia en Firestore;
- parsing de CV y matching;
- Gmail y plantillas de email;
- Calendar OAuth, webhooks y renovación de watches;
- ofertas;
- triggers de Firestore, Auth y Storage.

## Desarrollo local

Desde la raíz:

```bash
cp apps/functions/.env.example apps/functions/.env.local
pnpm install --frozen-lockfile
firebase emulators:start --only auth,functions,firestore,storage
```

En otra terminal:

```bash
pnpm --filter @ats/functions build:watch
```

Para trabajar sin proveedores externos:

```env
GMAIL_MOCK=true
CV_PARSING_USE_MOCK=true
```

## Estructura

```text
src/
  callables/       endpoints HTTP y Callables
  services/        lógica de negocio
  repositories/    acceso a Firestore
  validators/      validación de entrada
  triggers/        eventos de plataforma
  scheduled/       tareas programadas
  core/            inicialización, auth, CORS y secretos
```

## Autenticación

Los endpoints HTTP protegidos esperan un Firebase ID token:

```http
Authorization: Bearer <token>
```

No confiar en roles enviados en el body. Usar
`core/httpAuth.ts` y validar permisos en el backend.

## Variables y secretos

Consultar `.env.example` y `../../docs/OPERATIONS.md`.

En producción:

- `OAUTH_ENCRYPTION_KEY` y `CALENDAR_WEBHOOK_SECRET` se administran con
  Firebase Secret Manager;
- credenciales OAuth y variables del entorno se administran desde CI/Google
  Cloud;
- no se debe incluir ningún valor real en Git.

## Calidad

```bash
pnpm lint
pnpm test
pnpm build
```

## API

- exports: `src/index.ts`;
- contratos: `packages/shared-types/src/contracts`;
- OpenAPI: `../../docs/swagger.json`;
- guías especializadas: `../../docs/technical/`.

Swagger debe actualizarse en el mismo cambio que altere una función pública.
