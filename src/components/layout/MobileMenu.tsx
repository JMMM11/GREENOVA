import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router";
import { AnimatePresence, m } from "motion/react";
import { Menu, X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { NAV_ITEMS } from "./navItems";
import { EASE_EXPO } from "../motion/tokens";

/** Menú móvil (< lg) con panel de cristal translúcido. Cierra con un enlace, Escape o tocando fuera. */
export function MobileMenu({ dark }: { dark: boolean }) {
  const { lang, d } = useI18n();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // El foco queda entre el botón y los enlaces del panel mientras está abierto.
      const links = [...(panel.current?.querySelectorAll<HTMLElement>("a") ?? [])];
      const items = [button.current!, ...links];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      e.preventDefault();
      items[next].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const Icon = open ? X : Menu;
  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? d.nav.closeMenu : d.nav.openMenu}
        onClick={() => setOpen((v) => !v)}
        className={`-mr-2 grid size-11 place-items-center rounded-[var(--radius-ui)] transition-colors duration-200 ${
          dark ? "text-ivory hover:bg-ivory/10" : "text-ink hover:bg-ink/5"
        }`}
      >
        <Icon size={24} strokeWidth={1.75} aria-hidden />
      </button>
      {typeof document !== "undefined" &&
        createPortal(
      <AnimatePresence>
        {open && (
          <>
            <m.div
              key="scrim"
              className="fixed inset-x-0 top-[72px] bottom-0 z-30 bg-night/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <m.div
              key="panel"
              id="mobile-menu"
              ref={panel}
              className="glass on-dark fixed inset-x-3 top-[80px] z-40 rounded-[var(--radius-ui)] p-3"
              style={{ background: "rgb(15 17 11 / 0.88)" }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
            >
              <nav aria-label={d.nav.mainNav}>
                <m.ul initial="hidden" animate="show" transition={{ staggerChildren: 0.04, delayChildren: 0.05 }}>
                  {NAV_ITEMS.map((key) => (
                    <m.li
                      key={key}
                      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_EXPO } } }}
                    >
                      <NavLink
                        to={pathFor(key, lang)}
                        end
                        onClick={() => setOpen(false)}
                        className="flex min-h-12 items-center rounded-[var(--radius-ui)] px-3 font-display text-[28px] text-ivory/85 transition-colors hover:bg-ivory/10 hover:text-ivory aria-[current=page]:text-ivory aria-[current=page]:underline aria-[current=page]:decoration-olive aria-[current=page]:underline-offset-8"
                      >
                        {d.nav[key]}
                      </NavLink>
                    </m.li>
                  ))}
                </m.ul>
              </nav>
            </m.div>
          </>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
