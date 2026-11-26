import { useI18n } from "../i18n/I18nProvider";
import { PageIntro } from "../sections/shared/PageIntro";
import { Img, type ImageName } from "../components/ui/Img";
import { RevealImage } from "../components/motion/RevealImage";
import { RevealText } from "../components/motion/RevealText";
import { StaggeredFade } from "../components/motion/StaggeredFade";

/** Mosaico por número de fotos: la primera siempre domina. */
const MOSAIC: Record<number, string[]> = {
  2: ["col-span-2 sm:col-span-1 aspect-[4/3]", "col-span-2 sm:col-span-1 aspect-[4/3]"],
  3: ["col-span-2 aspect-[16/9]", "aspect-square", "aspect-square"],
  4: ["aspect-square", "aspect-square", "aspect-square", "aspect-square"],
};

export default function Projects() {
  const { d } = useI18n();
  const p = d.projects;
  return (
    <>
      <PageIntro title={p.title} intro={p.intro} />

      {p.items.map((it, n) => (
        <section key={it.id} id={it.id} className={`section-y ${n % 2 ? "bg-sand" : "bg-ivory"}`} aria-labelledby={`${it.id}-h`}>
          <div className="container-page grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <StaggeredFade id={`${it.id}-h`} text={it.name} className="text-h2" />
                <RevealText className="mt-6 max-w-[44ch] text-lg leading-relaxed">{it.text}</RevealText>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:col-span-7">
              {it.imgs.map((img, i) => (
                <RevealImage key={img} delay={i * 0.06} className={MOSAIC[it.imgs.length][i]}>
                  <Img name={img as ImageName} alt={`${it.name} (${i + 1})`} sizes="(min-width: 1024px) 33vw, 50vw" className="h-full w-full object-cover" />
                </RevealImage>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
