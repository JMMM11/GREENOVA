import { createContext, useContext, type ReactNode } from "react";
import es from "./es.json";
import en from "./en.json";
import type { Lang } from "./routes";

export type Dict = typeof es;
export const DICTS: Record<Lang, Dict> = { es, en };

const I18nContext = createContext<{ lang: Lang; d: Dict }>({ lang: "es", d: es });

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, d: DICTS[lang] }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

/** Sustituye {clave} en una cadena. */
export function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
