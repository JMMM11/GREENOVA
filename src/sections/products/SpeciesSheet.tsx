import { useI18n } from "../../i18n/I18nProvider";
import { SPECIES_IMG, TILE_FIELDS, type SpeciesKey } from "../../data/species";
import { Img } from "../../components/ui/Img";
import { RevealImage } from "../../components/motion/RevealImage";
import { RevealList } from "../../components/motion/RevealList";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

const SPEC_KEYS = ["delivery", "depth", "temp", "light", "water", "ready"] as const;

/** Ficha de catálogo: el ejemplar sobre su campo de color y la hoja técnica al lado, como la etiqueta del lote. */
export function SpeciesSheet({ k, index }: { k: SpeciesKey; index: number }) {
  const { d } = useI18n();
  const s = d.species[k];
  const labels = d.products.specs;
  return (
    <article id={k} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <RevealImage className={`${TILE_FIELDS[index]} max-w-[440px] p-[7%] lg:col-span-4`}>
        <Img name={SPECIES_IMG[k]} alt={s.alt} sizes="(min-width: 1024px) 30vw, 90vw" radius="sm" className="aspect-[4/5] w-full object-cover" />
      </RevealImage>
      <div className="lg:col-span-8">
        <StaggeredFade text={s.name} className="text-display" />
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed">{s.use}</p>
        <p className="mt-3 text-base font-medium text-olive-deep">{s.fact}</p>
        <RevealList
          as="dl"
          className="mt-8 grid gap-x-8 gap-y-6 bg-sand/70 p-6 sm:grid-cols-2 sm:p-8 xl:grid-cols-3"
          items={SPEC_KEYS.map((key) => (
            <>
              <dt className="text-[13px] text-ink-soft">{labels[key]}</dt>
              <dd className="mt-1 text-base font-medium">{s[key]}</dd>
            </>
          ))}
        />
      </div>
    </article>
  );
}
