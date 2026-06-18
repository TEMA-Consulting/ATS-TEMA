# Limitaciones y deuda conocida

Este archivo registra condiciones relevantes para el equipo receptor. No
reemplaza al issue tracker.

## Entrega y CI/CD

- La rama por defecto y las ramas de integración no están alineadas.
- El workflow de producción requiere revisión de permisos WIF.
- CI no ejecuta explícitamente `check-types` ni `build`.
- CODEOWNERS debe reemplazarse con responsables vigentes.

## Calidad

- No hay E2E automatizados.
- No se exige cobertura mínima.
- No hay pruebas automatizadas de reglas Firebase.
- No hay smoke test post-deploy automatizado.

## Plataforma

- Next.js depreca `middleware.ts` en favor de `proxy.ts`.
- No existe infraestructura on-premises implementada.

## Operación

- Backups, restauración y alertas no están automatizados en este repositorio.
- No hay SLA, RTO, RPO ni política de retención definidos.
- Swagger debe revisarse cuando se agregan o renombran Functions.

## Arquitectura

- Hay importaciones Firebase heredadas fuera de la capa de repositorios.
- Firestore es schemaless; no hay migraciones de datos versionadas.
- Algunas funciones son HTTP y otras Callable; mantener ambos clientes aumenta
  la superficie de integración.
