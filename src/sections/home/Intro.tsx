import { useI18n } from "../../i18n/I18nProvider";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

/** Primer bloque claro tras el Hero: el enunciado de la propuesta. */
export function Intro() {
  const { d } = useI18n();
  const t = d.home.intro;
  return (
    <section className="section-y relative bg-ivory">
      <div className="container-page grid gap-8 lg:grid-cols-12">
        <StaggeredFade text={t.title} className="text-h2 lg:col-span-4" />
        <RevealText className="text-statement max-w-[34ch] md:max-w-none font-display font-medium text-ink lg:col-span-8">{t.text}</RevealText>
      </div>
    </section>
  );
}
