import { useI18n } from "../../i18n/I18nProvider";
import { RevealText } from "../../components/motion/RevealText";
import { StaggeredFade } from "../../components/motion/StaggeredFade";
import { AudienceIndex } from "../shared/AudienceIndex";

export function Audiences() {
  const { d } = useI18n();
  return (
    <section className="section-y bg-ivory">
      <div className="container-page">
        <StaggeredFade text={d.home.solutions.title} className="text-h2" />
        <RevealText className="mt-4 mb-10 max-w-[48ch] text-lg leading-relaxed lg:mb-14">{d.home.solutions.text}</RevealText>
        <AudienceIndex />
      </div>
    </section>
  );
}
