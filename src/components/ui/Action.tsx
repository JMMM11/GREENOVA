import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "@phosphor-icons/react/ssr";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-ui)] px-5 text-[15px] font-medium whitespace-nowrap transition-[background-color,color,transform] duration-200 ease-[var(--ease-expo)] hover:-translate-y-px active:translate-y-px active:scale-[0.98]";

const variants = {
  primary: "bg-earth text-ivory hover:bg-earth-deep",
  outline: "bg-transparent text-ink ring-1 ring-inset ring-ink/25 hover:bg-ink/5",
  light: "bg-ivory text-ink hover:bg-sand",
};

type Props = { to: string; children: ReactNode; variant?: keyof typeof variants; className?: string; arrow?: boolean; label?: string };

/** Enlace con aspecto de botón. Todos los CTA del sitio llevan a una ruta real. */
export function ActionLink({ to, children, variant = "primary", className = "", arrow = false, label }: Props) {
  return (
    <Link to={to} aria-label={label} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {arrow && <ArrowRight size={16} weight="regular" aria-hidden />}
    </Link>
  );
}

/** Enlace de texto con subrayado que crece en hover. */
export function TextLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-1.5 font-medium text-earth underline decoration-earth/40 decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-earth ${className}`}
    >
      {children}
      <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

export const buttonClass = `${base} ${variants.primary}`;
