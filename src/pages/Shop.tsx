import { useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { CATALOG } from "../data/catalog";
import { TILE_FIELDS } from "../data/species";
import { PageIntro } from "../sections/shared/PageIntro";
import { ParallaxBand } from "../sections/shared/ParallaxBand";
import { ProductTile } from "../sections/shop/ProductTile";

const FILTERS = ["all", "unit", "tray", "mixed"] as const;

export default function Shop() {
  const { d } = useI18n();
  const s = d.shop;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const items = CATALOG.filter((sku) => filter === "all" || sku.kind === filter);

  return (
    <>
      <PageIntro
        title={s.title}
        intro={s.intro}
        aside={
          <dl className="flex flex-col gap-2">
            {s.perks.map((p) => (
              <div key={p.name} className="rounded-[var(--radius-media-sm)] bg-sand px-5 py-4">
                <dt className="font-medium">{p.name}</dt>
                <dd className="mt-1 text-[15px] leading-snug">{p.text}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section className="bg-ivory pb-24 lg:pb-32" aria-labelledby="catalog-h">
        <div className="container-page">
          <h2 id="catalog-h" className="sr-only">{d.home.catalogue.title}</h2>
          <div role="group" aria-label={s.filterLabel} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className="min-h-11 rounded-full px-5 text-[15px] font-medium ring-1 ring-ink/20 ring-inset transition-colors hover:bg-ink/5 aria-pressed:bg-ink aria-pressed:text-ivory aria-pressed:ring-ink"
              >
                {f === "all" ? s.filterAll : s.kinds[f]}
              </button>
            ))}
          </div>
          {/* Entrada con CSS: la cuadrícula es el contenido principal y no depende del scroll */}
          <div key={filter} className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((sku, i) => (
              <div key={sku.id} className="rise" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <ProductTile sku={sku} field={TILE_FIELDS[i % 3]} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBand img="camara-doble" title={d.parallax.title} text={d.parallax.text} alt={d.home.innovation.caption} />
      <div className="h-24 bg-ivory lg:h-32" />
    </>
  );
}
