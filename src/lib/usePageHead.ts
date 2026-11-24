import { useEffect } from "react";
import { buildHead } from "./seo";
import type { Lang, PageKey } from "../i18n/routes";

/** Sincroniza <head> al navegar en el cliente. En la primera carga el HTML prerenderizado ya trae lo mismo. */
export function usePageHead(lang: Lang, page: PageKey | "notFound") {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.head.querySelectorAll("[data-head]").forEach((el) => el.remove());
    for (const { tag, attrs, text } of buildHead(lang, page)) {
      const el = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      el.setAttribute("data-head", "");
      if (text) el.textContent = text;
      document.head.appendChild(el);
    }
  }, [lang, page]);
}
