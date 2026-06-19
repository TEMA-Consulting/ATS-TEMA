# Posiciones y pipeline

La especificación detallada de request/response está en `docs/swagger.json`.
Las Functions realmente desplegadas se exportan desde
`apps/functions/src/index.ts`.

## Posiciones

Funciones principales:

- `createJob`;
- `listOpenJobs`;
- `getJobDetail`;
- `getInternalJobDetail`;
- `getPosition`;
- `updatePosition`;
- `updatePositionStatus`;
- `deletePosition`;
- `listPositions`;
- `listDepartments`.

## Aplicaciones

- `getApplicationsByJob`;
- `getApplicationsByCandidate`;
- `getApplicationDetail`;
- `updateApplication`;
- `updateApplicationStage`;
- `previewApplicationStageEmail`;
- `getStageHistory`.

## Pipeline

No mantener una lista de etapas en esta guía. La fuente de verdad es:

```text
packages/shared-types/src/models/stageConfig.ts
```

## Convención HTTP

- token: `Authorization: Bearer <Firebase ID token>`;
- JSON en body para mutaciones;
- validación de método;
- errores JSON estables;
- CORS mediante helpers de backend.

Algunas funciones siguen siendo Firebase Callables. Verificar el cliente
frontend antes de cambiar el protocolo.

## Cambios de API

Actualizar implementación, contrato, cliente, tests y Swagger en el mismo PR.
