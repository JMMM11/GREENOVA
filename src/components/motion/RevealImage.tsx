import { m } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EXPO, VIEWPORT } from "./tokens";

type Props = { children: ReactNode; className?: string; variant?: "wipe" | "scale"; delay?: number };

/** Imágenes: máscara que se abre de izquierda a derecha ("wipe") o escala de 1,08 a 1 ("scale"). */
export function RevealImage({ children, className = "", variant = "scale", delay = 0 }: Props) {
  if (variant === "wipe") {
    // El observador va en el contenedor: un elemento con clip-path cerrado no cuenta como visible.
    return (
      <m.div className={`overflow-hidden rounded-[var(--radius-media)] ${className}`} initial="hidden" whileInView="show" viewport={VIEWPORT}>
        <m.div
          data-reveal
          className="h-full w-full"
          variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, show: { clipPath: "inset(0 0% 0 0)" } }}
          transition={{ duration: 0.9, delay, ease: EASE_EXPO }}
        >
          {children}
        </m.div>
      </m.div>
    );
  }
  return (
    <div className={`overflow-hidden rounded-[var(--radius-media)] ${className}`}>
      <m.div
        data-reveal
        className="h-full w-full"
        initial={{ scale: 1.08, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.9, delay, ease: EASE_EXPO }}
      >
        {children}
      </m.div>
    </div>
  );
}
