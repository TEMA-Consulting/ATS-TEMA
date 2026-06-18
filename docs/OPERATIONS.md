# Operación y despliegue

## Entornos

El repositorio contempla desarrollo local con emuladores, staging y producción.
Cada entorno debe usar un proyecto Firebase distinto. No usar el proyecto de
producción para pruebas manuales o seeds.

## Despliegue recomendado

El despliegue versionado se realiza desde GitHub Actions:

- `.github/workflows/deploy.yml`: staging;
- `.github/workflows/deploy-production.yml`: producción manual.

Antes de usar producción se debe:

1. ejecutar lint, tipos, tests y build;
2. proteger el environment `production` con aprobación;
3. comprobar todos los secrets;
4. desplegar desde una versión identificable.

No ejecutar un deploy de producción desde un árbol local sin commit.

## Variables del frontend

Consultar `apps/web/.env.example`. Las variables `NEXT_PUBLIC_*` quedan
embebidas en el bundle y no son secretos.

El servidor Next.js usa Application Default Credentials para verificar sesiones.
En infraestructura Google se recomienda una service account adjunta. Fuera de
Google Cloud puede usarse `GOOGLE_APPLICATION_CREDENTIALS`, guardando el JSON
fuera del repositorio y con permisos mínimos.

## Variables y secretos de Functions

Consultar `apps/functions/.env.example`.

Configurar mediante Secret Manager:

```bash
firebase functions:secrets:set OAUTH_ENCRYPTION_KEY
firebase functions:secrets:set CALENDAR_WEBHOOK_SECRET
```

No regenerar `OAUTH_ENCRYPTION_KEY` mientras existan credenciales OAuth
cifradas: hacerlo impediría descifrarlas.

Las credenciales OAuth también deben tratarse como secretos en CI.

## Configuración externa

### Firebase Authentication

- habilitar Google;
- habilitar Email/Password si se usa acceso administrativo;
- registrar los dominios autorizados;
- verificar el dominio corporativo esperado por la aplicación.

### Google OAuth

- habilitar Gmail API y Google Calendar API;
- registrar origins y redirect URIs exactos;
- configurar la pantalla de consentimiento;
- limitar usuarios de prueba mientras la app no esté publicada;
- revisar scopes y política de verificación de Google.

### Vertex AI

- habilitar Vertex AI en el proyecto;
- otorgar a la identidad de Functions permisos para invocar el modelo;
- configurar región y proyecto cuando difieran de los valores por defecto.

## Smoke test posterior al deploy

1. Abrir `/` y `/jobs`.
2. Verificar `healthCheck`.
3. Iniciar sesión con cada rol requerido.
4. Listar y abrir posiciones.
5. Crear una postulación de prueba.
6. Cargar un PDF y verificar el estado del parsing.
7. Cambiar una etapa sin email.
8. Cambiar una etapa con email usando una cuenta controlada.
9. Crear una oferta y abrir su URL pública.
10. Revisar logs de Functions y Firestore.

Eliminar o anonimizar los datos de prueba al finalizar.

## Logs y monitoreo

Usar Google Cloud Logging para:

- errores de Functions;
- fallos de parsing;
- errores de Gmail y refresh tokens;
- webhooks rechazados;
- watches de Calendar próximos a vencer;
- reintentos de email;
- errores de autorización.

Configurar alertas como mínimo para:

- incremento de errores 5xx;
- fallos repetidos de tareas programadas;
- consumo o costo por encima del presupuesto;
- errores de deploy;
- cuota de Functions, Firestore, Storage o Vertex AI.

No registrar access tokens, refresh tokens, CVs completos ni datos personales
innecesarios.

## Backup y restauración

El repositorio no automatiza backups. El operador debe definir:

- export periódico de Firestore;
- retención y versionado de Storage;
- ubicación y cifrado de backups;
- responsables y frecuencia;
- objetivo de recuperación;
- prueba documentada de restauración.

Antes de una migración o cambio destructivo:

1. exportar Firestore;
2. respaldar Storage;
3. registrar commit y release desplegados;
4. verificar que el backup pueda leerse.

## Rollback

1. Identificar la última release funcional.
2. Revertir o desplegar ese commit mediante el mismo pipeline.
3. Evitar rollback de datos sin evaluar cambios de esquema.
4. Confirmar Functions, Hosting, reglas e índices.
5. Ejecutar el smoke test.
6. Documentar causa, impacto y acciones posteriores.

## Incidentes de credenciales

Ante exposición o sospecha:

1. revocar la credencial;
2. rotar el secreto;
3. redeployar las funciones afectadas;
4. invalidar sesiones o tokens cuando corresponda;
5. revisar logs y alcance;
6. registrar el incidente sin copiar secretos en tickets.
