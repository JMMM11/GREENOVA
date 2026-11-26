import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CircleNotch, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { COMPANY } from "../../lib/site";
import { fill, useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { SPECIES, type SpeciesKey } from "../../data/species";
import { parseISO } from "../../lib/dates";
import { buttonClass } from "../../components/ui/Action";
import { Field, inputClass } from "./Field";
import { validate, type FormErrors, type FormValues } from "./validate";

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;
const EMPTY: FormValues = { name: "", email: "", phone: "", company: "", type: "", message: "", privacy: false };
type Status = "idle" | "sending" | "success" | "error" | "notConfigured";

/** Formulario de contacto. Sin backend propio: envía a VITE_FORM_ENDPOINT o avisa de que falta configurarlo. Nunca simula un envío. */
export function ContactForm() {
  const { lang, d } = useI18n();
  const f = d.form;
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [params] = useSearchParams();
  const form = useRef<HTMLFormElement>(null);

  // Rellena desde el planificador (?especie=&fecha=) o desde Soluciones (?tipo=).
  useEffect(() => {
    const sp = params.get("especie") as SpeciesKey | null;
    const date = params.get("fecha");
    const type = params.get("tipo");
    const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-PA" : "en-US", { day: "numeric", month: "long" });
    setV((prev) => ({
      ...prev,
      type: type && type in f.types ? type : sp ? "pedido" : prev.type,
      message:
        sp && SPECIES.includes(sp) && date && /^\d{4}-\d{2}-\d{2}$/.test(date)
          ? fill(f.prefill, { species: d.species[sp].name.toLowerCase(), date: fmt.format(parseISO(date)) })
          : prev.message,
    }));
  }, [params, lang, f, d.species]);

  const set = (k: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setV((p) => ({ ...p, [k]: value }));
    if (errors[k as keyof FormErrors]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("website")) return; // trampa para bots
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    if (!ENDPOINT) return setStatus("notConfigured");
    setStatus("sending");
    try {
      const { privacy: _accepted, ...payload } = v;
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setV(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const err = (k: keyof FormErrors) => (errors[k] ? f.errors[k] : undefined);
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="flex flex-col gap-6" aria-labelledby="form-h">
      <h2 id="form-h" className="text-h3">{f.title}</h2>
      {hasErrors && <p role="alert" className="bg-error/10 px-4 py-3 text-[15px] text-error">{f.errors.summary}</p>}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="cf-name" label={f.name} error={err("name")}>
          {(a) => <input {...a} name="name" autoComplete="name" value={v.name} onChange={set("name")} className={inputClass} required />}
        </Field>
        <Field id="cf-email" label={f.email} error={err("email")}>
          {(a) => <input {...a} type="email" name="email" autoComplete="email" inputMode="email" value={v.email} onChange={set("email")} className={inputClass} />}
        </Field>
        <Field id="cf-phone" label={f.phone}>
          {(a) => <input {...a} type="tel" name="phone" autoComplete="tel" value={v.phone} onChange={set("phone")} className={inputClass} />}
        </Field>
        <Field id="cf-company" label={f.company}>
          {(a) => <input {...a} name="company" autoComplete="organization" value={v.company} onChange={set("company")} className={inputClass} />}
        </Field>
      </div>
      <Field id="cf-type" label={f.type} error={err("type")}>
        {(a) => (
          <select {...a} name="type" value={v.type} onChange={set("type")} className={inputClass} required>
            <option value="" disabled>{f.typePlaceholder}</option>
            {Object.entries(f.types).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        )}
      </Field>
      <Field id="cf-message" label={f.message} hint={f.messageHint} error={err("message")}>
        {(a) => <textarea {...a} name="message" rows={6} value={v.message} onChange={set("message")} className={`${inputClass} py-3`} required />}
      </Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-base">
          <input
            type="checkbox"
            name="privacy"
            checked={v.privacy}
            onChange={set("privacy")}
            aria-invalid={errors.privacy ? true : undefined}
            aria-describedby={errors.privacy ? "cf-privacy-err" : undefined}
            className="mt-1 size-5 shrink-0 accent-earth"
          />
          <span>
            {f.privacy} <Link to={pathFor("privacy", lang)} className="text-earth underline underline-offset-4">{f.privacyLink}</Link>.
          </span>
        </label>
        {errors.privacy && <p id="cf-privacy-err" className="mt-1 text-[15px] text-error">{f.errors.privacy}</p>}
      </div>
      <button type="submit" disabled={status === "sending"} className={`${buttonClass} w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:self-start`}>
        {status === "sending" && <CircleNotch size={18} className="animate-spin" aria-hidden />}
        {status === "sending" ? f.sending : f.submit}
      </button>
      <div role="status" aria-live="polite" className="text-base">
        {status === "success" && <p className="bg-sprout px-4 py-3 text-ink">{f.success}</p>}
        {status === "error" && <p className="bg-error/10 px-4 py-3 text-error">{f.networkError}</p>}
        {status === "notConfigured" && (
          <div className="bg-clay px-4 py-3 text-ink">
            <p>{f.notConfigured}</p>
            <a href={`${COMPANY.phone.whatsapp}?text=${encodeURIComponent(`${v.name}: ${v.message}`)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] bg-[#1f7a3a] px-4 font-medium text-ivory transition-colors hover:bg-[#17612e]">
              <WhatsappLogo size={18} aria-hidden /> {f.whatsapp}
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
