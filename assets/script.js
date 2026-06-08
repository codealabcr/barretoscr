(() => {
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
    let last = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.style.boxShadow = y > 8 ? "0 1px 0 rgba(26,23,20,0.06), 0 8px 28px rgba(26,23,20,0.04)" : "";
      last = y;
    }, { passive: true });
  }
})();
