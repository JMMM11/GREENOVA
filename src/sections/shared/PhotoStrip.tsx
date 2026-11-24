import { Img, type ImageName } from "../../components/ui/Img";
import { RevealImage } from "../../components/motion/RevealImage";

/** Tres fotografías en fila, redondeadas y con separación. */
export function PhotoStrip({ imgs, alts }: { imgs: [ImageName, ImageName, ImageName]; alts: [string, string, string] }) {
  return (
    <div className="container-page grid grid-cols-2 gap-2.5 py-2.5 sm:grid-cols-3">
      {imgs.map((img, i) => (
        <RevealImage key={img} delay={i * 0.08} className={`${i === 0 ? "col-span-2 sm:col-span-1" : ""} aspect-[4/3] sm:aspect-auto sm:h-[40svh]`}>
          <Img name={img} alt={alts[i]} sizes="(min-width: 640px) 33vw, 100vw" className="h-full w-full object-cover" />
        </RevealImage>
      ))}
    </div>
  );
}
