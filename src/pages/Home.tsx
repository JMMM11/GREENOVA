import { Hero } from "../sections/home/Hero";
import { Intro } from "../sections/home/Intro";
import { ValueProp } from "../sections/home/ValueProp";
import { Catalogue } from "../sections/home/Catalogue";
import { LotPlanner } from "../sections/shared/LotPlanner";
import { Audiences } from "../sections/home/Audiences";
import { InnovationRun } from "../sections/home/InnovationRun";
import { Differentiators } from "../sections/home/Differentiators";
import { Growth } from "../sections/home/Growth";
import { FinalCta } from "../sections/home/FinalCta";
import { ParallaxBand } from "../sections/shared/ParallaxBand";
import { useI18n } from "../i18n/I18nProvider";

function HomeParallax() {
  const { d } = useI18n();
  return <ParallaxBand img="led-maiz-2" title={d.parallax.title} text={d.parallax.text} alt={d.hero.posterAlt} />;
}

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <ValueProp />
      <Catalogue />
      <LotPlanner />
      <Audiences />
      <InnovationRun />
      <Differentiators />
      <HomeParallax />
      <Growth />
      <FinalCta />
    </>
  );
}
