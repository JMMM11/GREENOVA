import { m } from "motion/react";
import { useI18n } from "../../i18n/I18nProvider";
import { EASE_EXPO, VIEWPORT } from "../../components/motion/tokens";

/** Conector dibujado: horizontal en escritorio, vertical en móvil. Se traza al entrar en pantalla. */
function Connector() {
  return (
    <div aria-hidden className="flex items-center justify-center py-2 lg:px-2 lg:py-0">
      <svg viewBox="0 0 64 24" className="h-6 w-16 rotate-90 text-olive lg:rotate-0">
        <m.path
          d="M2 12 H56 M48 5 L58 12 L48 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE_EXPO }}
        />
      </svg>
    </div>
  );
}

function Block({ title, items, strong = false }: { title: string; items: string[]; strong?: boolean }) {
  return (
    <div className={`${strong ? "bg-olive-deep text-ivory" : "bg-ivory"} p-6 sm:p-7`}>
      <p className="font-display text-[28px] leading-tight">{title}</p>
      <ul className={`mt-4 flex flex-col gap-2 text-base ${strong ? "text-ivory/90" : "text-ink"}`}>
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

/** Diagrama: sensores → Arduino UNO → actuadores, con el registro debajo de la placa. */
export function ChamberDiagram() {
  const { d } = useI18n();
  const t = d.innovation.diagram;
  return (
    <figure aria-label={t.aria} className="bg-sand p-4 sm:p-8">
      <div className="grid items-center lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Block title={t.sensors} items={t.sensorList} />
        <Connector />
        <div className="flex flex-col">
          <Block title={t.brain} items={[]} strong />
          <div aria-hidden className="mx-auto h-6 w-[3px] bg-olive" />
          <Block title={t.log} items={t.logList} />
        </div>
        <Connector />
        <Block title={t.actuators} items={t.actuatorList} />
      </div>
      <figcaption className="mt-6 max-w-[60ch] text-base leading-relaxed">{t.text}</figcaption>
    </figure>
  );
}
