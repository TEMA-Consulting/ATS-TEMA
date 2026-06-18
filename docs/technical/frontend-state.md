# Estado y comunicación en la UI

## Estado remoto

Usar TanStack Query:

- `useQuery` para lecturas;
- `useMutation` para acciones;
- invalidación de queries luego de cambios;
- keys estables y específicas.

No copiar datos remotos a estado local salvo que exista edición transitoria.

## Formularios

Usar TanStack Form o el patrón existente de la feature. La validación de cliente
mejora UX, pero el backend debe repetir validaciones relevantes.

## Acceso a datos

Flujo preferido:

```text
Component → Hook → Service/shared API → Cloud Function o Repository
```

No agregar imports Firestore directos en componentes.

## Estados requeridos

Cada operación debe representar:

- idle;
- loading;
- success;
- error;
- retry cuando sea seguro.

Evitar doble submit deshabilitando la acción mientras está pendiente.

## Errores

- Mostrar mensajes accionables.
- No exponer stack traces ni detalles internos.
- Registrar contexto técnico en backend.
- Diferenciar autenticación, autorización, validación, conflicto y error
  transitorio.

## Optimistic updates

Usarlas solo cuando la acción sea fácilmente reversible. Para cambios de etapa,
emails, ofertas y operaciones con efectos externos, preferir confirmar la
respuesta y luego refrescar.

## Autenticación

`AuthProvider` mantiene el usuario y sesión. `middleware.ts` ayuda con ruteo,
pero no reemplaza controles backend.
