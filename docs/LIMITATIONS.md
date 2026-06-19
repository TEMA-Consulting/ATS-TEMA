# Limitaciones conocidas

Este documento registra restricciones técnicas conocidas del sistema. No
reemplaza al issue tracker ni implica que todas requieran resolución inmediata.

## Calidad

- No hay E2E automatizados.
- No se exige cobertura mínima.
- No hay pruebas automatizadas de reglas Firebase.
- No hay smoke test post-deploy automatizado.

## Plataforma

- Next.js depreca `middleware.ts` en favor de `proxy.ts`.

## Operación

- Backups, restauración y alertas no están automatizados en este repositorio.
- Swagger debe revisarse cuando se agregan o renombran Functions.

## Arquitectura

- Hay importaciones Firebase fuera de la capa de repositorios.
- Firestore es schemaless; no hay migraciones de datos versionadas.
- Algunas funciones son HTTP y otras Callable; mantener ambos clientes aumenta
  la superficie de integración.
