# Respuesta del cliente — Barretos Western Store

> Texto crudo recibido del cliente el **2026-06-08** vía WhatsApp/correo. Es la fuente de verdad para actualizar la copia del sitio, la política de privacidad y el JSON-LD. Cuando se aplique al sitio, dejar este archivo intacto como referencia histórica.

---

## Datos legales (sociedad)

- **Razón social:** Grupo Barretos Sociedad Anónima
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

> **Acción:** actualizar:
> 1. JSON-LD `ClothingStore.address` (`streetAddress`) en `index.html`
> 2. Sección "Visítanos" / mapa
> 3. Footer si aplica
> 4. Confirmar coordenadas geo (`latitude`/`longitude`) contra la nueva dirección — el `geo` del JSON-LD debe coincidir.

## Horario

- **Lunes a viernes: 8:00 a 17:00 — jornada continua**
- Sábados/domingos: no especificado por el cliente

> **Acción:**
> 1. Actualizar `openingHoursSpecification` en JSON-LD a `Mo,Tu,We,Th,Fr 08:00-17:00`
> 2. Actualizar sección "Visítanos" en la home
> 3. **Preguntar al cliente** si abren sábados/domingos o están cerrados — el JSON-LD necesita esa info para no mentir.

---

## Fotos enviadas por el cliente

Se guardan en `docs/client-photos/`. Cuando se vayan a usar como assets reales del sitio, moverlas/optimizarlas a `assets/` y reemplazar los placeholders de Unsplash junto con los `<!-- TODO alt: ... -->` correspondientes en `index.html`.

## Open Items que esta respuesta cierra

De los "Open Items Waiting on Client" en `CLAUDE.md`:

- [x] Sociedad legal name + cédula jurídica
- [x] Dirección
- [x] Horario (parcial — falta confirmar fines de semana)
- [ ] Real catalog photos — pendiente verificar las fotos enviadas
- [ ] Real testimonials with consent — sigue pendiente
- [ ] Confirmar teléfono legal — sigue pendiente (asumimos +506 8844 3180)
