import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "motion/react";
import { useI18n } from "../../i18n/I18nProvider";
import { Img, type ImageName } from "../../components/ui/Img";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

const SeedlingCanvas = lazy(() => import("../../components/3d/SeedlingCanvas"));

/** Foto real por etapa: fallback en gama baja. */
const STAGE_IMG: ImageName[] = ["camara-bandejas", "brotes-celda-2", "plantones-camara", "aclimatacion-1", "led-maiz-3", "huerto-1"];

/** 3D en todos los tamaños si WebGL y memoria suficiente; se monta al acercarse a la sección. */
function use3D(ref: React.RefObject<HTMLElement | null>) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const gl = !!document.createElement("canvas").getContext("webgl2");
    if (!gl || mem < 4) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOk(true), io.disconnect()), { rootMargin: "400px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [ref]);
  return ok;
}

export function Growth() {
  const { d } = useI18n();
  const t = d.home.growth;
  const last = t.stages.length - 1;
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const show3D = use3D(section);
  const inView = useInView(section, { amount: 0.3 });

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % (last + 1)), active === last ? 4500 : 2500);
    return () => clearTimeout(id);
  }, [inView, active, last]);
  const labelText = [d.species.maiz.name, "GREENOVA", `MZ · ${t.stages[4].time.replace(/^\D+/, "")}`];

  return (
    <section ref={section} className="section-y overflow-hidden bg-sand" aria-labelledby="growth-h">
      <div className="container-page">
        <StaggeredFade id="growth-h" text={t.title} className="text-h2 max-w-[16ch]" />
        <RevealText className="mt-4 max-w-[46ch] text-lg leading-relaxed">{t.text}</RevealText>

        {/* 3D en todos los tamaños */}
        <div className="relative mt-10 h-[min(84vh,820px)] w-full overflow-hidden rounded-[var(--radius-media)] lg:sticky lg:top-24">
          {show3D ? (
            <Suspense fallback={<StagePhoto i={active} />}>
              <SeedlingCanvas stage={active} label={t.canvasLabel} labelText={labelText} />
            </Suspense>
          ) : (
            <StagePhoto i={active} />
          )}
        </div>

        {/* Etapas: solo lectura, sin interacción */}
        <ol className="mt-10 flex flex-col gap-1">
          {t.stages.map((s, i) => (
            <li key={s.name}>
              <div
                className={`w-full rounded-[var(--radius-ui)] px-5 py-4 text-left transition-[background-color] duration-300 ${
                  active === i ? "bg-ivory" : "bg-sand"
                }`}
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[28px] leading-tight">{s.name}</span>
                  <span className="shrink-0 text-[15px] text-ink-soft">{s.time}</span>
                </span>
                {active === i && <span className="mt-2 block max-w-[48ch] text-base leading-relaxed text-ink">{s.text}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StagePhoto({ i }: { i: number }) {
  const { d } = useI18n();
  return (
    <AnimatePresence initial={false}>
      <m.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
        <Img name={STAGE_IMG[i]} alt={d.home.growth.stages[i].name} sizes="55vw" className="h-full w-full object-cover" />
      </m.div>
    </AnimatePresence>
  );
}
