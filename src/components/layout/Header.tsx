import { useState } from "react";
import { Link, NavLink } from "react-router";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { Logo } from "../ui/Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import { CartButton } from "../cart/CartButton";
import { NAV_ITEMS } from "./navItems";
import { EASE_EXPO } from "../motion/tokens";

/** Barra superior de una línea (72 px). Transparente sobre el Hero oscuro; translúcida con blur al hacer scroll. */
export function Header({ overHero }: { overHero: boolean }) {
  const { lang, d } = useI18n();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  const dark = overHero && !scrolled;

  return (
    <m.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_EXPO }}
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${
        dark
          ? "on-dark border-b border-transparent bg-transparent"
          : "border-b border-line bg-ivory/85 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-ivory"
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link to={pathFor("home", lang)} aria-label={d.nav.homeLink} className="shrink-0">
          <Logo dark={dark} />
        </Link>
        <nav aria-label={d.nav.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {NAV_ITEMS.map((key) => (
              <li key={key}>
                <NavLink
                  to={pathFor(key, lang)}
                  end
                  className={`group relative py-2 text-[15px] font-medium transition-colors duration-200 ${
                    dark ? "text-ivory/80 hover:text-ivory aria-[current=page]:text-ivory" : "text-ink-soft hover:text-ink aria-[current=page]:text-ink"
                  }`}
                >
                  {d.nav[key]}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:scale-x-100 group-aria-[current=page]:scale-x-100 ${dark ? "bg-ivory" : "bg-earth"}`}
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch dark={dark} />
          <CartButton dark={dark} />
          <MobileMenu dark={dark} />
        </div>
      </div>
    </m.header>
  );
}
