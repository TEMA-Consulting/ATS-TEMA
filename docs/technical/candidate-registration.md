# Registro de candidatos y CV

## Modos

### Manual

1. El frontend autentica técnicamente al candidato.
2. Envía el perfil completo a `registerCandidate`.
3. Backend valida y normaliza.
4. Persiste candidato y aplicación activa.
5. Un CV adjunto se guarda, pero no se parsea.

### Asistido por CV

1. `registerCandidateCV` crea candidato y aplicación draft.
2. El frontend sube el PDF a `cvs/{candidateId}/...`.
3. `onCVUploaded` marca `processing`.
4. `CvUploadService` descarga el archivo.
5. `CvParsingService` usa mock o Vertex AI.
6. El perfil normalizado queda editable.
7. El usuario revisa y completa los datos.
8. `confirmCandidateProfile` activa la postulación.
9. `discardCandidateDraft` permite limpiar un draft válido.

## Estados

El candidato usa `profileStatus` y `cvParseStatus`. La aplicación por CV comienza
con `status=draft` y `stage=profile_pending`; solo se activa luego de la
confirmación.

## Normalización

- email en minúsculas;
- teléfono normalizado;
- strings sin espacios sobrantes;
- skills deduplicadas;
- experiencia y educación estructuradas;
- campos generados por IA tratados como propuesta editable.

## Seguridad

- Los endpoints requieren Firebase ID token.
- No confiar en IDs arbitrarios del body para autorizar acceso.
- Los PDFs deben cumplir Storage Rules.
- No registrar contenido completo del CV.
- Usar datos ficticios en tests.

## Archivos principales

- `apps/functions/src/callables/candidateCallables.ts`;
- `apps/functions/src/services/candidateService.ts`;
- `apps/functions/src/services/cvUploadService.ts`;
- `apps/functions/src/services/parsing/`;
- `apps/functions/src/triggers/onCvUploaded.ts`;
- `apps/web/app/features/postulation/`;
- `packages/shared-types/src/contracts/candidatePostulation*.ts`.

## Pruebas

Cubrir registro, conflictos, validación, estados del parsing, reintento,
normalización, confirmación, descarte y alta manual con CV sin parsing.
