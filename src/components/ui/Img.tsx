import images from "../../data/images.json";

export type ImageName = keyof typeof images;

type Props = {
  name: ImageName | string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Radio de esquina: md (por defecto), sm (miniaturas y fotos dentro de fichas) o none. */
  radius?: "md" | "sm" | "none";
};

const RADIUS = { md: "rounded-[var(--radius-media)]", sm: "rounded-[var(--radius-media-sm)]", none: "" };

/** Foto propia en WebP con srcset, dimensiones explícitas y carga diferida fuera del primer viewport. */
export function Img({ name, alt, sizes = "100vw", className = "", priority = false, radius = "md" }: Props) {
  const meta = images[name as ImageName];
  if (!meta) throw new Error(`Imagen desconocida: ${name}`);
  const srcSet = meta.widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ");
  const largest = meta.widths[meta.widths.length - 1];
  return (
    <img
      src={`/images/${name}-${largest}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={meta.w}
      height={meta.h}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={`${RADIUS[radius]} ${className}`}
    />
  );
}
