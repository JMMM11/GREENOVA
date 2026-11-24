import { useI18n } from "../../i18n/I18nProvider";
import { RevealList } from "../../components/motion/RevealList";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

/** Diferenciadores en columnas, sin tarjetas: una marca sólida corta encima de cada una. */
export function Differentiators() {
  const { d } = useI18n();
  const t = d.home.diff;
  return (
    <section className="section-y bg-ivory">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <StaggeredFade text={t.title} className="text-h2 lg:col-span-5" />
          <RevealText className="max-w-[52ch] text-lg leading-relaxed lg:col-span-6 lg:col-start-7 lg:pt-3">{t.text}</RevealText>
        </div>
        <RevealList
          className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
          items={t.items.map((it) => (
            <>
              <span aria-hidden className="block h-[3px] w-10 bg-olive" />
              <h3 className="mt-5 font-display text-[26px] leading-tight">{it.name}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink">{it.text}</p>
            </>
          ))}
        />
      </div>
    </section>
  );
}
