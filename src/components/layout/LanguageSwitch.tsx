import { Link, useLocation } from "react-router";
import { useI18n } from "../../i18n/I18nProvider";
import { LANGS, matchPath, pathFor } from "../../i18n/routes";

/** ES / EN. Mantiene la página (y el ancla) actual al cambiar de idioma. */
export function LanguageSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, d } = useI18n();
  const { pathname, hash } = useLocation();
  const page = matchPath(pathname)?.page ?? "home";
  return (
    <nav aria-label={d.nav.langLabel} className="flex items-center gap-1 text-sm font-medium">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className={dark ? "text-ivory/40" : "text-ink/30"}>/</span>}
          {l === lang ? (
            <span aria-current="true" className={`px-1.5 py-2 ${dark ? "text-ivory" : "text-ink"}`}>
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              to={pathFor(page, l) + hash}
              hrefLang={l}
              lang={l}
              className={`px-1.5 py-2 transition-colors duration-200 ${dark ? "text-ivory/60 hover:text-ivory" : "text-ink-soft hover:text-ink"}`}
            >
              {l.toUpperCase()}
              <span className="sr-only">, {d.nav.langSwitch}</span>
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
