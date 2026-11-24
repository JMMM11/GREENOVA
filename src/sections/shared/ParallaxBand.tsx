import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Img, type ImageName } from "../../components/ui/Img";
import { StaggeredFade } from "../../components/motion/StaggeredFade";
import { RevealText } from "../../components/motion/RevealText";

type Props = { img: ImageName; title: string; text: string; alt: string };

/** Ventana con parallax moderado: la foto se desplaza más despacio que la página. Sin efecto con movimiento reducido. */
export function ParallaxBand({ img, title, text, alt }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="bg-ivory py-2.5" aria-labelledby="parallax-h">
      <div className="container-page">
        <div className="on-dark relative isolate flex min-h-[70svh] items-end overflow-hidden rounded-[var(--radius-media)] text-ivory lg:min-h-[84svh]">
          <m.div className="absolute inset-x-0 -top-[14%] -z-10 h-[128%]" style={reduce ? undefined : { y }}>
            <Img name={img} alt={alt} sizes="100vw" radius="none" className="h-full w-full object-cover" />
          </m.div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_17_11/0.8),rgb(15_17_11/0.1)_60%)]" />
          <div className="p-6 sm:p-10 lg:p-16">
            <StaggeredFade id="parallax-h" text={title} className="text-display max-w-[12ch] text-ivory" />
            <RevealText className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ivory/90 lg:text-xl">{text}</RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
