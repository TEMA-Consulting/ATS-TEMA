# Handoff técnico

Este documento define qué debe recibir y verificar el equipo que continúa el
desarrollo del ATS.

## Fuente de verdad

- Código de aplicación: `apps/web`, `apps/functions` y `packages/shared-types`.
- Configuración Firebase: `firebase.json`, `firestore.rules`,
  `storage.rules` y `firestore.indexes.json`.
- Instalación local: `README.md`.
- Arquitectura: `docs/ARCHITECTURE.md`.
- Despliegue y operación: `docs/OPERATIONS.md`.
- API: `docs/swagger.json` y `docs/technical/`.
- Convenciones de desarrollo: `contributing/CONTRIBUTING_GUIDE.md`.

## Estado validado

Al 18 de junio de 2026, sobre el árbol de trabajo auditado:

- frontend: lint, TypeScript, 111 tests y build de producción correctos;
- backend: TypeScript, 295 tests y compilación correctos;
- tipos compartidos: compilación correcta;
- documentación Markdown: enlaces locales y JSON validados.

El build de Next.js informa que la convención `middleware.ts` está deprecada y
deberá migrarse a `proxy.ts`.

## Decisiones pendientes antes de transferir control

1. Definir una única rama canónica y convertirla en rama por defecto.
   Actualmente `main`, `develop` y `staging` no representan el mismo estado.
2. Crear una release etiquetada y registrar el commit entregado.
3. Corregir y ejecutar satisfactoriamente el workflow de producción.
4. Transferir o recrear accesos de Firebase, Google Cloud, OAuth y GitHub.
5. Confirmar dominio, proyecto Firebase y responsables operativos del cliente.
6. Ejecutar el checklist de aceptación y registrar los resultados.

## Inventario que debe transferirse fuera de Git

Nunca agregar estos valores al repositorio:

- acceso al proyecto Firebase/Google Cloud;
- configuración del proveedor Google en Firebase Authentication;
- configuración de OAuth y redirect URIs;
- secretos `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`,
  `OAUTH_ENCRYPTION_KEY` y `CALENDAR_WEBHOOK_SECRET`;
- variables y secretos de los environments de GitHub;
- identidad de Workload Identity Federation usada para deploy;
- dominio de producción y `ALLOWED_ORIGIN`;
- procedimiento y responsables de backups;
- cuentas administrativas iniciales.

El cliente debe guardar este inventario en su gestor de secretos y documentar
propietario, fecha de rotación y alcance de cada credencial.

## Checklist de aceptación

### Repositorio

- [ ] Rama por defecto correcta y protegida.
- [ ] Árbol limpio y release etiquetada.
- [ ] CODEOWNERS actualizado con usuarios del cliente.
- [ ] CI requerida para merge.
- [ ] Sin secretos ni datos personales versionados.

### Desarrollo local

- [ ] `pnpm install --frozen-lockfile`.
- [ ] Emuladores de Auth, Firestore, Storage y Functions disponibles.
- [ ] Seed local reproducible.
- [ ] Login y roles verificables.
- [ ] `pnpm lint`, `pnpm check-types`, `pnpm test` y `pnpm build`.

### Flujos funcionales

- [ ] Alta y edición de posiciones.
- [ ] Postulación manual.
- [ ] Postulación con CV, parsing y confirmación.
- [ ] Matching y FIT%.
- [ ] Cambio de etapas e historial.
- [ ] Formularios de entrevista y notas.
- [ ] Gmail OAuth, plantillas, envío y reintento.
- [ ] Calendar OAuth, watch, webhook y renovación.
- [ ] Creación, envío y respuesta de oferta.

### Producción

- [ ] Deploy reproducible desde GitHub Actions.
- [ ] Secrets configurados y rotables.
- [ ] Reglas e índices desplegados.
- [ ] Smoke test posterior al deploy.
- [ ] Logs y alertas accesibles al responsable.
- [ ] Backup y restauración probados.
- [ ] Procedimiento de rollback aprobado.

## Alcance de soporte

El repositorio no define un SLA ni un contrato de soporte. El cliente debe
acordar por separado:

- responsables de incidentes;
- horarios y canales de soporte;
- objetivos de recuperación;
- política de retención de CVs y datos personales;
- presupuesto y alertas de consumo de Google Cloud;
- mantenimiento de dependencias y respuesta a vulnerabilidades.
