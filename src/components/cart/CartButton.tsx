import { ShoppingBag } from "@phosphor-icons/react/ssr";
import { useI18n } from "../../i18n/I18nProvider";
import { useCart } from "../../lib/cart";

/** Abre el pedido. El número indica cuántos artículos hay en el carrito. */
export function CartButton({ dark }: { dark: boolean }) {
  const { d } = useI18n();
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`${d.nav.cart}${count ? ` (${count})` : ""}`}
      className={`relative grid size-11 place-items-center rounded-[var(--radius-ui)] transition-colors duration-200 ${dark ? "text-ivory hover:bg-ivory/10" : "text-ink hover:bg-ink/5"}`}
    >
      <ShoppingBag size={22} aria-hidden />
      {count > 0 && (
        <span aria-hidden className="absolute top-1 right-0.5 grid min-w-5 place-items-center rounded-full bg-earth px-1 text-[11px] leading-5 font-semibold text-ivory">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
