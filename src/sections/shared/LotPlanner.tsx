import { useEffect, useId, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { fill, useI18n } from "../../i18n/I18nProvider";
import { useCart } from "../../lib/cart";
import { SPECIES, type SpeciesKey } from "../../data/species";
import { addDays, parseISO, planLot, toISO } from "../../lib/dates";
import { buttonClass } from "../../components/ui/Action";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";
import { EASE_EXPO } from "../../components/motion/tokens";

/** Planificador: el visitante elige especie y fecha de trasplante y ve la etiqueta de trazabilidad que llevaría su plantón. */
export function LotPlanner() {
  const { lang, d } = useI18n();
  const t = d.planner;
  const id = useId();
  const [species, setSpecies] = useState<SpeciesKey>("maiz");
  const [today, setToday] = useState<Date | null>(null); // solo en cliente, para no desajustar el HTML prerenderizado
  const [date, setDate] = useState("");
  const sp = d.species[species];
  const cart = useCart();

  useEffect(() => {
    const now = new Date();
    const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setToday(t0);
    setDate(toISO(addDays(t0, 21)));
  }, []);

  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-PA" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  const plan = today && date ? planLot(today, parseISO(date), sp.readyMin, sp.readyMax) : null;
  const lot = plan?.ok ? `${sp.code}-${toISO(plan.sow).slice(2).replace(/-/g, "")}` : "";

  return (
    <section className="section-y overflow-hidden bg-olive-deep text-ivory on-dark" aria-labelledby={`${id}-h`}>
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <StaggeredFade id={`${id}-h`} text={t.title} className="text-h2" />
          <RevealText className="mt-5 max-w-[44ch] text-lg leading-relaxed text-ivory/90">{t.text}</RevealText>

          <fieldset className="mt-9">
            <legend className="text-[15px] font-medium">{t.species}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPECIES.map((k) => (
                <label key={k} className="cursor-pointer">
                  <input type="radio" name={`${id}-sp`} value={k} checked={species === k} onChange={() => setSpecies(k)} className="peer sr-only" />
                  <span className="inline-flex min-h-11 items-center rounded-[var(--radius-ui)] bg-ivory/10 px-5 text-[15px] font-medium transition-colors duration-200 peer-checked:bg-ivory peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ivory hover:bg-ivory/20 peer-checked:hover:bg-ivory">
                    {d.species[k].name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor={`${id}-date`} className="mt-7 block text-[15px] font-medium">{t.date}</label>
          <input
            id={`${id}-date`}
            type="date"
            value={date}
            min={today ? toISO(today) : undefined}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 min-h-12 w-full max-w-xs rounded-[var(--radius-ui)] bg-ivory px-4 text-base text-ink [color-scheme:light]"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
          <m.div
            data-reveal
            initial={{ opacity: 0, y: 32, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
            className="bg-ivory p-7 text-ink sm:p-10"
          >
            <p className="font-display text-[28px] font-semibold tracking-[0.04em]">GREENOVA</p>
            <p className="mt-6 font-display text-[clamp(2.4rem,2rem+2vw,3.6rem)] leading-none">{sp.name}</p>
            <AnimatePresence mode="wait">
              <m.div key={`${species}-${date}-${today ? 1 : 0}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE_EXPO }}>
                {!plan && <p className="mt-8 text-base text-ink-soft">{t.pick}</p>}
                {plan && !plan.ok && (
                  <p className="mt-8 text-base text-error">{fill(t.tooSoon, { min: sp.readyMin, date: fmt.format(plan.earliest) })}</p>
                )}
                {plan?.ok && (
                  <>
                    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-base tabular-nums">
                      <Row term={t.lot} value={lot} />
                      <Row term={t.sown} value={fmt.format(plan.sow)} />
                      <Row term={t.age} value={`${plan.age} ${t.days}`} />
                      <Row term={t.orderBy} value={fmt.format(plan.orderBy)} />
                      <Row term={t.care} value={`${sp.water}. ${d.products.specs.depth}: ${sp.depth}.`} className="col-span-2" />
                    </dl>
                    <p className="mt-6 text-[13px] leading-snug text-ink-soft">{t.label}. {t.example} {t.orderNote}</p>
                    <button
                      type="button"
                      onClick={() => {
                        cart.add(`${species}-unidad`);
                        cart.setOpen(true);
                      }}
                      className={`${buttonClass} mt-7 w-full sm:w-auto`}
                    >
                      {t.cta}
                    </button>
                  </>
                )}
              </m.div>
            </AnimatePresence>
          </m.div>
        </div>
      </div>
    </section>
  );
}

function Row({ term, value, className }: { term: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[13px] text-ink-soft">{term}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
