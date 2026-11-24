import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/layout/Layout";
import { CartProvider } from "./lib/cart";
import { LANGS, PAGES, slugFor, type PageKey } from "./i18n/routes";

// Code splitting por ruta.
export const PAGE_LOADERS: Record<PageKey | "notFound", () => Promise<{ default: React.ComponentType }>> = {
  home: () => import("./pages/Home"),
  about: () => import("./pages/About"),
  products: () => import("./pages/Products"),
  shop: () => import("./pages/Shop"),
  solutions: () => import("./pages/Solutions"),
  innovation: () => import("./pages/Innovation"),
  process: () => import("./pages/Process"),
  projects: () => import("./pages/Projects"),
  contact: () => import("./pages/Contact"),
  privacy: () => import("./pages/Legal").then((m) => ({ default: m.Privacy })),
  terms: () => import("./pages/Legal").then((m) => ({ default: m.Terms })),
  cookies: () => import("./pages/Legal").then((m) => ({ default: m.Cookies })),
  notFound: () => import("./pages/NotFound"),
};

const PAGES_LAZY = Object.fromEntries(
  Object.entries(PAGE_LOADERS).map(([k, load]) => [k, lazy(load)]),
) as Record<PageKey | "notFound", React.LazyExoticComponent<React.ComponentType>>;

export function App() {
  return (
    <CartProvider>
      <Routes>
      {LANGS.map((lang) => (
        <Route key={lang} path={`/${lang}`} element={<Layout lang={lang} />}>
          {PAGES.map((page) => {
            const Page = PAGES_LAZY[page];
            const slug = slugFor(page, lang);
            return slug ? <Route key={page} path={slug} element={<Page />} /> : <Route key={page} index element={<Page />} />;
          })}
          <Route path="*" element={<PAGES_LAZY.notFound />} />
        </Route>
      ))}
      <Route path="/" element={<Navigate to="/es" replace />} />
      <Route path="*" element={<Layout lang="es" />}>
        <Route path="*" element={<PAGES_LAZY.notFound />} />
      </Route>
      </Routes>
    </CartProvider>
  );
}
