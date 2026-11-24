import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { Img } from "../../components/ui/Img";
import { RevealList } from "../../components/motion/RevealList";

/** Índice con vista previa: al señalar una fila, su foto aparece en un marco fijo y las demás filas se atenúan.
 *  En pantallas táctiles cada fila muestra su foto en línea. */
export function AudienceIndex({ detailed = false }: { detailed?: boolean }) {
  const { lang, d } = useI18n();
  const items = d.solutions.audiences;
  const [active, setActive] = useState<number | null>(null);
  const shown = items[active ?? 0];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <RevealList
        className="lg:col-span-7"
        items={items.map((a, i) => (
          <Link
            to={detailed ? `#${a.id}` : pathFor("solutions", lang, a.id)}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`group flex items-center gap-4 py-4 transition-opacity duration-[240ms] sm:py-5 ${active !== null && active !== i ? "lg:opacity-45" : ""}`}
          >
            <span className="w-20 shrink-0 overflow-hidden rounded-[var(--radius-media-sm)] lg:hidden">
              <Img name={a.img} alt="" sizes="80px" radius="sm" className="aspect-square w-full object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[clamp(1.35rem,1rem+1.6vw,2.75rem)] leading-tight">{a.name}</span>
              <span className="mt-1 block max-w-[52ch] text-[15px] leading-snug text-ink sm:text-base">{a.need}</span>
            </span>
            <ArrowUpRight size={22} aria-hidden className="shrink-0 text-earth transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        ))}
        itemClassName=""
      />
      <div className="relative hidden lg:col-span-5 lg:block" onPointerLeave={() => setActive(null)}>
        <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] bg-sand">
          <AnimatePresence initial={false}>
            <m.div
              key={shown.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
            >
              <Img name={shown.img} alt="" sizes="40vw" className="h-full w-full object-cover" />
            </m.div>
          </AnimatePresence>
          <p className="absolute inset-x-0 bottom-0 bg-ivory/90 p-4 text-[15px] leading-snug text-ink">{shown.offer}</p>
        </div>
      </div>
    </div>
  );
}
