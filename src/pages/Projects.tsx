import { useI18n } from "../i18n/I18nProvider";
import { pathFor } from "../i18n/routes";
import { PageIntro } from "../sections/shared/PageIntro";
import { Img, type ImageName } from "../components/ui/Img";
import { Link } from "react-router";
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
  const { lang, d } = useI18n();
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

      <section className="section-y on-dark bg-olive-deep text-ivory" aria-labelledby="partners-h">
        <div className="container-page grid gap-8 lg:grid-cols-12">
          <StaggeredFade id="partners-h" text={p.pending.title} className="text-h2 lg:col-span-5" />
          <div className="lg:col-span-6 lg:col-start-7">
            <RevealText className="max-w-[48ch] text-lg leading-relaxed text-ivory/90">{p.pending.text}</RevealText>
            <Link to={pathFor("contact", lang)} className="mt-6 inline-flex min-h-11 items-center font-medium text-ivory underline decoration-ivory/50 underline-offset-4 hover:decoration-ivory">
              {d.nav.contact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
