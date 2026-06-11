# Restaurar la sección Instagram Lookbook

## Estado actual

La sección "En vivo desde @barretoscr" (galería horizontal con posts de Instagram)
está **oculta** desde el 2026-06-09. Se retiró porque el feed mostraba placeholders
de Unsplash, no fotos reales. El CSS y el JS también fueron removidos en
`fix/codex-review` (2026-06-10) para no mantener dead code.

Commits relevantes:
- `a417c8e` — ocultó la sección HTML y los enlaces "Galería" del nav
- `fd834e2` — eliminó el CSS (`.lookbook`, `.ig-card`, `.rail-controls`) y el JS del rail

---

## Pasos para restaurar (con fotos reales)

### 1. Restaurar el HTML de la sección

El siguiente bloque va en `index.html`, entre la sección `<!-- INSTAGRAM LOOKBOOK (oculto temporalmente) -->` y `<!-- TESTIMONIOS -->`. Reemplaza el comentario marcador completo:

```html
<!-- ━━━━━━━━━━━━━━━━━━━━ INSTAGRAM LOOKBOOK ━━━━━━━━━━━━━━━━━━━━ -->
<section class="lookbook" id="instagram" aria-labelledby="ig-title">
  <div class="container">
    <header class="section-head section-head--split">
      <div>
        <h2 id="ig-title" class="display display--md">
          En vivo desde<br>
          <em>@barretoscr</em>
        </h2>
      </div>
      <a class="btn btn--ghost" href="https://instagram.com/barretoscr" rel="noopener">Seguir en Instagram &rarr;</a>
    </header>

    <div class="lookbook-rail" data-rail>
      <!-- Reemplazar estas imágenes por las fotos reales del cliente.
           Cada <img> debe llevar alt descriptivo del post,
           ej: alt="Cliente en tope de San Carlos con sombrero y botas Justin Boots" -->
      <article class="ig-card"><img src="..." alt="..." loading="lazy"></article>
      <article class="ig-card"><img src="..." alt="..." loading="lazy"></article>
      <article class="ig-card"><img src="..." alt="..." loading="lazy"></article>
      <article class="ig-card"><img src="..." alt="..." loading="lazy"></article>
      <article class="ig-card"><img src="..." alt="..." loading="lazy"></article>
      <article class="ig-card"><img src="..." alt="..." loading="lazy"></article>
    </div>

    <div class="rail-controls">
      <button type="button" data-rail-prev aria-label="Anterior">&larr;</button>
      <button type="button" data-rail-next aria-label="Siguiente">&rarr;</button>
    </div>
  </div>
</section>
```

### 2. Restaurar los enlaces "Galería" en el nav

En `index.html`, descomentar en **ambos** navs:

```html
<!-- nav desktop (site-nav--right) -->
<li><a href="#instagram">Galería</a></li>   <!-- antes de Visítenos -->

<!-- nav móvil (#mobile-nav) -->
<li><a href="#instagram">Galería</a></li>   <!-- después de Por qué Barretos -->
```

Y en `privacidad/index.html` agregar manualmente (no queda cubierto por el revert):

```html
<!-- site-nav--right, antes de Visítenos -->
<li><a href="../#instagram">Galería</a></li>

<!-- #mobile-nav, después de Por qué Barretos -->
<li><a href="../#instagram">Galería</a></li>
```

### 3. Restaurar el CSS en `assets/styles.css`

Pegar este bloque **después** de `.why-cta` y **antes** de `/* Testimonials */`:

```css
/* ━━━━━━━━━━━━━━━━━━━━ Lookbook / IG ━━━━━━━━━━━━━━━━━━━━ */

.lookbook { padding-block: clamp(80px, 11vw, 140px); }

.lookbook-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 78%;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: var(--gutter);
  padding-bottom: 16px;
  margin: 0 calc(var(--gutter) * -1);
  padding-inline: var(--gutter);
  scrollbar-width: thin;
  scrollbar-color: var(--rule-strong) transparent;
}
.lookbook-rail::-webkit-scrollbar { height: 6px; }
.lookbook-rail::-webkit-scrollbar-thumb { background: var(--rule-strong); border-radius: 3px; }

.ig-card {
  scroll-snap-align: start;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--rule);
  background: var(--bg-soft);
}
.ig-card img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  filter: contrast(1.04) saturate(0.92);
  transition: transform 1s var(--ease);
}
.ig-card:hover img { transform: scale(1.05); }
.ig-card::after {
  content: "@barretoscr";
  position: absolute;
  bottom: 14px; left: 14px;
  font-family: var(--f-display);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--bg);
  background: rgba(26,23,20,0.65);
  padding: 5px 10px;
  border-radius: 999px;
}

.rail-controls {
  display: flex; gap: 10px; justify-content: flex-end;
  margin-top: 18px;
}
.rail-controls button {
  appearance: none;
  width: 46px; height: 46px;
  border-radius: 50%;
  border: 1px solid var(--rule-strong);
  background: transparent;
  color: var(--ink);
  font-size: 18px;
  cursor: pointer;
  transition: background .25s var(--ease), color .25s var(--ease);
}
.rail-controls button:hover { background: var(--ink); color: var(--bg); }
```

También agregar estos overrides en los dos media queries existentes:

```css
/* dentro de @media (min-width: 600px) */
.lookbook-rail { grid-auto-columns: 48%; }

/* dentro de @media (min-width: 860px) */
.lookbook-rail { grid-auto-columns: 30%; gap: 18px; }
```

Y restaurar `.section-head--split` (usado en el header del lookbook), en la sección `Section heads`:

```css
.section-head--split {
  max-width: none;
  display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px;
}
```

### 4. Restaurar el JS en `assets/script.js`

Pegar este bloque dentro del IIFE, antes del handler del header scroll:

```js
const rail = document.querySelector("[data-rail]");
const prev = document.querySelector("[data-rail-prev]");
const next = document.querySelector("[data-rail-next]");
if (rail && prev && next) {
  const step = () => Math.round(rail.clientWidth * 0.6);
  prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));
}
```

### 5. Bump CSS cache-bust

Actualizar `?v=` en los tres refs de `index.html` y `privacidad/index.html`.

---

## Notas para la integración real

- Las imágenes deben ser **locales** (`assets/lookbook/`) o de un CDN propio,
  no de Unsplash ni hotlink de Instagram (Instagram bloquea src directos).
- Alternativas para el feed dinámico: exportación manual semanal, servicio como
  Embedsocial o Behold, o una Instagram Basic Display API token (caduca cada 60 días,
  requiere renovación automática).
- Cada `<img>` necesita `alt` descriptivo del post para SEO y accesibilidad.
- El rail actual es un scroll horizontal CSS nativo — no depende de ninguna librería.
- GA4 event `social_click` con `network: "instagram"` ya está configurado en `script.js`
  para el enlace "Seguir en Instagram" del header de la sección.
