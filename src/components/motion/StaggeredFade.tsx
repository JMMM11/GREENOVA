import { Fragment } from "react";
import { m } from "motion/react";
import { EASE_EXPO, VIEWPORT } from "./tokens";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** "view": al entrar en pantalla; "mount": al cargar (Hero). */
  trigger?: "view" | "mount";
  delay?: number;
  id?: string;
};

/** Titulares: cada palabra sube desde una máscara (overflow hidden), 60 ms entre palabras. */
export function StaggeredFade({ text, as = "h2", className, trigger = "view", delay = 0, id }: Props) {
  const Tag = as;
  const words = text.split(" ");
  if (trigger === "mount") {
    // Entrada con CSS: arranca al pintar el HTML prerenderizado, sin esperar a la hidratación.
    return (
      <Tag className={className} aria-label={text} id={id}>
        <span aria-hidden className="block">
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
                <span className="word-rise inline-block" style={{ animationDelay: `${delay + i * 0.06}s` }}>{w}</span>
              </span>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </span>
      </Tag>
    );
  }
  return (
    <Tag className={className} aria-label={text} id={id}>
      <m.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        transition={{ staggerChildren: 0.06, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
          {/* pb/-mb evitan que la máscara corte descendentes (g, j, p, q, y) */}
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
            <m.span
              data-reveal
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "105%", opacity: 0 },
                show: { y: 0, opacity: 1, transition: { duration: 0.85, ease: EASE_EXPO } },
              }}
            >
              {w}
            </m.span>
          </span>
          {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </m.span>
    </Tag>
  );
}
