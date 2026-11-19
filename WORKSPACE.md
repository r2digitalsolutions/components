# Estética «workspace» (paneles y back-offices)

Guía para que todos los paneles (Evobusiness, Gestor, CRM, etc.) se vean y se usen igual.
Úsala siempre que montes un panel de gestión con varias secciones. La referencia visual es el panel de Evobusiness.

## Estructura

```
Escritorio (≥ lg)   NavRail (solid, con etiquetas) | SectionNav | barra superior + contenido
Tablet (md)         NavRail                        |              barra superior + contenido
Móvil               cabecera móvil / contenido / BottomNav con botón + central
```

Todo se monta con `WorkspaceShell`, que solo coloca las piezas. Cada app pasa sus snippets:

| Zona           | Componente                                                                              | Notas                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `rail`         | `NavRail variant="solid" showLabels`                                                    | Máximo 5 o 6 secciones arriba. Admin y la cuenta van en `footerItems`. Los contadores van en `badge`.                        |
| `secondary`    | `SectionNav`                                                                            | Título y una línea de la sección. Arriba, el `OrgSwitcher` en `header`. Abajo, en `footer`, el progreso o un enlace público. |
| `topbar`       | migas + buscador (`CommandPalette`, Ctrl K) + botón **Crear** + campana                 | Altura de unos 60px y fondo transparente con desenfoque.                                                                     |
| `mobileHeader` | switcher compacto + lupa + campana, y las subsecciones como pestañas (`Tabs` o enlaces) |                                                                                                                              |
| `bottomNav`    | `BottomNav variant="docked" fabShape="square" activeStyle="color"` con `href` e `iconComponent`                              | 4 secciones y un `primary: true` en el centro para «Crear».                                                                  |

Varias cuentas o empresas: `OrgSwitcher` (con `title`, `subtitle`, `badge`, `createLabel` y `footerNote`) en escritorio, y `ProfilePicker` (pantalla tipo perfiles de Netflix) en móvil y al entrar si hay más de una.

## Portada de la sección «Inicio» (dashboard)

1. `EntityHero coverSize="md"`: portada, logo, nombre, badges de estado y acciones (Compartir, QR, Editar). Los botones de la portada (Cambiar portada, Ajustar encuadre) van en el snippet `coverActions`: salen al pasar el ratón y siempre en táctil.
2. Fila de 4 `StatCard` con `labelIcon`, `sparkline` y `delta` en `deltaStyle="pill"`. En el móvil, en una fila con scroll lateral.
3. **Bandeja** (lo que necesita respuesta) con `ActionRow`: un icono con el `tone` del tipo, el título, `meta` con la fecha y la acción principal a la derecha (Responder, Aceptar…). Todo en una `Card`, con `Tabs` para filtrar.
4. Columna derecha: agenda de hoy, un resumen del escaparate y las tareas pendientes.

## Reglas visuales

- **Color:** solo los tokens `brand-*`. Cada app los redefine en su `@theme` (Evobusiness usa el verde `#31855b` como `brand-500`). Nunca pongas colores fijos en los componentes. Ámbar para avisos, rojo solo para errores y para borrar.
- **Superficies:** fondo `bg-surface`, tarjetas `bg-surface-elevated` con `border-border`, `rounded-2xl` y `shadow-sm` como mucho.
- **Texto:** Inter. Títulos `font-bold tracking-tight`. Etiquetas de grupo en `text-[11px] uppercase tracking-wider text-muted`.
- **Contadores:** en la barra verde, píldora ámbar. En los menús claros, píldora `brand-600` si requiere acción y gris si solo informa.
- **Iconos:** Lucide, con `strokeWidth` 1.75–1.9 y un tamaño de 18–20px en los menús.
- **Densidad:** filas de menú con `py-2` y tarjetas con `p-4`/`p-5`. Separación entre bloques de `gap-4`.

## Reglas de uso (todas las apps)

- Nada de elementos nativos sueltos (`<button>`, `<select>`, `<input>`…) en las apps: usa siempre los de esta librería. Si falta algo, se crea aquí, con su story, y se publica.
- Para los estados vacíos, `EmptyState`.
- En los modales (`Dialog`), las acciones van en el footer.
- Cada guardado o error termina en un toast. Donde se pueda, autoguardado.
- Los componentes nuevos van en la carpeta de su nivel (`atoms`, `molecules`, `organisms` o `templates`), con `XStory.svelte` y `X.stories.ts`, y se exportan en `src/lib/index.ts`.
