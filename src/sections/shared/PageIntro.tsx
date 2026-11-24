import type { ReactNode } from "react";
import { StaggeredFade } from "../../components/motion/StaggeredFade";

/** Cabecera de página interior: h1 grande a la izquierda, entradilla debajo y, opcionalmente, una pieza a la derecha. */
export function PageIntro({ title, intro, aside }: { title: string; intro: string; aside?: ReactNode }) {
  return (
    <section className="bg-ivory pt-[136px] pb-16 lg:pt-[184px] lg:pb-24">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <StaggeredFade as="h1" trigger="mount" delay={0.1} text={title} className="text-display max-w-[18ch]" />
          <p style={{ animationDelay: "0.3s" }} className="rise mt-7 max-w-[56ch] text-lg leading-relaxed lg:text-xl">
            {intro}
          </p>
        </div>
        {aside && (
          <div style={{ animationDelay: "0.4s" }} className="rise lg:col-span-5">
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
