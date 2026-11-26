import { useI18n } from "../i18n/I18nProvider";
import { RevealText } from "../components/motion/RevealText";

/** Fecha de la última revisión de los textos legales. */
const UPDATED = new Date(2026, 10, 24);

function LegalPage({ k }: { k: "privacy" | "terms" | "cookies" }) {
  const { lang, d } = useI18n();
  const page = d.legal[k];
  const date = new Intl.DateTimeFormat(lang === "es" ? "es-PA" : "en-US", { dateStyle: "long" }).format(UPDATED);
  return (
    <article className="bg-ivory pt-[136px] pb-24 lg:pt-[184px] lg:pb-32">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <h1 className="text-h2">{page.title}</h1>
          <p className="mt-4 text-[15px] text-ink-soft">
            {d.legal.updated}: <time dateTime="2026-11-24">{date}</time>
          </p>
        </header>
        <div className="flex max-w-[68ch] flex-col gap-10 lg:col-span-7 lg:col-start-6">
          {page.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-h3">{s.h}</h2>
              {s.p.map((p, i) => (
                <RevealText key={i} className="mt-3 text-lg leading-relaxed">{p}</RevealText>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

export const Privacy = () => <LegalPage k="privacy" />;
export const Terms = () => <LegalPage k="terms" />;
export const Cookies = () => <LegalPage k="cookies" />;
