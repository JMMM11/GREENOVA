import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, CircleNotch, Copy } from "@phosphor-icons/react/ssr";
import { fill, useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { SKU } from "../../data/catalog";
import { money, useCart } from "../../lib/cart";
import { addDays, parseISO, toISO } from "../../lib/dates";
import { buttonClass } from "../ui/Action";
import { Field, inputClass } from "../../sections/contact/Field";
import { Totals } from "./CartDrawer";
import { skuName } from "./skuName";

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Status = "idle" | "sending" | "success" | "error" | "notConfigured";

/** Segundo paso del pedido. Envía al mismo servicio que el formulario de contacto; nunca simula el envío. */
export function Checkout({ onBack }: { onBack: () => void }) {
  const { lang, d } = useI18n();
  const cart = useCart();
  const t = d.cart;
  const f = d.form;
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-PA" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  const earliest = useMemo(() => {
    const n = new Date();
    return addDays(new Date(n.getFullYear(), n.getMonth(), n.getDate()), cart.totals.readyDays);
  }, [cart.totals.readyDays]);

  const [v, setV] = useState({ name: "", email: "", phone: "", date: toISO(earliest), method: "retiro", notes: "", privacy: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const summary = [
    `${t.summary} · ${v.name}`,
    ...cart.lines.map((l) => `${l.qty} × ${skuName(SKU[l.id], d)} (${money.format(SKU[l.id].price)})`),
    `${t.total}: ${money.format(cart.totals.total)}${cart.totals.discount ? ` (${t.discount})` : ""}`,
    `${t.date}: ${v.date ? fmt.format(parseISO(v.date)) : "-"} · ${t.methods[v.method as "retiro" | "entrega"]}`,
    [v.email, v.phone].filter(Boolean).join(" · "),
    v.notes,
  ].filter(Boolean).join("\n");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (v.name.trim().length < 2) errs.name = f.errors.name;
    if (!EMAIL.test(v.email.trim()) && v.phone.replace(/\D/g, "").length < 7) errs.contact = t.errors.contact;
    if (!v.date || parseISO(v.date) < earliest) errs.date = fill(t.errors.date, { date: fmt.format(earliest) });
    if (!v.privacy) errs.privacy = f.errors.privacy;
    setErrors(errs);
    if (Object.keys(errs).length) return requestAnimationFrame(() => form.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
    if (!ENDPOINT) return setStatus("notConfigured");
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ type: "pedido", lang, name: v.name, email: v.email, phone: v.phone, date: v.date, method: v.method, notes: v.notes, items: cart.lines, totals: cart.totals, message: summary }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      cart.clear();
    } catch {
      setStatus("error");
    }
  }

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  if (status === "success") return <p role="status" className="mx-5 mt-4 rounded-[var(--radius-media-sm)] bg-sprout p-5 text-lg">{t.success}</p>;

  return (
    <form ref={form} onSubmit={submit} noValidate className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-6">
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 self-start font-medium text-earth">
        <ArrowLeft size={16} aria-hidden /> {t.back}
      </button>
      <div className="rounded-[var(--radius-media-sm)] bg-sand p-4"><Totals /></div>
      <Field id="co-name" label={f.name} error={errors.name}>
        {(a) => <input {...a} autoComplete="name" value={v.name} onChange={set("name")} className={inputClass} />}
      </Field>
      <Field id="co-email" label={f.email} hint={t.contactHint} error={errors.contact}>
        {(a) => <input {...a} type="email" inputMode="email" autoComplete="email" value={v.email} onChange={set("email")} className={inputClass} />}
      </Field>
      <Field id="co-phone" label={f.phone}>
        {(a) => <input {...a} type="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} className={inputClass} />}
      </Field>
      <Field id="co-date" label={t.date} hint={fill(t.dateHint, { date: fmt.format(earliest) })} error={errors.date}>
        {(a) => <input {...a} type="date" min={toISO(earliest)} value={v.date} onChange={set("date")} className={`${inputClass} [color-scheme:light]`} />}
      </Field>
      <fieldset>
        <legend className="text-[15px] font-medium">{t.method}</legend>
        {(["retiro", "entrega"] as const).map((k) => (
          <label key={k} className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 text-base">
            <input type="radio" name="method" value={k} checked={v.method === k} onChange={set("method")} className="size-5 accent-earth" />
            {t.methods[k]}
          </label>
        ))}
        {v.method === "entrega" && <p className="mt-1 text-[14px] text-ink-soft">{t.deliveryNote}</p>}
      </fieldset>
      <Field id="co-notes" label={t.notes}>
        {(a) => <textarea {...a} rows={3} value={v.notes} onChange={set("notes")} className={`${inputClass} py-3`} />}
      </Field>
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-base">
          <input type="checkbox" checked={v.privacy} onChange={set("privacy")} aria-invalid={errors.privacy ? true : undefined} aria-describedby={errors.privacy ? "co-privacy-err" : undefined} className="mt-1 size-5 shrink-0 accent-earth" />
          <span>{f.privacy} <Link to={pathFor("privacy", lang)} onClick={() => cart.setOpen(false)} className="text-earth underline underline-offset-4">{f.privacyLink}</Link>.</span>
        </label>
        {errors.privacy && <p id="co-privacy-err" className="mt-1 text-[15px] text-error">{errors.privacy}</p>}
      </div>
      <p className="text-[14px] text-ink-soft">{t.noCharge}</p>
      <button type="submit" disabled={status === "sending"} className={`${buttonClass} w-full disabled:cursor-not-allowed disabled:opacity-70`}>
        {status === "sending" && <CircleNotch size={18} className="animate-spin" aria-hidden />}
        {status === "sending" ? t.sending : t.submit}
      </button>
      <div role="status" aria-live="polite">
        {status === "error" && <p className="rounded-[var(--radius-media-sm)] bg-error/10 p-4 text-error">{f.networkError}</p>}
        {status === "notConfigured" && (
          <div className="rounded-[var(--radius-media-sm)] bg-clay p-4">
            <p>{t.notConfigured}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(summary).then(() => setCopied(true), () => setCopied(false))}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] px-4 font-medium ring-1 ring-inset ring-ink/25 hover:bg-ink/5"
            >
              <Copy size={16} aria-hidden /> {copied ? t.copied : t.copy}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
