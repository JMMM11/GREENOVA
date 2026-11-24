import type { ReactNode } from "react";

type Props = { id: string; label: string; error?: string; hint?: string; children: (aria: Record<string, string | boolean | undefined>) => ReactNode };

/** Campo con etiqueta visible, pista y error asociados por aria-describedby. */
export function Field({ id, label, error, hint, children }: Props) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-[15px] font-medium text-ink">{label}</label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-[14px] text-ink-soft">{hint}</p>}
      <div className="mt-2">{children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}</div>
      {error && <p id={`${id}-err`} className="mt-2 text-[15px] text-error">{error}</p>}
    </div>
  );
}

export const inputClass =
  "w-full min-h-12 rounded-[var(--radius-ui)] bg-ivory px-4 text-base text-ink ring-1 ring-inset ring-ink/20 transition-shadow placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-earth aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error";
