import { Minus, Plus } from "@phosphor-icons/react/ssr";
import { useI18n } from "../../i18n/I18nProvider";

/** Selector de cantidad con botones de 44 px y campo numérico accesible. */
export function QtyStepper({ value, onChange, label, min = 1 }: { value: number; onChange: (n: number) => void; label: string; min?: number }) {
  const { d } = useI18n();
  const btn = "grid size-11 place-items-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="inline-flex items-center rounded-[var(--radius-ui)] bg-ivory ring-1 ring-inset ring-ink/20">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`${d.shop.decrease}: ${label}`}>
        <Minus size={16} aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={999}
        value={value}
        aria-label={`${d.shop.qty}: ${label}`}
        onChange={(e) => onChange(Math.max(min, Math.min(999, Math.floor(Number(e.target.value) || min))))}
        className="w-10 bg-transparent text-center text-base tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= 999} aria-label={`${d.shop.increase}: ${label}`}>
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
