# Functions en producción

La guía operativa completa está en `../../docs/OPERATIONS.md`.

## Secrets

```bash
firebase functions:secrets:set OAUTH_ENCRYPTION_KEY
firebase functions:secrets:set CALENDAR_WEBHOOK_SECRET
```

No regenerar `OAUTH_ENCRYPTION_KEY` mientras existan tokens OAuth cifrados.

Las credenciales OAuth deben administrarse desde el environment de CI o Secret
Manager. No guardarlas en `.env` versionados.

## Variables

Consultar `.env.example`. En producción son especialmente relevantes:

- `GOOGLE_OAUTH_CLIENT_ID`;
- `GOOGLE_OAUTH_CLIENT_SECRET`;
- `GMAIL_MOCK=false`;
- `CALENDAR_WEBHOOK_URL`;
- `ALLOWED_ORIGIN`;
- `OFFER_PUBLIC_BASE_URL`;
- `CV_PARSER_MODEL`;
- `VERTEX_LOCATION`;
- proyecto de Google Cloud.

## Calendar

1. Desplegar `calendarWebhook`.
2. Configurar su URL HTTPS exacta.
3. Configurar OAuth origins y redirect URIs.
4. Conectar una cuenta de prueba.
5. Verificar credencial cifrada, watch y sync token.
6. Crear un evento de prueba.
7. Revisar logs.
8. Confirmar la ejecución diaria de `renewCalendarWatches`.

## Deploy

El método esperado es GitHub Actions. No desplegar manualmente salvo
procedimiento de emergencia documentado.

Antes:

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Después, ejecutar el smoke test de `../../docs/OPERATIONS.md`.
