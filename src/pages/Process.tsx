import { useI18n } from "../i18n/I18nProvider";
import { pathFor } from "../i18n/routes";
import { PageIntro } from "../sections/shared/PageIntro";
import { Img, type ImageName } from "../components/ui/Img";
import { ActionLink } from "../components/ui/Action";
import { RevealImage } from "../components/motion/RevealImage";
import { RevealText } from "../components/motion/RevealText";
import { StaggeredFade } from "../components/motion/StaggeredFade";

/** El orden se lee por tamaño: cada etapa es más alta que la anterior. */
const SPANS = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];
const HEIGHTS = [
  "h-[38vw] lg:h-[24vh]",
  "h-[44vw] lg:h-[31vh]",
  "h-[50vw] lg:h-[38vh]",
  "h-[56vw] lg:h-[46vh]",
  "h-[62vw] lg:h-[54vh]",
];
const FIELDS = ["bg-sand", "bg-sprout", "bg-clay", "bg-sand", "bg-sprout"];

export default function Process() {
  const { lang, d } = useI18n();
  const p = d.process;
  return (
    <>
      <PageIntro title={p.title} intro={p.intro} />

      <section className="bg-ivory pb-24 lg:pb-32" aria-label={p.title}>
        <ol className="container-page grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-2.5">
          {p.stages.map((s, i) => (
            <li key={s.name} className={SPANS[i]}>
              <RevealImage variant="wipe" delay={i * 0.08} className={`${FIELDS[i]} ${HEIGHTS[i]} p-2`}>
                <Img name={s.img as ImageName} alt={s.alt} sizes="(min-width: 1024px) 25vw, 100vw" radius="sm" className="h-full w-full object-cover" />
              </RevealImage>
              <h2 className="mt-4 font-display text-[26px] leading-tight lg:min-h-[2.3em] xl:min-h-0">{s.name}</h2>
              <p className="mt-1 text-[15px] font-medium text-olive-deep">{s.time}</p>
              <RevealText className="mt-2 text-base leading-relaxed">{s.text}</RevealText>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-y bg-sand">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <StaggeredFade text={d.innovation.protocol.title} className="text-h2 lg:col-span-5" />
          <div className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
            <RevealText className="text-lg leading-relaxed">{p.loss}</RevealText>
            <RevealText delay={0.08} className="text-lg leading-relaxed">{p.waste}</RevealText>
            <ActionLink to={pathFor("products", lang)} arrow className="mt-3 self-start">{d.nav.products}</ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
