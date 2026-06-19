# Sistema de diseño frontend

La fuente de verdad ejecutable es `apps/web/app/lib/theme.ts`.

## Base

- Material UI 9;
- tipografía de sistema;
- spacing de MUI;
- bordes y componentes definidos en el theme;
- no se usa Tailwind.

## Paleta

| Semántica      | Valor actual |
| -------------- | ------------ |
| primary        | `#2563eb`    |
| primary dark   | `#1d4ed8`    |
| primary light  | `#dbeafe`    |
| background     | `#f8fafc`    |
| paper          | `#ffffff`    |
| text primary   | `#0f172a`    |
| text secondary | `#334155`    |
| error          | `#ef4444`    |
| success        | `#16a34a`    |

Usar `theme.palette`, props semánticas o `sx` basado en theme. Evitar colores
hardcodeados fuera del archivo de tema.

## Componentes

- Reutilizar componentes MUI antes de crear primitivas nuevas.
- Las Cards ya incluyen borde, padding y radio global.
- Los Buttons no usan uppercase ni elevation.
- Los inputs outlined usan fondo y radio global.
- Usar `Stack`, `Box` y `Grid` para layout.
- No fijar alturas que rompan contenido traducido o errores.

## Estados

Toda pantalla de datos debe contemplar:

- loading visible;
- empty state accionable;
- error comprensible;
- botones disabled durante envío;
- confirmación de éxito;
- reintento cuando sea seguro.

## Formularios

- Label persistente y texto de ayuda cuando corresponda.
- Errores asociados al campo.
- Validación de cliente para UX y de servidor para seguridad.
- No perder datos del usuario ante un error recuperable.
- Confirmar acciones destructivas.

## Accesibilidad

- Elementos interactivos accesibles por teclado.
- Icon buttons con `aria-label`.
- Contraste suficiente.
- Orden de foco lógico.
- No comunicar estados únicamente por color.
- Dialogs con título y foco controlado.

## Responsive

Diseñar primero para los breakpoints MUI. El dashboard debe seguir siendo
operable en pantallas pequeñas, aunque el uso principal sea desktop.

## Revisión visual

Un PR de UI debe incluir:

- captura desktop;
- captura mobile cuando aplica;
- loading, empty y error;
- revisión de teclado;
- evidencia de que no introdujo warnings de consola.
