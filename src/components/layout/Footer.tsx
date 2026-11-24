import { Link } from "react-router";
import { InstagramLogo, MapPin } from "@phosphor-icons/react/ssr";
import { useI18n } from "../../i18n/I18nProvider";
import { pathFor, type PageKey } from "../../i18n/routes";
import { COMPANY } from "../../lib/site";
import { Img } from "../ui/Img";
import { Logo } from "../ui/Logo";
import { FOOTER_ITEMS } from "./navItems";

const LEGAL: PageKey[] = ["privacy", "terms", "cookies"];

/** Cierre del sitio: el reverso de la etiqueta, como una tarjeta con borde festoneado sobre el verde corporativo. */
export function Footer() {
  const { lang, d } = useI18n();
  const services = d.solutions.services.items;
  const linkCls = "inline-flex min-h-11 items-center text-[15px] text-ink-soft transition-colors hover:text-ink sm:min-h-9";

  return (
    <footer className="bg-olive-deep pt-16 sm:pt-24">
      <div className="container-page">
        <div className="relative bg-ivory px-5 pt-14 pb-6 sm:px-10 lg:mx-[6%] lg:px-14">
          {/* Festón: borde superior recortado en semicírculos */}
          <div
            aria-hidden
            className="absolute inset-x-0 -top-[14px] h-[15px] bg-ivory"
            style={{
              WebkitMaskImage: "radial-gradient(circle at 50% 100%, #000 14px, transparent 14.5px)",
              maskImage: "radial-gradient(circle at 50% 100%, #000 14px, transparent 14.5px)",
              WebkitMaskSize: "36px 15px",
              maskSize: "36px 15px",
              WebkitMaskRepeat: "repeat-x",
              maskRepeat: "repeat-x",
            }}
          />
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <Logo />
              <p className="mt-8 font-display text-[clamp(1.9rem,1.5rem+1.2vw,2.6rem)] leading-tight">{d.footer.signoff}</p>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink">{d.footer.message}</p>
            </div>
            <div className="flex gap-6 md:col-span-5 md:justify-end">
              <address className="flex flex-col gap-1 not-italic">
                <a href={COMPANY.instagram.url} rel="noopener noreferrer" target="_blank" className={`${linkCls} gap-2 text-ink`}>
                  <InstagramLogo size={18} aria-hidden /> {COMPANY.instagram.handle}
                </a>
                <a href={COMPANY.mapUrl} rel="noopener noreferrer" target="_blank" className={`${linkCls} gap-2 text-ink`}>
                  <MapPin size={18} aria-hidden /> {d.contact.where.city}
                </a>
                <Link to={pathFor("contact", lang)} className={`${linkCls} text-ink underline decoration-earth/40 underline-offset-4`}>
                  {d.nav.contact}
                </Link>
              </address>
              <div className="w-16 shrink-0 rounded-[var(--radius-media-sm)] bg-sand p-1.5 sm:w-[88px]">
                <Img name="led-maiz-2" alt={d.footer.stampAlt} sizes="88px" radius="sm" className="aspect-[3/4] w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 bg-sand/60 px-5 py-8 sm:grid-cols-3 sm:px-8">
            <FooterGroup title={d.footer.navTitle}>
              {FOOTER_ITEMS.map((k) => (
                <Link key={k} to={pathFor(k, lang)} className={linkCls}>{d.nav[k]}</Link>
              ))}
            </FooterGroup>
            <FooterGroup title={d.footer.servicesTitle}>
              {services.map((s) => (
                <Link key={s.id} to={pathFor("solutions", lang, s.id)} className={linkCls}>{s.name}</Link>
              ))}
            </FooterGroup>
            <FooterGroup title={d.footer.legalTitle}>
              {LEGAL.map((k) => (
                <Link key={k} to={pathFor(k, lang)} className={linkCls}>{d.nav[k]}</Link>
              ))}
            </FooterGroup>
          </div>

          <p className="mt-6 text-center text-[13px] text-ink-soft">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> GREENOVA · {d.common.lema} · {d.footer.rights} · {d.common.photoCredit}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-[15px] font-semibold tracking-normal text-ink">{title}</h2>
      <div className="mt-3 flex flex-col">{children}</div>
    </div>
  );
}
