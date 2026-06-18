# Guía de contribución

## Principios

- El código y los contratos son la fuente de verdad.
- Mantener cambios pequeños, probables y reversibles.
- No introducir secretos ni datos personales reales.
- Validar autorización en backend y reglas Firebase.
- Actualizar documentación y pruebas junto con el comportamiento.

## Stack vigente

- Next.js 16 y React 19;
- Material UI 9;
- TanStack Query y TanStack Form;
- Firebase Auth, Firestore, Storage y Cloud Functions v2;
- Node.js 22;
- Vertex AI Gemini;
- pnpm 10 y Turborepo;
- Vitest, ESLint y TypeScript.

## Organización

Consultar `../docs/ARCHITECTURE.md`.

### Frontend

```text
apps/web/app/
  features/
  repositories/
    interfaces/
    firebase/
  shared/
    api/
    components/
    lib/
```

Flujo preferido:

```text
Page/Component → Hook → Service/API → Repository o Cloud Function
```

No importar Firestore directamente en componentes o hooks nuevos. Las
operaciones de datos deben quedar encapsuladas en repositorios o APIs. Las
excepciones heredadas para Auth, Storage y Callables no habilitan a extender el
acoplamiento.

### Backend

```text
apps/functions/src/
  callables/
  services/
  repositories/
  validators/
  triggers/
  scheduled/
  core/
```

Los handlers deben:

1. resolver CORS y método;
2. autenticar;
3. autorizar;
4. validar el payload;
5. delegar al servicio;
6. traducir errores a una respuesta estable.

La lógica de negocio no debe quedar duplicada entre handlers.

## Contratos

`packages/shared-types` es la fuente compartida para modelos y DTOs.

Al cambiar un contrato:

1. actualizar el tipo;
2. mantener compatibilidad o documentar migración;
3. actualizar backend y frontend;
4. actualizar tests;
5. actualizar Swagger.

No asumir que los documentos existentes en Firestore contienen campos nuevos.

## Firestore y Storage

Toda nueva colección o consulta debe revisar:

- `firestore.rules`;
- `firestore.indexes.json`;
- serialización de `Date`/`Timestamp`;
- autorización;
- impacto en lecturas y costos;
- datos existentes.

Toda nueva ruta de archivos debe revisar `storage.rules`, tamaño, MIME type,
propiedad y retención.

No crear índices o reglas únicamente desde la consola: deben quedar versionados.

## Pipeline

La fuente de verdad es:

```text
packages/shared-types/src/models/stageConfig.ts
```

No duplicar listas de etapas en UI, documentación o servicios. Un cambio debe
probar:

- transición manual válida;
- transición inválida;
- transición automática;
- email asociado;
- historial;
- estados terminales;
- comportamiento de oferta o Calendar cuando corresponda.

## Integraciones

### Gmail y Calendar

- Tokens OAuth cifrados.
- Nunca registrar tokens.
- Manejar revocación y refresh fallido.
- Usar cuentas de prueba controladas.
- Mantener redirect URIs por entorno.

### Vertex AI

- El modo mock debe continuar disponible.
- La IA extrae y estructura información; no decide contratación.
- La salida debe validarse y normalizarse.
- El matching final es determinístico.

## Frontend

Seguir `front/DESIGN_GUIDE.md`.

- Usar el theme MUI.
- Evitar colores y spacing hardcodeados.
- Mostrar loading, empty, error y success.
- Mantener accesibilidad por teclado y labels.
- No mostrar errores internos al usuario.
- Invalidar o actualizar caché después de mutaciones.

## Pruebas

Consultar `../docs/TESTING.md`.

Un PR no está listo hasta pasar:

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Los bugs deben incluir una prueba de regresión. Integraciones externas deben
probar éxito, error, timeout/revocación y modo mock cuando aplique.

## Git

- Usar ramas cortas y PRs revisables.
- No mezclar refactors masivos con cambios funcionales.
- Usar Conventional Commits.
- No reescribir historia compartida sin coordinación.
- No desplegar desde un árbol local sucio.

Ejemplos:

```text
feat(candidate): agregar validación de perfil
fix(calendar): renovar watches vencidos
docs(operations): actualizar procedimiento de deploy
test(offer): cubrir rechazo de oferta
```

## Pull requests

Cada PR debe indicar:

- problema y alcance;
- decisión técnica;
- riesgos;
- variables o migraciones;
- pruebas ejecutadas;
- capturas si cambia UI;
- impacto en API, reglas, índices y operación;
- rollback.

## Seguridad y datos

- No usar CVs reales en fixtures.
- No copiar producción a entornos personales.
- Minimizar datos en logs.
- Rotar cualquier secreto expuesto.
- Aplicar privilegio mínimo a service accounts.
- Revisar dependencias y CodeQL.

## Documentación

Actualizar el documento canónico correspondiente:

- instalación: `../README.md`;
- arquitectura: `../docs/ARCHITECTURE.md`;
- operación: `../docs/OPERATIONS.md`;
- limitaciones: `../docs/LIMITATIONS.md`;
- API: `../docs/swagger.json`;
- frontend: `front/`;
- módulos técnicos: `../docs/technical/`.
