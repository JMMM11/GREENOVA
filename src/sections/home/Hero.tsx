import { useEffect, useState } from "react";
import { Link } from "react-router";
import { m } from "motion/react";
import { useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

type Nav = Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };

/** Decide en el cliente si vale la pena cargar el video y qué versión. */
function useHeroVideo() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Nav).connection;
    const slow = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (reduce || slow) return;
    setSrc(matchMedia("(min-width: 768px)").matches ? "/video/hero-1600.mp4" : "/video/hero-540.mp4");
  }, []);
  return src;
}

export function Hero() {
  const { lang, d } = useI18n();
  const video = useHeroVideo();
  const [playing, setPlaying] = useState(false);

  return (
    <section className="on-dark relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-night text-ivory">
      <picture>
        <source media="(min-width: 768px)" srcSet="/video/hero-poster-1600.webp" width={1600} height={900} />
        <img
          src="/video/hero-poster-540.webp"
          width={540}
          height={960}
          alt={d.hero.posterAlt}
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
      </picture>
      {video && (
        <m.video
          key={video}
          src={video}
          poster={video.includes("540") ? "/video/hero-poster-540.webp" : "/video/hero-poster-1600.webp"}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
      )}
      {/* Capa de contraste: gradiente inferior y lateral, no un velo uniforme */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_17_11/0.88)_8%,rgb(15_17_11/0.35)_55%,rgb(15_17_11/0.25))] lg:bg-[linear-gradient(to_right,rgb(15_17_11/0.85),rgb(15_17_11/0.45)_50%,rgb(15_17_11/0.1)),linear-gradient(to_top,rgb(15_17_11/0.6),transparent_40%)]" />
      {/* Transición al fondo claro (sección 5): el borde inferior se disuelve en marfil */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-ivory))] lg:h-48" />

      <div className="container-page mt-auto pt-24 pb-44 lg:pb-56">
        <StaggeredFade as="h1" trigger="mount" text={d.hero.title} className="text-display max-w-[12ch] font-semibold text-ivory" />
        <p
          style={{ animationDelay: "0.55s" }}
          className="rise mt-6 max-w-[42ch] text-lg leading-relaxed text-ivory/90 lg:text-xl"
        >
          {d.hero.subtitle}
        </p>
        <div
          style={{ animationDelay: "0.8s" }}
          className="pop mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
        >
          <Link
            to={pathFor("shop", lang)}
            className="glass inline-flex min-h-12 items-center justify-center rounded-[var(--radius-ui)] px-7 text-base font-medium whitespace-nowrap text-ivory transition-[transform,box-shadow,background-color] duration-200 hover:bg-white/20 active:scale-[0.98] active:shadow-none"
          >
            {d.hero.cta}
          </Link>
          <Link
            to={pathFor("process", lang)}
            className="inline-flex min-h-12 items-center justify-center px-2 text-base font-medium text-ivory/90 underline decoration-ivory/40 underline-offset-[6px] transition-colors hover:text-ivory hover:decoration-ivory"
          >
            {d.hero.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
