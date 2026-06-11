# Code review (Codex) — 2026-06-09

Review integral generado con `codex exec` (OpenAI Codex v0.136.0, modelo gpt-5.5),
sobre `index.html`, `privacidad/index.html`, `assets/styles.css`,
`assets/legal.css`, `assets/script.js`. Estado del código: rama
`copy/home-refresh` (hero + copy refresh).

> **Sin hallazgos CRÍTICOS.** Severidades: ALTO → NIT.

## ALTO

- **`assets/script.js:46-50`** — Al cerrar el menú móvil con clic en un enlace se
  actualiza `aria-expanded="false"` y `hidden`, pero no se restaura el
  `aria-label` a "Abrir menú". Lectores de pantalla quedan con el botón
  anunciado como "Cerrar menú" con el menú ya cerrado.
  → En el handler de links: `toggle.setAttribute("aria-label", "Abrir menú");`.

- **`privacidad/index.html:100,114`** — La nav enlaza a `../#instagram`, pero esa
  sección está comentada/removida en `index.html`. Enlace roto.
  → Quitar "Galería" de la página legal o restaurar una sección con `id="instagram"`.

## MEDIO

- **`index.html:335,371`** — Imágenes de "Fajas" y "Monturas" con `alt=""` siendo
  el contenido visual principal de tarjetas clicables. (a11y + SEO de imágenes).
  → Alt descriptivo o reemplazar por fotos reales locales. *(Ya pendiente: son los
  2 placeholders de Unsplash a la espera de fotos del cliente.)*

- **`assets/styles.css:275-284`** — FAB de WhatsApp: ícono blanco sobre `#25D366`
  ≈ 1.98:1 de contraste (bajo el mínimo para componentes gráficos).
  → Verde más oscuro, ícono en `#1A1714`, o borde/overlay.

- **`assets/styles.css:94-98,486-493` · `assets/legal.css:58-64,86-90`** —
  `--accent-deep` sobre crema ≈ 2.99:1 y `--accent` sobre crema ≈ 1.97:1 en
  marcadores/estrellas/textos pequeños (bajo WCAG para texto normal).
  → Oscurecer `--accent-deep` para texto pequeño, o reservar `--accent` solo para
  fondos oscuros/decoración no informativa.

- **`index.html:548-550`** — El iframe de Google Maps carga de inmediato con
  `referrerpolicy="no-referrer-when-downgrade"` (envía datos a Google al cargar).
  → `referrerpolicy="no-referrer"` o `strict-origin-when-cross-origin`; idealmente
  placeholder "Cargar mapa" + cargar el iframe tras interacción.

- **`index.html:335,371`** — Dos imágenes de categoría dependen de Unsplash
  externo (performance/privacidad/disponibilidad + requests de terceros).
  → Servir desde `assets/categorias/` o reemplazar por fotos reales optimizadas.

- **`index.html:64-70`** — En JSON-LD, `contactOption: "WhatsApp"` no es un valor
  estándar de Schema.org para `ContactPoint` (puede degradar el dato estructurado).
  → Quitar `contactOption` y expresar WhatsApp con `contactType: "sales"` + teléfono.

- **`privacidad/index.html:18-23`** — La página legal tiene OG básico pero sin
  `og:image`, `twitter:card`, `twitter:title/description/image`.
  → Agregar metadatos equivalentes, o `noindex` si no se quiere optimizar para social.

- **`index.html:36` · `privacidad/index.html:27`** — Google Fonts render-blocking +
  dependencia externa (LCP/privacidad).
  → Self-host WOFF2 con `font-display: swap`, o reducir familias/pesos/variaciones.

## BAJO

- **`index.html:127`** — Logo de la home usa `href="#"` (cambia el fragmento URL).
  → `href="/"` o `href="https://barretos.cr/"`.

- **`assets/styles.css:666-731,977,1007` · `assets/script.js:54-61`** — CSS/JS del
  lookbook/rail sin uso (sección Instagram comentada).
  → Eliminar hasta restaurar, o documentar como bloque reactivable.

- **`assets/styles.css:165-172,188-191`** — Clases sin uso visible: `.btn--mini`,
  `.btn--block`, `.btn .dot`, `.section-head--split`.
  → Borrar si no hay uso planeado.

- **`index.html:545-554`** — El wrapper del mapa tiene `aria-label` redundante con
  el `title` del iframe.
  → Mantener solo el `title`, o usar `<figure>` con texto visible.

## NIT

- **`assets/script.js:65,69`** — Variable `last` asignada pero no usada.
  → Eliminar `let last = 0;` y `last = y;`.

- **`index.html:222` · `assets/styles.css:215,465`** — La clase `.brand` se usa
  para el enlace del logo y para los items del grid de marcas.
  → Renombrar items a `.brand-item` para evitar colisiones futuras.
