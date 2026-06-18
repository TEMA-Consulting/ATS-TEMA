# Frontend

Aplicación Next.js 16 del ATS. Incluye el portal público, la postulación, el
dashboard interno y las rutas servidor usadas para sesión y OAuth.

## Ejecutar

Desde la raíz:

```bash
cp apps/web/.env.example apps/web/.env.local
pnpm install --frozen-lockfile
pnpm dev-web
```

Desde este directorio:

```bash
pnpm dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Variables

Consultar `.env.example`.

- `NEXT_PUBLIC_*` se envía al navegador y no debe contener secretos.
- `NEXT_PUBLIC_USE_EMULATORS=true` conecta Auth, Firestore, Storage y Functions
  a los puertos definidos en `firebase.json`.
- En producción, el servidor usa Firebase Admin con Application Default
  Credentials.

## Organización

```text
app/
  api/                 rutas servidor de sesión y OAuth
  dashboard/           rutas internas
  jobs/                listado y detalle público
  postulation/         flujo de postulación
  candidate/           detalle de candidato
  offer/               oferta pública por token
  features/            módulos funcionales
  repositories/        interfaces e implementaciones Firebase
  shared/              APIs, componentes y utilidades
```

Convenciones completas:

- `../../contributing/front/DESIGN_GUIDE.md`;
- `../../contributing/CONTRIBUTING_GUIDE.md`;
- `../../docs/ARCHITECTURE.md`.

## Calidad

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

El build puede advertir sobre la migración futura de `middleware.ts` a
`proxy.ts`. Está registrada en `docs/KNOWN_ISSUES.md`.
