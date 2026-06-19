# Arquitectura

## Visión general

El ATS es un monorepo TypeScript administrado con pnpm y Turborepo.

```text
Browser
  │
  ├─ Next.js 16 / React 19 / MUI 9        apps/web
  │      ├─ Firebase Auth
  │      ├─ Firebase Storage
  │      └─ HTTP y Callable Functions
  │
  ├─ Cloud Functions v2 / Node.js 22      apps/functions
  │      ├─ servicios de dominio
  │      ├─ repositorios Firestore
  │      ├─ triggers Firestore/Storage
  │      ├─ Gmail y Calendar APIs
  │      └─ Vertex AI Gemini
  │
  └─ Modelos y contratos compartidos      packages/shared-types
```

## Aplicaciones y paquetes

| Ruta                         | Responsabilidad                                       |
| ---------------------------- | ----------------------------------------------------- |
| `apps/web`                   | Portal público, postulación y dashboard interno       |
| `apps/functions`             | API, reglas de negocio, integraciones y triggers      |
| `packages/shared-types`      | Modelos, DTOs, contratos y configuración del pipeline |
| `packages/eslint-config`     | Reglas ESLint compartidas                             |
| `packages/typescript-config` | Configuraciones TypeScript compartidas                |

## Frontend

El frontend usa App Router en `apps/web/app`.

- `features/`: lógica y UI agrupadas por capacidad.
- `shared/api/`: clientes para Cloud Functions.
- `repositories/interfaces/`: contratos de acceso a datos.
- `repositories/firebase/`: implementaciones con Firebase SDK.
- `shared/lib/`: inicialización Firebase, autenticación y utilidades.
- `dashboard/`: rutas internas.
- `jobs`, `postulation` y `offer`: rutas públicas.

Los componentes no deben contener lógica de persistencia. El flujo preferido es:

```text
Page/Component → Hook → Service/API → Repository o Cloud Function
```

Las importaciones directas de Firebase fuera de los repositorios se limitan
principalmente a autenticación, Storage y Callables. Las nuevas operaciones de
datos deben mantener el acceso encapsulado.

## Backend

`apps/functions/src` se divide en:

- `callables/`: funciones HTTP y Firebase Callables;
- `services/`: casos de uso y orquestación;
- `repositories/`: acceso a Firestore;
- `validators/`: validación de payloads;
- `triggers/`: eventos de Firestore, Auth y Storage;
- `scheduled/`: tareas programadas;
- `core/`: Firebase Admin, CORS, autenticación y secretos.

Las funciones HTTP autenticadas esperan:

```http
Authorization: Bearer <Firebase ID token>
```

En el emulador se admiten tokens técnicos documentados en
`apps/functions/src/core/httpAuth.ts`.

## Datos

Colecciones principales:

- `jobs`;
- `candidates`;
- `applications`;
- `employees`;
- `users`;
- `emailTemplates`;
- `emailLogs`;
- `offers`;
- `config`.

Subcolecciones relevantes bajo `applications/{applicationId}`:

- `stageHistory`;
- notas de candidatura;
- formularios de entrevista.

Los modelos TypeScript son orientativos; Firestore no aplica esquema en tiempo
de ejecución. Cualquier cambio de modelo debe contemplar compatibilidad con
documentos anteriores y actualizar reglas, índices, contratos y pruebas.

## Autenticación y autorización

Roles internos:

| Rol           | Uso                                  |
| ------------- | ------------------------------------ |
| `admin`       | Administración y asignación de roles |
| `hr`          | Reclutamiento y gestión operativa    |
| `area_leader` | Participación del líder de área      |
| `tech_lead`   | Evaluación técnica                   |

`hr` y `area_leader` pueden autoasignarse durante onboarding. `admin` debe
crearse y asignarse de forma controlada. La autorización real debe validarse en
backend y reglas; ocultar una pantalla no constituye autorización.

## Pipeline

La fuente de verdad del pipeline es
`packages/shared-types/src/models/stageConfig.ts`.

Este archivo define:

- etapas y orden;
- transiciones manuales;
- transiciones del sistema;
- saltos permitidos;
- plantilla de correo asociada;
- disparadores de Calendar, entrevistas y ofertas.

No duplicar esta configuración en documentación o componentes.

## Integraciones

### Parsing de CV

Storage Trigger → descarga de PDF → extracción local cuando es posible →
Gemini en Vertex AI → normalización → persistencia del perfil editable.

El FIT% no lo calcula la IA. Se obtiene mediante comparación determinística y
ponderada de skills.

### Gmail

OAuth por recruiter, credenciales cifradas en Firestore, plantillas editables,
registro de envíos y reintento de fallos.

### Calendar

OAuth por recruiter, watches de Google Calendar, webhook de notificaciones y
tarea diaria de renovación. El webhook asocia eventos por recruiter y email del
candidato para avanzar etapas de entrevista.

### Ofertas

La oferta se administra desde el perfil, se envía mediante email y se expone al
candidato con un token público. En Firestore se persiste el hash del token, no
el token plano.

Las restricciones técnicas conocidas se registran en
`docs/LIMITATIONS.md`.
