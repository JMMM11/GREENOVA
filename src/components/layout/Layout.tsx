import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { I18nProvider, DICTS } from "../../i18n/I18nProvider";
import { matchPath, type Lang } from "../../i18n/routes";
import { usePageHead } from "../../lib/usePageHead";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";

export function Layout({ lang }: { lang: Lang }) {
  const { pathname, hash } = useLocation();
  const page = matchPath(pathname)?.page ?? "notFound";
  usePageHead(lang, page);

  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <I18nProvider lang={lang}>
      <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="fixed top-2 left-2 z-50 -translate-y-20 rounded-[var(--radius-ui)] bg-ink px-4 py-3 text-ivory focus:translate-y-0"
        >
          {DICTS[lang].nav.skip}
        </a>
        <Header overHero={page === "home"} />
        <main id="main" tabIndex={-1} className="outline-none">
          <Suspense fallback={<div className="min-h-[100dvh]" />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <CartDrawer />
      </MotionConfig>
      </LazyMotion>
    </I18nProvider>
  );
}
