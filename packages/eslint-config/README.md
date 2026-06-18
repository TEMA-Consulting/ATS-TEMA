# Configuración ESLint compartida

Configuraciones usadas por las aplicaciones del monorepo:

- `base.js`;
- `next.js`;
- `react-internal.js`.

Las aplicaciones deben consumir este paquete mediante `workspace:*`. Ejecutar
el lint desde la raíz con `pnpm lint`.
