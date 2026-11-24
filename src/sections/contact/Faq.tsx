import { Plus } from "@phosphor-icons/react/ssr";
import { useI18n } from "../../i18n/I18nProvider";
import { StaggeredFade } from "../../components/motion/StaggeredFade";
import { RevealList } from "../../components/motion/RevealList";

/** Preguntas frecuentes con respuestas tomadas de información.md. El mismo contenido va en el JSON-LD FAQPage. */
export function Faq() {
  const { d } = useI18n();
  return (
    <section className="section-y bg-sand" aria-labelledby="faq-h">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <StaggeredFade id="faq-h" text={d.faq.title} className="text-h2 lg:col-span-4" />
        <RevealList
          as="div"
          className="flex flex-col gap-2 lg:col-span-8"
          items={d.faq.items.map((f) => (
            <details className="group rounded-[var(--radius-media-sm)] bg-ivory open:bg-ivory">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus size={20} aria-hidden className="shrink-0 text-earth transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] px-5 pb-5 text-base leading-relaxed">{f.a}</p>
            </details>
          ))}
        />
      </div>
    </section>
  );
}
