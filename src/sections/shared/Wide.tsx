import { Img, type ImageName } from "../../components/ui/Img";

/** Fotografía panorámica justo bajo la cabecera de página (suele ser el LCP en móvil). */
export function Wide({ img, alt, className = "aspect-[16/9] lg:aspect-[21/9]" }: { img: ImageName; alt: string; className?: string }) {
  return (
    <div className="container-page">
      <div style={{ animationDelay: "0.45s" }} className={`rise overflow-hidden rounded-[var(--radius-media)] ${className}`}>
        <Img name={img} alt={alt} sizes="100vw" priority radius="none" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
