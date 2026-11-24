import { useI18n } from "../i18n/I18nProvider";
import { pathFor } from "../i18n/routes";
import { ActionLink } from "../components/ui/Action";
import { Img } from "../components/ui/Img";

export default function NotFound() {
  const { lang, d } = useI18n();
  return (
    <section className="bg-ivory pt-[136px] pb-24 lg:pt-[184px]">
      <div className="container-page grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="text-display">{d.notFound.title}</h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed">{d.notFound.text}</p>
          <ActionLink to={pathFor("home", lang)} arrow className="mt-8">{d.notFound.link}</ActionLink>
        </div>
        <Img name="brotes-celda-2" alt="" sizes="40vw" className="aspect-[4/3] w-full object-cover lg:col-span-5 lg:col-start-8" />
      </div>
    </section>
  );
}
