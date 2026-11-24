import { useI18n } from "../../i18n/I18nProvider";
import { Img } from "../../components/ui/Img";
import { RevealImage } from "../../components/motion/RevealImage";
import { RevealList } from "../../components/motion/RevealList";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

/** Propuesta de valor en formato editorial: titular fijo a la izquierda, tres ideas con foto a la derecha. */
export function ValueProp() {
  const { d } = useI18n();
  const t = d.home.value;
  return (
    <section className="section-y bg-sand">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <StaggeredFade text={t.title} className="text-h2" />
            <RevealImage className="mt-10 hidden aspect-[4/5] lg:block">
              <Img name="led-detalle" alt="" sizes="30vw" className="h-full w-full object-cover" />
            </RevealImage>
          </div>
        </div>
        <RevealList
          className="flex flex-col gap-14 lg:col-span-7 lg:col-start-6 lg:gap-24 lg:pt-28"
          items={t.items.map((it) => (
            <>
              <h3 className="text-h3 font-display">{it.name}</h3>
              <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink">{it.text}</p>
            </>
          ))}
        />
      </div>
    </section>
  );
}
