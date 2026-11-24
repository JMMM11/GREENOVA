import { useI18n } from "../i18n/I18nProvider";
import { SPECIES } from "../data/species";
import { PageIntro } from "../sections/shared/PageIntro";
import { SpeciesSheet } from "../sections/products/SpeciesSheet";
import { LotPlanner } from "../sections/shared/LotPlanner";
import { Img, type ImageName } from "../components/ui/Img";
import { RevealImage } from "../components/motion/RevealImage";
import { RevealList } from "../components/motion/RevealList";
import { RevealText } from "../components/motion/RevealText";
import { StaggeredFade } from "../components/motion/StaggeredFade";

/** Tamaños distintos en la galería: la primera y la cuarta ocupan dos columnas. */
const SPANS = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2", "", ""];

export default function Products() {
  const { d } = useI18n();
  const p = d.products;
  return (
    <>
      <PageIntro
        title={p.title}
        intro={p.intro}
        aside={
          <div className="rounded-[var(--radius-media)] bg-sprout p-[6%]">
            <Img name="plantones-led" alt={p.gallery.items[2].name} sizes="(min-width: 1024px) 40vw, 100vw" priority radius="sm" className="aspect-[4/3] w-full object-cover" />
          </div>
        }
      />

      <section className="bg-ivory pb-24 lg:pb-32">
        <div className="container-page flex flex-col gap-20 lg:gap-28">
          {SPECIES.map((k, i) => (
            <SpeciesSheet key={k} k={k} index={i} />
          ))}
        </div>
      </section>

      <section className="section-y bg-sprout">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <StaggeredFade text={p.tomatoNote.title} className="text-h2" />
            <RevealText className="mt-6 max-w-[48ch] text-lg leading-relaxed">{p.tomatoNote.text}</RevealText>
          </div>
          <RevealList
            as="ol"
            className="flex list-inside list-decimal flex-col gap-5 marker:font-display marker:text-olive-deep lg:col-span-6 lg:col-start-7"
            itemClassName="bg-ivory/70 p-5 text-lg leading-relaxed"
            items={p.tomatoNote.items}
          />
        </div>
      </section>

      <section className="section-y bg-ivory" aria-labelledby="formats-h">
        <div className="container-page">
          <StaggeredFade id="formats-h" text={p.formats.title} className="text-h2" />
          <RevealText className="mt-4 max-w-[52ch] text-lg leading-relaxed">{p.formats.text}</RevealText>
          <RevealList
            as="dl"
            className="mt-12 grid gap-y-2"
            itemClassName="grid gap-2 bg-sand/60 px-5 py-6 sm:grid-cols-12 sm:items-baseline sm:px-8"
            items={p.formats.items.map((f) => (
              <>
                <dt className="font-display text-[clamp(1.6rem,1.3rem+1vw,2.3rem)] leading-tight sm:col-span-5">{f.name}</dt>
                <dd className="text-lg leading-relaxed sm:col-span-7">{f.text}</dd>
              </>
            ))}
          />
        </div>
      </section>

      <LotPlanner />

      <section className="section-y bg-ivory" aria-labelledby="gallery-h">
        <div className="container-page">
          <StaggeredFade id="gallery-h" text={p.gallery.title} className="text-h2" />
          <div className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {p.gallery.items.map((g, i) => (
              <figure key={g.img} className={`${SPANS[i]} flex flex-col`}>
                <RevealImage delay={(i % 3) * 0.06} className="min-h-0 flex-1">
                  <Img name={g.img as ImageName} alt={g.name} sizes="(min-width: 640px) 40vw, 50vw" className="aspect-square h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:aspect-auto sm:min-h-[220px]" />
                </RevealImage>
                <figcaption className="mt-2 flex flex-wrap justify-between gap-x-3 text-[15px]">
                  <span className="font-medium">{g.name}</span>
                  <span className="text-ink-soft">{g.fact}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
