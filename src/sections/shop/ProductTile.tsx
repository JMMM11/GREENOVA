import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "@phosphor-icons/react/ssr";
import { fill, useI18n } from "../../i18n/I18nProvider";
import { READY_MIN, type Sku } from "../../data/catalog";
import { money, useCart } from "../../lib/cart";
import { Img } from "../../components/ui/Img";
import { QtyStepper } from "../../components/cart/QtyStepper";
import { skuName } from "../../components/cart/skuName";

/** Ficha de tienda: ejemplar sobre su campo de color, precio, cantidad y botón de añadir. */
export function ProductTile({ sku, field }: { sku: Sku; field: string }) {
  const { d } = useI18n();
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const name = skuName(sku, d);
  const ready = Math.max(...sku.species.map((s) => READY_MIN[s]));

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const add = () => {
    cart.add(sku.id, qty);
    setAdded(true);
    setQty(1);
  };

  return (
    <article className="flex flex-col">
      <div className={`${field} aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] p-[6%]`}>
        <Img
          name={sku.img}
          alt={name}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          radius="sm"
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-expo)] hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[22px] leading-tight">{name}</h3>
          <p className="mt-1 text-[15px] text-ink-soft">
            {sku.cells === 1 ? d.shop.cellOne : fill(d.shop.cells, { n: sku.cells })}
            {sku.kind === "mixed" ? ` · ${d.shop.mixedNote}` : ` · ${money.format(sku.price / sku.cells)} ${d.shop.perSeedling}`}
          </p>
          <p className="text-[15px] text-ink-soft">{fill(d.shop.ready, { n: ready })}</p>
        </div>
        <p className="shrink-0 font-display text-[26px] leading-none tabular-nums">{money.format(sku.price)}</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <QtyStepper value={qty} onChange={setQty} label={name} />
        <button
          type="button"
          onClick={add}
          aria-label={fill(d.shop.addTo, { name })}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-ui)] bg-earth px-4 text-[15px] font-medium text-ivory transition-[background-color,transform] duration-200 hover:bg-earth-deep active:scale-[0.98]"
        >
          {added ? <Check size={18} aria-hidden /> : <ShoppingBag size={18} aria-hidden />}
          <span aria-live="polite">{added ? d.shop.added : d.shop.add}</span>
        </button>
      </div>
    </article>
  );
}
