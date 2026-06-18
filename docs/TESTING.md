# Estrategia de pruebas

## Comandos

Desde la raíz:

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Por aplicación:

```bash
pnpm --filter @ats/web test
pnpm --filter @ats/functions test
pnpm --filter @ats/web build
pnpm --filter @ats/functions build
```

## Cobertura actual

La suite existente se concentra en pruebas unitarias de:

- servicios y validadores backend;
- repositorios con dependencias simuladas;
- parsing y normalización;
- matching;
- emails, Calendar y ofertas;
- servicios, utilidades y algunos componentes frontend.

No existen actualmente:

- pruebas E2E en navegador;
- umbral de cobertura;
- suite integral obligatoria contra Firebase Emulator;
- smoke tests automatizados post-deploy.

## Reglas para cambios

- Corregir un bug implica agregar una prueba que falle antes del fix.
- Los contratos compartidos se cambian antes que sus consumidores.
- Un cambio de endpoint debe actualizar pruebas y Swagger.
- Un cambio de Firestore debe revisar reglas e índices.
- Un cambio del pipeline debe probar transiciones válidas, inválidas y efectos.
- Integraciones externas deben tener modo mock y pruebas de error.

## Casos E2E prioritarios

1. Login y onboarding por rol.
2. CRUD de posiciones.
3. Postulación manual.
4. Carga de CV, parsing, edición y confirmación.
5. Cambio de etapa con preview y envío de email.
6. Registro de entrevista y avance.
7. Creación, envío, aceptación y rechazo de oferta.

Hasta automatizarlos, deben formar parte del checklist manual de cada release.
