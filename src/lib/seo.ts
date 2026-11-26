import { DICTS } from "../i18n/I18nProvider";
import { LANGS, pathFor, type Lang, type PageKey } from "../i18n/routes";
import { COMPANY, SITE_URL } from "./site";

export type HeadTag = { tag: "title" | "meta" | "link" | "script"; attrs: Record<string, string>; text?: string };

/** Etiquetas de <head> de una página. Las usan el prerender (HTML estático) y el cliente (al navegar). */
export function buildHead(lang: Lang, page: PageKey | "notFound"): HeadTag[] {
  const d = DICTS[lang];
  const m = d.meta[page];
  const path = page === "notFound" ? `/${lang}/404` : pathFor(page, lang);
  const url = SITE_URL + path;
  const image = `${SITE_URL}/og-image.jpg`;
  const tags: HeadTag[] = [
    { tag: "title", attrs: {}, text: m.title },
    { tag: "meta", attrs: { name: "description", content: m.description } },
    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", attrs: { property: "og:site_name", content: "GREENOVA" } },
    { tag: "meta", attrs: { property: "og:title", content: m.title } },
    { tag: "meta", attrs: { property: "og:description", content: m.description } },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    { tag: "meta", attrs: { property: "og:locale", content: d.meta.locale } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
  ];
  if (page === "notFound") {
    tags.push({ tag: "meta", attrs: { name: "robots", content: "noindex" } });
    return tags;
  }
  tags.push({ tag: "link", attrs: { rel: "canonical", href: url } });
  for (const l of LANGS) tags.push({ tag: "link", attrs: { rel: "alternate", hreflang: l, href: SITE_URL + pathFor(page, l) } });
  tags.push({ tag: "link", attrs: { rel: "alternate", hreflang: "x-default", href: SITE_URL + pathFor(page, "es") } });

  const ld: Record<string, unknown>[] = [];
  if (page === "home") {
    ld.push(
      {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "GREENOVA",
          slogan: d.common.lema,
          url: SITE_URL + pathFor("home", lang),
          logo: `${SITE_URL}/logo.svg`,
          telephone: COMPANY.phone.tel,
          sameAs: [COMPANY.instagram.url],
      },
      { "@context": "https://schema.org", "@type": "WebSite", name: "GREENOVA", url: SITE_URL + pathFor("home", lang), inLanguage: lang },
    );
  } else {
    ld.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: d.nav.home, item: SITE_URL + pathFor("home", lang) },
            { "@type": "ListItem", position: 2, name: m.title.split(" | ")[0], item: url },
          ],
    });
  }
  if (page === "contact") {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  for (const item of ld) tags.push({ tag: "script", attrs: { type: "application/ld+json" }, text: JSON.stringify(item) });
  return tags;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Serializa las etiquetas para el HTML estático. */
export function headToString(tags: HeadTag[]) {
  return tags
    .map(({ tag, attrs, text }) => {
      const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
      if (tag === "meta" || tag === "link") return `<${tag}${a} data-head>`;
      const body = tag === "script" ? (text ?? "").replace(/</g, "\u003c") : esc(text ?? "");
      return `<${tag}${a} data-head>${body}</${tag}>`;
    })
    .join("\n    ");
}
