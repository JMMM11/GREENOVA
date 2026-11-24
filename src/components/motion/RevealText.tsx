import { m } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EXPO, VIEWPORT } from "./tokens";

type Props = { children: ReactNode; as?: "p" | "div" | "blockquote" | "span"; delay?: number; className?: string };

/** Párrafos: fundido y 24 px de subida, sin desenfoque (rendimiento). El texto existe en el HTML desde el inicio. */
export function RevealText({ children, as = "p", delay = 0, className }: Props) {
  const Tag = m[as];
  return (
    <Tag
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay, ease: EASE_EXPO }}
    >
      {children}
    </Tag>
  );
}
