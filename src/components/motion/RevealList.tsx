import { m } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EXPO, VIEWPORT } from "./tokens";

type Props = { items: ReactNode[]; as?: "ul" | "ol" | "div" | "dl"; className?: string; itemClassName?: string | ((i: number) => string) };

/** Listas: cada elemento sube 16 px con 60 ms de diferencia. */
export function RevealList({ items, as = "ul", className, itemClassName }: Props) {
  const List = m[as];
  const Item = as === "div" || as === "dl" ? m.div : m.li;
  return (
    <List className={className} initial="hidden" whileInView="show" viewport={VIEWPORT} transition={{ staggerChildren: 0.06 }}>
      {items.map((item, i) => (
        <Item
          key={i}
          data-reveal
          className={typeof itemClassName === "function" ? itemClassName(i) : itemClassName}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO } },
          }}
        >
          {item}
        </Item>
      ))}
    </List>
  );
}
