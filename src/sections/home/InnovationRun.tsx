import { useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { Img, type ImageName } from "../../components/ui/Img";
import { TextLink } from "../../components/ui/Action";
import { RevealImage } from "../../components/motion/RevealImage";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

const FRAMES: { img: ImageName; lifted?: boolean }[] = [
  { img: "construccion-3" },
  { img: "camara-doble", lifted: true },
  { img: "plantones-camara" },
  { img: "led-detalle" },
  { img: "camara-v2" },
];

/** Innovación en la Home: tira de fotogramas de la cámara, uno elevado. */
export function InnovationRun() {
  const { lang, d } = useI18n();
  const t = d.home.innovation;
  const labels = d.innovation.diagram;
  const names = [labels.brain, t.caption, labels.sensors, labels.actuatorList[0], d.projects.items[3].name];
  return (
    <section className="section-y overflow-hidden bg-sand">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <StaggeredFade text={t.title} className="text-h2" />
          <RevealText className="mt-5 max-w-[34ch] text-lg leading-relaxed">{t.text}</RevealText>
          <TextLink to={pathFor("innovation", lang)} className="mt-6">{t.link}</TextLink>
        </div>
        <div className="-mr-4 flex snap-x snap-mandatory items-end gap-1.5 overflow-x-auto pb-2 sm:-mr-8 lg:col-span-9 lg:-mr-14 lg:snap-none lg:overflow-visible">
          {FRAMES.map((f, i) => (
            <figure key={f.img} className={`shrink-0 snap-start ${f.lifted ? "order-first lg:order-none" : ""}`}>
              <RevealImage variant="wipe" delay={i * 0.08} className={`aspect-[4/3] ${f.lifted ? "h-[52vw] max-h-[66vh] lg:h-[60vh]" : "h-[34vw] max-h-[30vh] lg:h-[27vh]"}`}>
                <Img name={f.img} alt="" sizes="40vw" className="h-full w-full object-cover" />
              </RevealImage>
              <figcaption className="mt-2 text-[13px] text-ink-soft sm:text-[15px]">{names[i]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
