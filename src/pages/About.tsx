import { useI18n } from "../i18n/I18nProvider";
import { PageIntro } from "../sections/shared/PageIntro";
import { Wide } from "../sections/shared/Wide";
import { Team } from "../sections/about/Team";
import { PhotoStrip } from "../sections/shared/PhotoStrip";
import { RevealList } from "../components/motion/RevealList";
import { RevealText } from "../components/motion/RevealText";
import { StaggeredFade } from "../components/motion/StaggeredFade";

export default function About() {
  const { d } = useI18n();
  const a = d.about;
  return (
    <>
      <PageIntro title={a.title} intro={a.intro} />
      <Wide img="equipo-siembra" alt={a.heroAlt} />

      <section className="section-y bg-ivory">
        <div className="container-page grid gap-8 lg:grid-cols-12">
          <StaggeredFade text={a.story.title} className="text-h2 lg:col-span-5" />
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            {a.story.text.map((p, i) => (
              <RevealText key={i} delay={i * 0.08} className="max-w-[60ch] text-lg leading-relaxed">{p}</RevealText>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y on-dark bg-olive-deep text-ivory">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-20">
          {[a.mission, a.vision].map((b) => (
            <div key={b.title}>
              <StaggeredFade text={b.title} className="text-h2" />
              <RevealText className="mt-6 max-w-[52ch] text-xl leading-relaxed text-ivory/95">{b.text}</RevealText>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-sand">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <StaggeredFade text={a.values.title} className="text-h2 lg:col-span-4" />
          <RevealList
            className="flex flex-col gap-5 lg:col-span-8"
            items={a.values.items.map((v) => (
              <p className="text-[clamp(1.5rem,1.2rem+1.2vw,2.4rem)] leading-tight font-display">
                {v.name} <span className="text-ink-soft">{v.text}</span>
              </p>
            ))}
          />
        </div>
      </section>

      <section className="section-y bg-ivory" aria-labelledby="philo-h">
        <div className="container-page text-center">
          <StaggeredFade id="philo-h" text={a.philosophy.title} className="text-h3" />
          <RevealText as="blockquote" className="mx-auto mt-8 max-w-[40ch] font-display text-statement">
            {a.philosophy.quote}
          </RevealText>
        </div>
      </section>

      <PhotoStrip imgs={["construccion-4", "equipo-huerto", "huerto-1"]} alts={[d.projects.items[0].name, a.heroAlt, d.projects.items[2].name]} />

      <section className="section-y bg-sand">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <StaggeredFade text={a.goals.title} className="text-h2 lg:col-span-4" />
          <RevealList
            as="ol"
            className="grid list-inside list-decimal gap-x-10 gap-y-6 marker:font-display marker:text-olive sm:grid-cols-2 lg:col-span-8"
            itemClassName="text-lg leading-relaxed"
            items={a.goals.items}
          />
        </div>
      </section>

      <Team />
    </>
  );
}
