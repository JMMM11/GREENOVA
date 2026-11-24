import { useI18n } from "../i18n/I18nProvider";
import { pathFor } from "../i18n/routes";
import { PageIntro } from "../sections/shared/PageIntro";
import { Wide } from "../sections/shared/Wide";
import { ChamberDiagram } from "../sections/innovation/ChamberDiagram";
import { ActionLink } from "../components/ui/Action";
import { PhotoStrip } from "../sections/shared/PhotoStrip";
import { RevealList } from "../components/motion/RevealList";
import { RevealText } from "../components/motion/RevealText";
import { StaggeredFade } from "../components/motion/StaggeredFade";

export default function Innovation() {
  const { lang, d } = useI18n();
  const t = d.innovation;
  return (
    <>
      <PageIntro title={t.title} intro={t.intro} />
      <Wide img="led-maiz-2" alt={t.photoAlt} />

      <section className="section-y bg-ivory" aria-labelledby="diagram-h">
        <div className="container-page">
          <StaggeredFade id="diagram-h" text={t.diagram.title} className="text-h2 mb-12" />
          <ChamberDiagram />
        </div>
      </section>

      <section className="section-y on-dark bg-olive-deep text-ivory" aria-labelledby="results-h">
        <div className="container-page">
          <StaggeredFade id="results-h" text={t.results.title} className="text-h2" />
          <RevealList
            className="mt-14 grid gap-20 md:grid-cols-3 md:gap-12"
            items={t.results.items.map((r) => (
              <>
                <p className="font-display text-[clamp(4rem,3rem+4vw,7rem)] leading-none text-sprout tabular-nums">{r.value}</p>
                <p className="mt-4 text-xl font-medium">{r.name}</p>
                <p className="mt-1 max-w-[30ch] text-base leading-relaxed text-ivory/80">{r.text}</p>
              </>
            ))}
          />
        </div>
      </section>

      <section className="section-y bg-sand" aria-labelledby="capacity-h">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <StaggeredFade id="capacity-h" text={t.capacity.title} className="text-h2" />
            <RevealText className="mt-6 max-w-[36ch] text-lg leading-relaxed">{t.capacity.note}</RevealText>
          </div>
          <RevealList
            as="dl"
            className="flex flex-col gap-3 lg:col-span-8"
            itemClassName="grid items-baseline gap-2 bg-ivory px-6 py-6 sm:grid-cols-12"
            items={t.capacity.items.map((c) => (
              <>
                <dt className="font-display text-[clamp(2.4rem,2rem+2vw,3.6rem)] leading-none tabular-nums sm:col-span-5">{c.value}</dt>
                <dd className="text-lg leading-relaxed sm:col-span-7">{c.text}</dd>
              </>
            ))}
          />
        </div>
      </section>

      <PhotoStrip imgs={["construccion-3", "plantones-camara", "camara-v2"]} alts={[t.diagram.brain, t.photoAlt, d.projects.items[3].name]} />

      <section className="section-y bg-ivory">
        <div className="container-page grid gap-20 lg:grid-cols-2">
          <div>
            <StaggeredFade text={t.protocol.title} className="text-h2" />
            <RevealText className="mt-6 max-w-[48ch] text-lg leading-relaxed">{t.protocol.text}</RevealText>
            <ActionLink to={pathFor("process", lang)} variant="outline" arrow className="mt-8">{t.protocol.link}</ActionLink>
          </div>
          <div>
            <StaggeredFade text={t.background.title} className="text-h2" />
            <RevealText className="mt-6 max-w-[48ch] text-lg leading-relaxed">{t.background.text}</RevealText>
            <RevealList className="mt-6 flex flex-col gap-3 text-[15px] leading-relaxed text-ink-soft" items={t.background.refs} />
          </div>
        </div>
      </section>
    </>
  );
}
