import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { AnimatePresence, m } from "motion/react";
import { Trash, X } from "@phosphor-icons/react/ssr";
import { fill, useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { SKU, DISCOUNT_FROM } from "../../data/catalog";
import { money, useCart } from "../../lib/cart";
import { Img } from "../ui/Img";
import { buttonClass } from "../ui/Action";
import { EASE_EXPO } from "../motion/tokens";
import { QtyStepper } from "./QtyStepper";
import { skuName } from "./skuName";
import { Checkout } from "./Checkout";

/** Panel lateral del pedido: carrito y, en un segundo paso, el formulario de envío. */
export function CartDrawer() {
  const { lang, d } = useI18n();
  const cart = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const panel = useRef<HTMLDivElement>(null);
  const t = d.cart;

  useEffect(() => {
    if (!cart.open) return setStep("cart");
    const prev = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("button, a, input")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return cart.setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>("button:not(:disabled), a, input, select, textarea")];
      if (!f.length) return;
      const [first, last] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [cart.open]); // solo al abrir o cerrar

  const { totals } = cart;
  const missing = DISCOUNT_FROM - totals.seedlings;

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {cart.open && (
        <>
          <m.div key="scrim" className="fixed inset-0 z-50 bg-night/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => cart.setOpen(false)} aria-hidden />
          <m.div
            key="panel"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-h"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-ivory shadow-[0_0_40px_rgb(15_17_11/0.25)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between px-5">
              <h2 id="cart-h" className="text-h3">{t.title}</h2>
              <button type="button" onClick={() => cart.setOpen(false)} aria-label={t.close} className="grid size-11 place-items-center rounded-[var(--radius-ui)] hover:bg-ink/5">
                <X size={22} aria-hidden />
              </button>
            </div>

            {step === "checkout" ? (
              <Checkout onBack={() => setStep("cart")} />
            ) : cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start gap-6 px-5 pt-6">
                <p className="text-lg">{t.empty}</p>
                <Link to={pathFor("shop", lang)} onClick={() => cart.setOpen(false)} className={buttonClass}>{t.browse}</Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5">
                  {cart.lines.map((l) => {
                    const sku = SKU[l.id];
                    const name = skuName(sku, d);
                    return (
                      <li key={l.id} className="flex gap-4 py-4">
                        <Img name={sku.img} alt="" sizes="80px" radius="sm" className="size-20 shrink-0 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{name}</p>
                          <p className="text-[15px] text-ink-soft">{money.format(sku.price)}</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <QtyStepper value={l.qty} onChange={(n) => cart.set(l.id, n)} label={name} />
                            <button type="button" onClick={() => cart.set(l.id, 0)} aria-label={fill(t.remove, { name })} className="grid size-11 place-items-center rounded-[var(--radius-ui)] text-ink-soft hover:bg-ink/5 hover:text-error">
                              <Trash size={18} aria-hidden />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="shrink-0 bg-sand px-5 py-5">
                  <Totals />
                  {missing > 0 && <p className="mt-2 text-[14px] text-ink-soft">{fill(t.discountHint, { n: missing })}</p>}
                  <button type="button" onClick={() => setStep("checkout")} className={`${buttonClass} mt-4 w-full`}>{t.checkout}</button>
                </div>
              </>
            )}
          </m.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Totals() {
  const { d } = useI18n();
  const { totals } = useCart();
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-base tabular-nums">
      <dt className="text-ink-soft">{d.cart.subtotal} · {totals.seedlings === 1 ? d.shop.cellOne : fill(d.cart.seedlings, { n: totals.seedlings })}</dt>
      <dd className="text-right">{money.format(totals.subtotal)}</dd>
      {totals.discount > 0 && (
        <>
          <dt className="text-olive-deep">{d.cart.discount}</dt>
          <dd className="text-right text-olive-deep">−{money.format(totals.discount)}</dd>
        </>
      )}
      <dt className="mt-1 text-lg font-semibold">{d.cart.total}</dt>
      <dd className="mt-1 text-right text-lg font-semibold">{money.format(totals.total)}</dd>
    </dl>
  );
}
