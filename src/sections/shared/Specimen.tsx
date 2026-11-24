import { Img, type ImageName } from "../../components/ui/Img";

type Props = { img: ImageName; alt: string; name: string; fact: string; field: string; wide?: boolean; sizes?: string };

/** Ficha de ejemplar: la foto sobre un campo de color y, debajo, el nombre y un dato, como una etiqueta de lote. */
export function Specimen({ img, alt, name, fact, field, wide = false, sizes = "(min-width: 1024px) 25vw, 50vw" }: Props) {
  return (
    <figure>
      <div className={`${field} ${wide ? "aspect-[8/5]" : "aspect-[4/5]"} overflow-hidden rounded-[var(--radius-media)] p-[7%]`}>
        <Img name={img} alt={alt} sizes={sizes} radius="sm" className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-expo)] hover:scale-[1.03]" />
      </div>
      <figcaption className="mt-3">
        <span className="block text-[17px] font-medium text-ink sm:text-xl">{name}</span>
        <span className="mt-1 block text-[15px] leading-snug text-ink-soft sm:text-base">{fact}</span>
      </figcaption>
    </figure>
  );
}
