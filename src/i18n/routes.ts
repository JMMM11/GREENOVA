export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const PAGES = [
  "home",
  "about",
  "products",
  "shop",
  "solutions",
  "innovation",
  "process",
  "projects",
  "contact",
  "privacy",
  "terms",
  "cookies",
] as const;
export type PageKey = (typeof PAGES)[number];

const SLUGS: Record<PageKey, Record<Lang, string>> = {
  home: { es: "", en: "" },
  about: { es: "nosotros", en: "about" },
  products: { es: "productos", en: "products" },
  shop: { es: "tienda", en: "shop" },
  solutions: { es: "soluciones", en: "solutions" },
  innovation: { es: "innovacion", en: "innovation" },
  process: { es: "proceso", en: "process" },
  projects: { es: "proyectos", en: "projects" },
  contact: { es: "contacto", en: "contact" },
  privacy: { es: "aviso-de-privacidad", en: "privacy-notice" },
  terms: { es: "terminos", en: "terms" },
  cookies: { es: "cookies", en: "cookies" },
};

/** Ruta absoluta de una página en un idioma, con ancla opcional. */
export function pathFor(page: PageKey, lang: Lang, hash?: string) {
  const slug = SLUGS[page][lang];
  return `/${lang}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Página y idioma a partir de una ruta; null si no existe. */
export function matchPath(pathname: string): { page: PageKey; lang: Lang } | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const lang of LANGS) {
    for (const page of PAGES) {
      if (pathFor(page, lang) === clean) return { page, lang };
    }
  }
  return null;
}

export function slugFor(page: PageKey, lang: Lang) {
  return SLUGS[page][lang];
}
