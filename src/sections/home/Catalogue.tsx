import { useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { SPECIES, SPECIES_IMG, TILE_FIELDS } from "../../data/species";
import { TextLink } from "../../components/ui/Action";
import { RevealList } from "../../components/motion/RevealList";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";
import { Specimen } from "../shared/Specimen";

/** El catálogo: titular en las columnas 1-3 y las fichas de ejemplar en 4-12. */
export function Catalogue() {
  const { lang, d } = useI18n();
  const t = d.home.catalogue;
  const formats = d.products.formats.items;
  const tiles = [
    ...SPECIES.map((k, i) => ({ img: SPECIES_IMG[k], alt: d.species[k].alt, name: d.species[k].name, fact: d.species[k].fact, wide: i === 1 })),
    { img: "aclimatacion-2" as const, alt: d.products.gallery.items[3].name, name: formats[1].name, fact: formats[1].text, wide: false },
    { img: "camara-bandejas" as const, alt: d.home.intro.img1, name: formats[3].name, fact: formats[3].text, wide: false },
  ];
  return (
    <section className="section-y bg-ivory">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <StaggeredFade text={t.title} className="text-h2" />
          <RevealText className="mt-5 max-w-[30ch] text-lg leading-relaxed">{t.text}</RevealText>
          <TextLink to={pathFor("products", lang)} className="mt-6">{t.link}</TextLink>
        </div>
        <RevealList
          as="div"
          className="grid grid-flow-row-dense grid-cols-2 gap-x-2.5 gap-y-8 sm:grid-cols-3 lg:col-span-9"
          itemClassName={(i) => (tiles[i].wide ? "col-span-2" : "")}
          items={tiles.map((tile, i) => (
            <Specimen key={tile.name} {...tile} field={TILE_FIELDS[i % 3]} />
          ))}
        />
      </div>
    </section>
  );
}
