# ATS TEMA

Applicant Tracking System para gestionar posiciones, candidatos, entrevistas,
comunicaciones y ofertas laborales.

## Estado del proyecto

El sistema implementa:

- portal público de posiciones;
- postulación manual y asistida por parsing de CV;
- extracción con Gemini en Vertex AI;
- matching determinístico de skills y FIT%;
- dashboard de posiciones y candidatos;
- pipeline configurable con historial;
- notas y formularios de entrevistas;
- plantillas y envío de emails mediante Gmail OAuth;
- integración con Google Calendar;
- creación, envío y respuesta de ofertas.

Las limitaciones conocidas están en [docs/LIMITATIONS.md](docs/LIMITATIONS.md).

## Stack

| Capa                 | Tecnología                                  |
| -------------------- | ------------------------------------------- |
| Frontend             | Next.js 16, React 19, TypeScript, MUI 9     |
| Estado y formularios | TanStack Query y TanStack Form              |
| Backend              | Firebase Cloud Functions v2, Node.js 22     |
| Datos                | Firestore, Firebase Storage y Firebase Auth |
| IA                   | Vertex AI Gemini                            |
| Integraciones        | Gmail API y Google Calendar API             |
| Monorepo             | pnpm 10 y Turborepo                         |
| Calidad              | ESLint, TypeScript y Vitest                 |

## Estructura

```text
apps/
  web/                 aplicación Next.js
  functions/           Cloud Functions
packages/
  shared-types/        modelos y contratos compartidos
  eslint-config/       configuración ESLint
  typescript-config/   configuración TypeScript
docs/                  arquitectura, operación, pruebas y referencias técnicas
scripts/               seeds y administración local
```

## Documentación

| Documento                                          | Uso                                  |
| -------------------------------------------------- | ------------------------------------ |
| [Arquitectura](docs/ARCHITECTURE.md)               | Componentes, datos e integraciones   |
| [Operación](docs/OPERATIONS.md)                    | Deploy, monitoreo, backup y rollback |
| [Pruebas](docs/TESTING.md)                         | Estrategia y comandos                |
| [Limitaciones](docs/LIMITATIONS.md)                | Restricciones técnicas conocidas     |
| [Contribución](contributing/CONTRIBUTING_GUIDE.md) | Convenciones para cambios            |
| [Frontend](apps/web/README.md)                     | Organización del frontend            |
| [Diseño](contributing/front/DESIGN_GUIDE.md)       | Sistema visual y accesibilidad       |
| [API](docs/swagger.json)                           | Especificación OpenAPI               |
| [Functions](apps/functions/README.md)              | Desarrollo del backend               |
| [Guías técnicas](docs/technical/)                  | Flujos funcionales vigentes          |
| [Postman](docs/postman/)                           | Colecciones para emuladores          |

La fuente de verdad es el código y la documentación canónica de la tabla.

## Requisitos

- Node.js 22 LTS. No se garantiza compatibilidad con versiones posteriores.
- pnpm 10, preferentemente la versión indicada en `package.json`.
- JDK 21 o compatible para los emuladores.
- Firebase CLI 14.
- Acceso a un proyecto Firebase de desarrollo.
- Google Cloud CLI solamente si se prueba Vertex AI real con ADC.

Se recomienda habilitar Corepack:

```bash
corepack enable
corepack prepare pnpm@10.33.2 --activate
```

## Instalación

```bash
git clone https://github.com/grupo-quatro/ats-tema.git
cd ats-tema
pnpm install --frozen-lockfile
```

## Configuración local

Crear los archivos locales:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/functions/.env.example apps/functions/.env.local
```

Completar los valores de Firebase. Para trabajo sin integraciones reales:

```env
# apps/web/.env.local
NEXT_PUBLIC_USE_EMULATORS=true

# apps/functions/.env.local
GMAIL_MOCK=true
CV_PARSING_USE_MOCK=true
```

Los archivos `.env.local` y cualquier credencial real están ignorados por Git.

## Desarrollo con emuladores

Terminal 1:

```bash
firebase emulators:start \
  --only auth,functions,firestore,storage \
  --import=./emulator-data \
  --export-on-exit
```

Si no existe información importable, con los emuladores activos:

```bash
pnpm seed
```

Terminal 2:

```bash
pnpm dev-web
```

Servicios:

- aplicación: `http://localhost:3000`;
- Emulator UI: `http://127.0.0.1:4000`;
- Functions: `http://127.0.0.1:5001`;
- Firestore: `127.0.0.1:8080`;
- Auth: `127.0.0.1:9099`;
- Storage: `127.0.0.1:9199`.

Cuando se modifican Functions, compilarlas en modo watch:

```bash
pnpm --filter @ats/functions build:watch
```

## Validación obligatoria

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

No desplegar un commit que no pase los cuatro comandos.

## Scripts principales

| Comando             | Descripción                                           |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Ejecuta las tareas `dev` del monorepo                 |
| `pnpm dev-web`      | Inicia el frontend                                    |
| `pnpm compile-fn`   | Compila Functions                                     |
| `pnpm lint`         | Ejecuta lint y validaciones estáticas                 |
| `pnpm check-types`  | Valida tipos                                          |
| `pnpm test`         | Ejecuta Vitest                                        |
| `pnpm build`        | Construye todas las aplicaciones                      |
| `pnpm seed`         | Carga datos en emuladores                             |
| `pnpm seed:staging` | Seed explícito de staging; usar solo con autorización |

## Roles

| Rol           | Descripción       |
| ------------- | ----------------- |
| `admin`       | Administración    |
| `hr`          | Recruiter         |
| `area_leader` | Líder de área     |
| `tech_lead`   | Evaluador técnico |

Para asignar el primer admin fuera del emulador:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/ruta/segura/service-account.json \
node scripts/set-admin-claim.mjs admin@empresa.example
```

La clave debe permanecer fuera del repositorio.

## Despliegue

Consultar [docs/OPERATIONS.md](docs/OPERATIONS.md). El método esperado es
GitHub Actions con Workload Identity Federation y environments protegidos.

No ejecutar `firebase deploy` contra producción hasta:

- identificar la release;
- completar validaciones;
- verificar proyecto y credenciales;
- disponer de backup y rollback;
- tener aprobación del responsable del entorno.

## Seguridad

- No versionar tokens, claves, service accounts ni CVs reales.
- Usar datos ficticios en seeds y tests.
- Tratar los CVs y decisiones de contratación como datos personales sensibles.
- Validar autorización en backend y reglas, no solo en la UI.
- Revisar `firestore.rules` y `storage.rules` con cada cambio de acceso.
