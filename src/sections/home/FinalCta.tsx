import { Link } from "react-router";
import { useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { Img, type ImageName } from "../../components/ui/Img";
import { PhotoStrip } from "../shared/PhotoStrip";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

const STRIP: [ImageName, ImageName, ImageName] = ["huerto-1", "led-maiz-4", "equipo-siembra"];

/** Cierre: tres fotos de borde a borde y un campo de color con la acción subrayada. */
export function FinalCta() {
  const { lang, d } = useI18n();
  const t = d.home.cta;
  return (
    <section aria-labelledby="cta-h">
      <PhotoStrip imgs={STRIP} alts={["", "", ""]} />
      <div className="bg-clay">
        <div className="container-page relative grid gap-6 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <StaggeredFade id="cta-h" text={t.title} className="text-h2" />
            <RevealText className="mt-6 max-w-[46ch] text-lg leading-relaxed">{t.text}</RevealText>
            <RevealText as="div" delay={0.1} className="mt-8">
              <Link
                to={pathFor("contact", lang)}
                className="font-display text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] text-earth underline decoration-[3px] underline-offset-[8px] transition-colors hover:text-earth-deep"
              >
                {t.link}
              </Link>
            </RevealText>
          </div>
          <div className="w-28 justify-self-end self-end sm:w-36 lg:col-span-2 lg:col-start-11">
            <Img name="equipo-huerto" alt={t.photoAlt} sizes="150px" className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
