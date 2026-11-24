import { m } from "motion/react";
import { useI18n } from "../../i18n/I18nProvider";
import { Img } from "../../components/ui/Img";
import { RevealList } from "../../components/motion/RevealList";
import { StaggeredFade } from "../../components/motion/StaggeredFade";
import { EASE_EXPO } from "../../components/motion/tokens";

/** El equipo impreso en una tarjeta ligeramente girada, cortada por el borde inferior de la sección. */
export function Team() {
  const { d } = useI18n();
  const t = d.about.team;
  return (
    <section className="bg-olive-deep pt-20 text-ink lg:pt-28" aria-labelledby="team-h">
      <div className="container-page">
        <div className="h-[clamp(640px,100vw,860px)] overflow-hidden sm:h-[760px] lg:h-[820px]">
          <m.div
            data-reveal
            initial={{ opacity: 0, y: 60, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.2 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: EASE_EXPO }}
            className="mx-auto w-[92%] bg-ivory p-7 text-center sm:w-[78%] sm:p-14 lg:w-[56%]"
          >
            <StaggeredFade id="team-h" text={t.title} className="text-[clamp(1.6rem,1.3rem+1vw,2.2rem)]" />
            <Img name="equipo-2" alt={t.photoAlt} sizes="(min-width: 1024px) 50vw, 90vw" className="mt-8 aspect-video w-full object-cover" />
            <p className="mt-9 text-[17px] leading-[1.9] sm:text-[21px]">
              {t.members.map((m, i) => (
                <span key={m}>
                  {m}
                  {i < t.members.length - 1 && <span aria-hidden className="text-olive">&nbsp;·&nbsp; </span>}
                </span>
              ))}
            </p>
            <p className="mt-6 text-base text-ink-soft">
              {t.advisorLabel}: <span className="text-ink">{t.advisor}</span>
            </p>
            <p className="mt-2 text-[15px] text-ink-soft">{t.school}</p>
          </m.div>
        </div>
      </div>
      <div className="bg-ivory">
        <div className="container-page section-y">
          <h3 className="text-h2 font-display">{t.areasTitle}</h3>
          <RevealList
            className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
            items={t.areas.map((a) => (
              <>
                <span aria-hidden className="block h-[3px] w-10 bg-earth" />
                <h4 className="mt-5 font-display text-[26px] leading-tight">{a.name}</h4>
                <p className="mt-3 text-base leading-relaxed">{a.text}</p>
              </>
            ))}
          />
        </div>
      </div>
    </section>
  );
}
