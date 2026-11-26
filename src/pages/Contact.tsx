import { InstagramLogo, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { useI18n } from "../i18n/I18nProvider";
import { COMPANY } from "../lib/site";
import { PageIntro } from "../sections/shared/PageIntro";
import { PhotoStrip } from "../sections/shared/PhotoStrip";
import { ContactForm } from "../sections/contact/ContactForm";
import { Faq } from "../sections/contact/Faq";
import { Img } from "../components/ui/Img";
import { RevealText } from "../components/motion/RevealText";

export default function Contact() {
  const { d } = useI18n();
  const c = d.contact;
  const link = "inline-flex min-h-11 items-center gap-2 font-medium text-earth underline decoration-earth/40 underline-offset-4 hover:decoration-earth";
  const rows = [
    { label: c.direct.phone, href: `tel:${COMPANY.phone.tel}`, Icon: Phone, external: false },
    { label: c.direct.whatsapp, href: COMPANY.phone.whatsapp, Icon: WhatsappLogo, external: true },
    { label: c.direct.instagram, href: COMPANY.instagram.url, Icon: InstagramLogo, external: true },
  ];
  return (
    <>
      <PageIntro title={c.title} intro={c.intro} />
      <section className="bg-ivory pb-24 lg:pb-32">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <div className="bg-sand p-5 sm:p-8 lg:col-span-7 lg:p-10">
            <ContactForm />
          </div>
          <aside className="flex flex-col gap-16 lg:col-span-4 lg:col-start-9">
            <div>
              <h2 className="text-h3">{c.direct.title}</h2>
              <dl className="mt-4 flex flex-col gap-4 text-base">
                {rows.map(({ label, href, Icon, external }) => (
                  <div key={label}>
                    <dt className="text-[14px] text-ink-soft">{label}</dt>
                    <dd>
                      <a href={href} className={link} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        <Icon size={18} aria-hidden /> {Icon === InstagramLogo ? COMPANY.instagram.handle : COMPANY.phone.label}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <Img name="equipo-1" alt={d.about.team.photoAlt} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/3] w-full object-cover" />
            <div>
              <h2 className="text-h3">{c.where.title}</h2>
              <RevealText as="div" className="mt-4 text-lg leading-relaxed">
                <p className="font-medium">{c.where.school}</p>
                <p>{c.where.city}</p>
                <p className="mt-3 text-base text-ink-soft">{c.where.hours}</p>
              </RevealText>
              <a href={COMPANY.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-ui)] px-4 font-medium text-ink ring-1 ring-inset ring-ink/25 transition-colors hover:bg-ink/5">
                <MapPin size={18} aria-hidden /> {c.where.map}
              </a>
            </div>
          </aside>
        </div>
      </section>
      <Faq />
      <PhotoStrip imgs={["aclimatacion-2", "equipo-huerto", "led-maiz-1"]} alts={[d.process.stages[4].alt, d.about.heroAlt, d.process.stages[2].alt]} />
    </>
  );
}
