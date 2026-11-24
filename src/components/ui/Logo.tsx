/** Logotipo oficial (Img/greenova_logo.svg) con el nombre en la tipografía de titulares. */
export function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/logo.svg" alt="" width={26} height={28} className="h-7 w-auto" />
      <span
        className={`font-display text-[22px] font-semibold tracking-[0.06em] ${dark ? "text-ivory" : "text-ink"}`}
      >
        GREENOVA
      </span>
    </span>
  );
}
