import { useI18n } from "../i18n/I18nProvider";
import { pathFor } from "../i18n/routes";
import { PageIntro } from "../sections/shared/PageIntro";
import { AudienceIndex } from "../sections/shared/AudienceIndex";
import { Img } from "../components/ui/Img";
import { ActionLink } from "../components/ui/Action";
import { RevealImage } from "../components/motion/RevealImage";
import { RevealList } from "../components/motion/RevealList";
import { RevealText } from "../components/motion/RevealText";
import { StaggeredFade } from "../components/motion/StaggeredFade";

export default function Solutions() {
  const { lang, d } = useI18n();
  const s = d.solutions;
  return (
    <>
      <PageIntro title={s.title} intro={s.intro} />

      <section className="bg-ivory pb-24 lg:pb-32" aria-labelledby="index-h">
        <div className="container-page">
          <h2 id="index-h" className="sr-only">{s.indexTitle}</h2>
          <AudienceIndex detailed />
        </div>
      </section>

      {/* Detalle por audiencia: misma estructura de contenido, filas con ancla */}
      <section className="bg-sand py-8 lg:py-12">
        <div className="container-page flex flex-col">
          {s.audiences.map((a) => (
            <article key={a.id} id={a.id} className="grid scroll-mt-24 gap-6 py-12 sm:grid-cols-12 lg:py-16">
              <div className="sm:col-span-12 lg:col-span-4">
                <StaggeredFade as="h3" text={a.name} className="text-h3 lg:text-[2.4rem]" />
              </div>
              <div className="flex flex-col gap-4 sm:col-span-7 lg:col-span-5">
                <RevealText className="text-lg leading-relaxed text-ink-soft">{a.need}</RevealText>
                <RevealText delay={0.08} className="text-lg leading-relaxed">{a.offer}</RevealText>
                <ActionLink to={`${pathFor("contact", lang)}?tipo=${a.id === "huertos-escolares" ? "encargo" : "pedido"}`} variant="outline" arrow label={`${d.common.learnMore}: ${a.name}`} className="mt-2 self-start">
                  {d.common.learnMore}
                </ActionLink>
              </div>
              <RevealImage className="sm:col-span-5 lg:col-span-3">
                <Img name={a.img} alt={a.name} sizes="(min-width: 1024px) 25vw, 40vw" className="aspect-[4/3] w-full object-cover" />
              </RevealImage>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y on-dark bg-olive-deep text-ivory" aria-labelledby="services-h">
        <div className="container-page">
          <StaggeredFade id="services-h" text={s.services.title} className="text-h2" />
          <RevealList
            className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2"
            items={s.services.items.map((it) => (
              <div id={it.id} className="scroll-mt-28">
                <h3 className="font-display text-[clamp(1.7rem,1.4rem+1vw,2.4rem)] leading-tight">{it.name}</h3>
                <p className="mt-3 max-w-[50ch] text-lg leading-relaxed text-ivory/90">{it.text}</p>
              </div>
            ))}
          />
        </div>
      </section>

      <section className="section-y bg-ivory" aria-labelledby="channels-h">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <StaggeredFade id="channels-h" text={s.channels.title} className="text-h2" />
            <ActionLink to={pathFor("contact", lang)} arrow className="mt-8">{d.nav.contact}</ActionLink>
          </div>
          <RevealList
            className="grid gap-10 sm:grid-cols-3 lg:col-span-8"
            items={s.channels.items.map((c) => (
              <>
                <span aria-hidden className="block h-[3px] w-10 bg-olive" />
                <h3 className="mt-5 font-display text-[26px] leading-tight">{c.name}</h3>
                <p className="mt-3 text-base leading-relaxed">{c.text}</p>
              </>
            ))}
          />
        </div>
      </section>
    </>
  );
}
