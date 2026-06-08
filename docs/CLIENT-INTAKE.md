# Respuesta del cliente — Barretos Western Store

> Texto crudo recibido del cliente el **2026-06-08** vía WhatsApp/correo. Es la fuente de verdad para actualizar la copia del sitio, la política de privacidad y el JSON-LD. Cuando se aplique al sitio, dejar este archivo intacto como referencia histórica.

---

## Datos legales (sociedad)

- **Razón social:** GRUPO BARRETOS SOCIEDAD ANONIMA
- **Cédula jurídica:** 3-101-903898

> **Acción:** actualizar el campo "Responsable del tratamiento" en `privacidad/index.html` con razón social + cédula, y considerar usar la sociedad como `legalName` en el JSON-LD `ClothingStore`. Permite cerrar uno de los Open Items del CLAUDE.md y avanza el registro de `barretos.cr`.

## Categorías de producto

- Ropa
- Botas
- Fajas
- Billeteras
- Sombreros
- Gorras
- Monturas
- Mantillones
- Aperos
- Accesorios

> **Categoría más vendida:** botas. Debe ser la primera o estar destacada en la sección de categorías.

> **Acción:** revisar la grilla de "5 categorías" en `index.html`. El cliente nombra 10; hay que decidir cuáles 5 destacar (sugerencia: Botas, Sombreros, Ropa, Monturas/Aperos, Accesorios) o expandir a 10. Confirmar con el cliente.

## Marcas que distribuyen

- Justin Boots
- Nokota Horse
- Tony Lamas
- Ariat
- Kimes Ranch
- Mesace *(verificar deletreo — posible "Macie" o "Masace")*
- Yellowstone *(escrito "Yellostone" en el original)*
- Wrangler
- Roper *(escrito "rooper" en el original)*
- Ranch Corral

### Distribución exclusiva
- **Nokota Horse**
- **Justin Boots**
- **Wrangler** (botas — "Wrangler Boots")

> **Acción:** actualizar el "brands strip" en la home. Marcar las exclusivas con un badge o nota. Confirmar deletreo correcto de "Mesace" con el cliente antes de publicar.

## Dirección oficial

> Cartago, carretera a Paraíso, del Restaurante Versalles 75 metros sur.

**Coordenadas confirmadas (Google Maps):** `9.8600137, -83.9061027`.
**Place ID en Google Maps:** `0x8fa0df0044b1fad7:0x3543ecd8f7243706` ("Barretos Western Store CR").

> **Aplicado al sitio (2026-06-08):**
> 1. JSON-LD: `streetAddress`, `geo.latitude`, `geo.longitude` actualizados.
> 2. Sección "Visítanos": dirección + iframe oficial de Google Maps con el place ID real.
> 3. Hero meta: actualizada a "Cartago, carretera a Paraíso".
> 4. CTA "Abrir en Waze" usa coords reales.

## Horario (completo, confirmado 2026-06-08)

- **Lunes a viernes:** 8:00 a.m. – 5:00 p.m.
- **Sábado:** 9:00 a.m. – 4:00 p.m.
- **Domingo:** cerrado

> **Aplicado al sitio (2026-06-08):**
> 1. JSON-LD `openingHoursSpecification` con dos entradas: Mo–Fr 08:00–17:00 y Sa 09:00–16:00.
> 2. Sección "Visítanos" y meta de la home actualizadas.

---

## Fotos enviadas por el cliente

Se guardan en `docs/client-photos/`. Cuando se vayan a usar como assets reales del sitio, moverlas/optimizarlas a `assets/` y reemplazar los placeholders de Unsplash junto con los `<!-- TODO alt: ... -->` correspondientes en `index.html`.

## Open Items que esta respuesta cierra

De los "Open Items Waiting on Client" en `CLAUDE.md`:

- [x] Sociedad legal name + cédula jurídica — aplicado a `privacidad/` + JSON-LD `legalName`/`taxID`
- [x] Dirección — aplicado a JSON-LD, Visítanos, hero meta y mapa con place ID real
- [x] Horario completo (Lun–Vie 8–17, Sáb 9–16, Dom cerrado) — aplicado
- [x] Logo nuevo — convertido a WebP (alpha, 800px / 400px) y montado en el hero
- [ ] Real catalog photos para reemplazar Unsplash en categorías / Instagram lookbook
- [ ] Real testimonials with consent — sigue pendiente
- [ ] Confirmar teléfono legal de la sociedad (asumimos +506 8844 3180)
- [ ] Marca "Mesace": verificar deletreo correcto antes de mostrar
- [ ] Decisión: categorías grid sigue en 5 o expande a 10 — depende del cliente
