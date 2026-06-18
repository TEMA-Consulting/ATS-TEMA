# Acceso al CV

Aunque la función se llama `getCvSignedUrl`, actualmente no genera una URL
firmada.

## Flujo vigente

1. El frontend llama `GET getCvSignedUrl?applicationId=...`.
2. La Function valida el Firebase ID token.
3. Busca la aplicación y el candidato.
4. Devuelve `cvStoragePath`.
5. El frontend usa Firebase Storage `getDownloadURL`.
6. Storage Rules autorizan o rechazan la lectura.

## Contrato

```ts
interface GetCvSignedUrlPayload {
  applicationId: string;
}

interface GetCvSignedUrlResponse {
  cvStoragePath: string;
}
```

## Archivos

- Function: `apps/functions/src/callables/getCvSignedUrl.ts`;
- contrato: `packages/shared-types/src/contracts/getCvSignedUrl.ts`;
- cliente: `apps/web/app/shared/api/applicationsApi.ts`;
- reglas: `storage.rules`.

## Consideración

El nombre es heredado y puede inducir a error. Si se cambia por
`getCvStoragePath`, mantener compatibilidad temporal y actualizar frontend,
Swagger y documentación.
