(() => {
  const mobileQuery = window.matchMedia("(max-width: 1000px)");

  const addStyles = () => {
    if (document.getElementById("subpageMobileNavigationStyles")) return;

    const style = document.createElement("style");
    style.id = "subpageMobileNavigationStyles";
    style.textContent = `
      .subpage-mobile-nav-toggle,
      .subpage-mobile-nav { display: none; }

      .subpage-mobile-nav__label {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      @media (max-width: 1000px) {
        .site-header .header-inner > .nav { display: none !important; }

        .subpage-mobile-nav-toggle {
          display: inline-grid;
          place-items: center;
          flex: 0 0 auto;
          width: 2.65rem;
          min-width: 2.65rem;
          height: 2.65rem;
          padding: 0;
          border: 1px solid rgba(244, 240, 232, .38);
          border-radius: 3px;
          color: var(--porcelain, #f4f0e8);
          background: transparent;
          cursor: pointer;
        }

        .subpage-mobile-nav-toggle:hover,
        .subpage-mobile-nav-toggle:focus-visible {
          border-color: var(--copper, #b28a5a);
        }

        .subpage-mobile-nav-toggle:focus-visible,
        .subpage-mobile-nav a:focus-visible {
          outline: 2px solid var(--copper-light, #d3b07b);
          outline-offset: 3px;
        }

        .subpage-mobile-nav-toggle__lines,
        .subpage-mobile-nav-toggle__lines::before,
        .subpage-mobile-nav-toggle__lines::after {
          display: block;
          width: 1.08rem;
          height: 1px;
          border-radius: 999px;
          background: currentColor;
          content: "";
          transition: transform 180ms ease, opacity 180ms ease;
        }

        .subpage-mobile-nav-toggle__lines { position: relative; }
        .subpage-mobile-nav-toggle__lines::before { position: absolute; top: -.35rem; left: 0; }
        .subpage-mobile-nav-toggle__lines::after { position: absolute; top: .35rem; left: 0; }
        .subpage-mobile-nav-toggle[aria-expanded="true"] .subpage-mobile-nav-toggle__lines { background: transparent; }
        .subpage-mobile-nav-toggle[aria-expanded="true"] .subpage-mobile-nav-toggle__lines::before { transform: translateY(.35rem) rotate(45deg); }
        .subpage-mobile-nav-toggle[aria-expanded="true"] .subpage-mobile-nav-toggle__lines::after { transform: translateY(-.35rem) rotate(-45deg); }

        .subpage-mobile-nav {
          position: absolute;
          z-index: 80;
          top: calc(100% + .45rem);
          right: 1rem;
          left: 1rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: .55rem;
          padding: .75rem;
          border: 1px solid rgba(244, 240, 232, .2);
          border-radius: 6px;
          background: rgba(24, 21, 18, .97);
          box-shadow: 0 18px 48px rgba(0, 0, 0, .35);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
        }

        .subpage-mobile-nav.is-open { display: grid; }

        .subpage-mobile-nav a {
          display: flex;
          align-items: center;
          min-height: 2.8rem;
          padding: .55rem .7rem;
          border: 1px solid rgba(244, 240, 232, .15);
          border-radius: 3px;
          color: rgba(244, 240, 232, .88);
          font-size: .7rem;
          font-weight: 750;
          letter-spacing: .055em;
          line-height: 1.3;
          text-transform: uppercase;
        }

        .subpage-mobile-nav a:hover,
        .subpage-mobile-nav a[aria-current="page"] {
          border-color: var(--copper, #b28a5a);
          color: var(--porcelain, #f4f0e8);
        }
      }

      @media (max-width: 520px) {
        .subpage-mobile-nav { grid-template-columns: 1fr; }
      }

      @media (prefers-reduced-motion: reduce) {
        .subpage-mobile-nav-toggle__lines,
        .subpage-mobile-nav-toggle__lines::before,
        .subpage-mobile-nav-toggle__lines::after { transition: none; }
      }
    `;
    document.head.append(style);
  };

  const mountSubpageMobileNavigation = () => {
    if (document.getElementById("mobileNavToggle") || document.getElementById("subpageMobileNav")) return;

    const header = document.querySelector(".site-header");
    const headerInner = header?.querySelector(".header-inner");
    const desktopNav = headerInner?.querySelector(":scope > .nav");
    if (!header || !headerInner || !desktopNav) return;

    const sourceLinks = [...desktopNav.querySelectorAll("a[href]")];
    if (!sourceLinks.length) return;

    addStyles();

    const menu = document.createElement("nav");
    menu.id = "subpageMobileNav";
    menu.className = "subpage-mobile-nav";
    menu.hidden = true;
    menu.setAttribute("aria-label", desktopNav.getAttribute("aria-label") || "Hauptnavigation");

    sourceLinks.forEach((source) => {
      const link = document.createElement("a");
      link.href = source.getAttribute("href");
      link.textContent = source.textContent.trim();
      if (source.getAttribute("aria-current")) link.setAttribute("aria-current", source.getAttribute("aria-current"));
      menu.append(link);
    });

    const contact = headerInner.querySelector(".header-contact[href]");
    if (contact) {
      const contactLink = document.createElement("a");
      contactLink.href = contact.getAttribute("href");
      contactLink.textContent = contact.textContent.trim();
      menu.append(contactLink);
    }

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "subpage-mobile-nav-toggle";
    toggle.setAttribute("aria-controls", menu.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
    const lines = document.createElement("span");
    lines.className = "subpage-mobile-nav-toggle__lines";
    lines.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "subpage-mobile-nav__label";
    label.textContent = "Menü öffnen";
    toggle.append(lines, label);

    const setOpen = (open, restoreFocus = false) => {
      menu.hidden = !open;
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      const nextLabel = open ? "Menü schließen" : "Menü öffnen";
      toggle.setAttribute("aria-label", nextLabel);
      label.textContent = nextLabel;
      if (!open && restoreFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => setOpen(menu.hidden));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !menu.hidden) setOpen(false, true);
    });
    document.addEventListener("pointerdown", (event) => {
      if (!menu.hidden && !header.contains(event.target) && !menu.contains(event.target)) setOpen(false);
    });
    mobileQuery.addEventListener("change", (event) => {
      if (!event.matches) setOpen(false);
    });

    headerInner.append(toggle);
    header.append(menu);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountSubpageMobileNavigation, { once: true });
  } else {
    mountSubpageMobileNavigation();
  }
})();
