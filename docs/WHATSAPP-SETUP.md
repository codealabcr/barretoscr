# WhatsApp Business Setup — Barretos Western Store CR

Checklist para que el cliente deje WhatsApp en estado profesional. El sitio actual usa enlaces `wa.me/50688443180?text=…` (click-to-chat) que **no requieren aprobación de Meta** y funcionan contra cualquier WhatsApp. Lo que sigue eleva la experiencia y desbloquea features.

> **Setup actual del sitio:** todos los CTAs apuntan a `wa.me/50688443180` con mensajes pre-llenados por categoría (ej. "Hola Barretos, quiero ver botas"). El número está además en el JSON-LD `ClothingStore.telephone` para SEO local y en el footer como link directo.

---

## Mínimo viable (lo que falta YA)

- [ ] **WhatsApp Business App** instalada en el teléfono del número `8844-3180`
      (gratis, App Store / Play Store, 5 minutos — es **distinta** al WhatsApp normal)
- [ ] **Display name** configurado como `Barretos Western Store`
      (así aparece arriba del chat en vez del número)
- [ ] **Perfil de empresa completo**: foto (logo), descripción, dirección, horario,
      sitio web `barretos.cr`, email, categoría "Ropa"
- [ ] **Mensaje de bienvenida automático**:
      _"¡Hola! Gracias por escribir a Barretos. Te respondemos en máx 30 min en horario hábil."_
- [ ] **Mensaje de ausencia** para fuera de horario
- [ ] **Respuestas rápidas** para preguntas frecuentes (tallas, envíos, precios)
- [ ] **Etiquetas** para organizar chats (Nuevo, En venta, Vendido, Cliente recurrente)
- [ ] **Verificar que el número 8844-3180 sea el correcto** (no fue confirmado por el cliente, solo extraído de redes)

## Recomendado (próximas 2 semanas)

- [ ] **Catálogo de WhatsApp**: subir 20-30 productos con foto + nombre + precio + descripción.
      Aparece dentro del chat como mini-tienda. La mejor extensión gratis del "no tenemos e-commerce todavía".
- [ ] **Conectar a Meta Business Suite** (vincula IG `@barretoscr` + FB + WA en un dashboard)
- [ ] **Política de privacidad** ✅ ya está en `/privacidad/` (referenciada en el perfil de WA Business)
- [ ] **Términos de uso del catálogo** si vende por el catálogo de WA
- [ ] **Pixel de Meta** en el sitio si planean correr ads — se puede dejar prepacheado

## Cuando crezcan (3-6 meses)

- [ ] **WhatsApp Business Platform (Cloud API)** — necesario si quieren:
  - Responder desde múltiples agentes / computadoras simultáneamente
  - Enviar mensajes masivos legales (broadcasts a opt-ins)
  - Integrar con un CRM
  - Bot de respuestas automáticas con AI
  - **Sí requiere** Meta Business Verification: documento legal, comprobante de domicilio fiscal, etc.
- [ ] **Green tick (cuenta verificada oficialmente)** — pedirla cuando tengan +500 chats/mes con buenos ratings. Es la "palomita verde" oficial de WA Business.

## Lo que NO necesitan

- ❌ Aprobación de Meta para usar `wa.me/` links — son públicos siempre
- ❌ Aprobación para mostrar el número en la landing
- ❌ Pagar nada (la WA Business App es gratis; solo cobran a partir de WA Platform/API con volumen)

---

## Mensajes pre-llenados que el sitio dispara

Cada CTA del sitio abre WhatsApp con un mensaje distinto para que el cliente sepa de entrada qué quiere el usuario. Útil para etiquetar/clasificar en la app:

| Origen del click | Texto del mensaje |
|---|---|
| Hero "Consultar por WhatsApp" | `Hola Barretos, quiero más info` |
| Categoría · Botas | `Hola Barretos, quiero ver botas` |
| Categoría · Sombreros | `Hola Barretos, quiero ver sombreros` |
| Categoría · Camisas | `Hola Barretos, quiero ver camisas` |
| Categoría · Cinturones | `Hola Barretos, quiero ver cinturones` |
| Categoría · Accesorios | `Hola Barretos, quiero ver accesorios` |
| "Por qué Barretos" CTA | `Hola Barretos` |
| FAB flotante | `Hola Barretos` |
| Footer / Visítanos | (sin texto pre-llenado) |

Estos mensajes están hardcodeados en `index.html` como parámetros `?text=…` en los `href`. Si el cliente quiere afinarlos (ej. "Hola, vi su sitio web y…"), se editan ahí.

---

## Tracking en GA4

Cada click a WhatsApp dispara el evento `whatsapp_click` con dos parámetros:

- `link_text` — el texto visible del botón (ej. "Consultar por WhatsApp", "WhatsApp", "Hablemos por WhatsApp")
- `location` — la ruta de la página desde donde se clickeó (`/` o `/privacidad/`)

Esto permite ver en GA4 **qué CTA convierte mejor** y desde qué página vienen los leads de WhatsApp.

Cuando se acumulen ~30-50 clicks, ir a **GA4 → Admin → Eventos → Marcar como conversión** y elegir `whatsapp_click`. Eso desbloquea reportes de tasa de conversión por canal y atribución.
