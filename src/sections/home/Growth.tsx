import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react/ssr";
import { useI18n } from "../../i18n/I18nProvider";
import { Img, type ImageName } from "../../components/ui/Img";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

const SeedlingCanvas = lazy(() => import("../../components/3d/SeedlingCanvas"));

/** Foto real por etapa: póster del 3D, fallback en móvil/gama baja y secuencia deslizable. */
const STAGE_IMG: ImageName[] = ["camara-bandejas", "brotes-celda-2", "plantones-camara", "aclimatacion-1", "led-maiz-3", "huerto-1"];

/** 3D solo en escritorio con puntero fino, WebGL y memoria suficiente; se monta al acercarse a la sección. */
function use3D(ref: React.RefObject<HTMLElement | null>) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const gl = !!document.createElement("canvas").getContext("webgl2");
    if (!gl || mem < 4 || !matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;
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
  const [active, setActive] = useState(last);
  const [auto, setAuto] = useState(true);
  const section = useRef<HTMLElement>(null);
  const show3D = use3D(section);
  const inView = useInView(section, { amount: 0.3 });

  // Crecimiento automático: arranca en la siembra y avanza solo; en la planta adulta espera y vuelve a empezar.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    else setActive(0);
  }, []);
  useEffect(() => {
    if (!auto || !inView) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % (last + 1)), active === last ? 6000 : 3500);
    return () => clearTimeout(id);
  }, [auto, inView, active, last]);
  const labelText = [d.species.maiz.name, "GREENOVA", `MZ · ${t.stages[4].time.replace(/^\D+/, "")}`];

  return (
    <section ref={section} className="section-y overflow-hidden bg-sand" aria-labelledby="growth-h">
      <div className="container-page lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Escritorio: titular y etapas a la izquierda; la escena a la derecha, fija mientras se recorren */}
        <div className="lg:col-span-5">
          <StaggeredFade id="growth-h" text={t.title} className="text-h2 max-w-[16ch]" />
          <RevealText className="mt-4 max-w-[46ch] text-lg leading-relaxed">{t.text}</RevealText>
          <ol className="mt-10 hidden flex-col gap-1 lg:flex">
            {t.stages.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => {
                    setActive(i);
                    setAuto(false);
                  }}
                  className={`w-full rounded-[var(--radius-ui)] px-5 py-4 text-left transition-[background-color,opacity] duration-300 ${
                    active === i ? "bg-ivory" : "hover:bg-ivory/50"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-[28px] leading-tight">{s.name}</span>
                    <span className="shrink-0 text-[15px] text-ink-soft">{s.time}</span>
                  </span>
                  {active === i && <span className="mt-2 block max-w-[48ch] text-base leading-relaxed text-ink">{s.text}</span>}
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setAuto((a) => !a)}
            className="mt-4 hidden min-h-11 items-center gap-2 rounded-[var(--radius-ui)] px-4 text-[15px] font-medium ring-1 ring-ink/20 ring-inset transition-colors hover:bg-ink/5 lg:inline-flex"
          >
            {auto ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            {auto ? t.pause : t.play}
          </button>
        </div>
        <div className="hidden lg:col-span-7 lg:block">
          <div className="relative sticky top-24 h-[min(84vh,820px)] w-full overflow-hidden rounded-[var(--radius-media)]">
            {show3D ? (
              <Suspense fallback={<StagePhoto i={active} />}>
                <SeedlingCanvas stage={active} label={t.canvasLabel} labelText={labelText} />
              </Suspense>
            ) : (
              <StagePhoto i={active} />
            )}
          </div>
        </div>
      </div>

      <div className="container-page">

        {/* Móvil y tablet: una foto real por etapa, se cambia deslizando */}
        <ol className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:hidden">
          {t.stages.map((s, i) => (
            <li key={s.name} className="w-[82%] shrink-0 snap-center sm:w-[46%]">
              <Img name={STAGE_IMG[i]} alt="" sizes="82vw" className="aspect-[4/5] w-full object-cover" />
              <p className="mt-4 flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl">{s.name}</span>
                <span className="text-[15px] text-ink-soft">{s.time}</span>
              </p>
              <p className="mt-2 text-base leading-relaxed">{s.text}</p>
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
