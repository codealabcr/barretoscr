(() => {
  const track = (event, params) => {
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  };

  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const text = (a.textContent || "").trim().slice(0, 60) || "CTA";

    if (href.includes("wa.me/")) {
      a.addEventListener("click", () => {
        track("whatsapp_click", {
          link_text: text,
          location: window.location.pathname,
        });
      });
    } else if (href.includes("instagram.com")) {
      a.addEventListener("click", () => track("social_click", { network: "instagram" }));
    } else if (href.includes("tiktok.com")) {
      a.addEventListener("click", () => track("social_click", { network: "tiktok" }));
    } else if (href.includes("facebook.com")) {
      a.addEventListener("click", () => track("social_click", { network: "facebook" }));
    } else if (href.includes("waze.com")) {
      a.addEventListener("click", () => track("outbound_click", { destination: "waze" }));
    } else if (href.includes("google.com/maps") || href.includes("maps.google")) {
      a.addEventListener("click", () => track("outbound_click", { destination: "google_maps" }));
    } else if (href.startsWith("mailto:")) {
      a.addEventListener("click", () => track("email_click", { destination: href.slice(7) }));
    } else if (href.startsWith("tel:")) {
      a.addEventListener("click", () => track("phone_click", { destination: href.slice(4) }));
    }
  });

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
      toggle.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
        mobileNav.hidden = true;
      })
    );
  }

  const rail = document.querySelector("[data-rail]");
  const prev = document.querySelector("[data-rail-prev]");
  const next = document.querySelector("[data-rail-next]");
  if (rail && prev && next) {
    const step = () => Math.round(rail.clientWidth * 0.6);
    prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));
  }

  const header = document.querySelector("[data-header]");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 8 ? "0 1px 0 rgba(26,23,20,0.06), 0 8px 28px rgba(26,23,20,0.04)" : "";
    }, { passive: true });
  }
})();
