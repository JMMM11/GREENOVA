import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { m } from "motion/react";
import { PaperPlaneRight, Sparkle, X } from "@phosphor-icons/react/ssr";
import { fill, useI18n } from "../../i18n/I18nProvider";
import { pathFor } from "../../i18n/routes";
import { EASE_EXPO } from "../motion/tokens";
import { Mascot } from "./Mascot";

export type Msg = { role: "user" | "model"; text: string };
export type Status = "idle" | "sending" | "limit" | "notConfigured" | "error";

type Props = {
  msgs: Msg[];
  status: Status;
  left: number;
  text: string;
  setText: (v: string) => void;
  onSend: (e: React.FormEvent) => void;
  onClose: () => void;
};

/** Ventana del agente: cabecera con Maízter en línea, burbujas y etiqueta «Respondido por IA». */
export function ChatPanel({ msgs, status, left, text, setText, onSend, onClose }: Props) {
  const { lang, d } = useI18n();
  const t = d.chat;
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const blocked = left === 0 || status === "notConfigured";
  const notice = { limit: t.limit, notConfigured: t.notConfigured, error: t.error }[status as "limit" | "notConfigured" | "error"];

  useEffect(() => {
    input.current?.focus();
  }, []);
  // Con llaves: Chrome devuelve una Promise en el scroll suave y React la tomaría como limpieza.
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, status]);

  return (
    <m.div
      id="chat-panel"
      role="dialog"
      aria-labelledby="chat-h"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: EASE_EXPO }}
      style={{ transformOrigin: "100% 100%" }}
      className="fixed right-3 bottom-3 z-50 flex h-[min(600px,calc(100svh-1.5rem))] w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[22px] bg-ivory shadow-[0_20px_60px_rgb(15_17_11/0.3)] sm:right-6 sm:bottom-6"
    >
      <div className="relative flex items-center justify-center px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-[0_4px_16px_rgb(15_17_11/0.1)]">
          <span className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-sprout">
            <Mascot size={26} />
            <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#3fae4a] ring-2 ring-white" aria-hidden />
          </span>
          <span className="leading-tight">
            <span id="chat-h" className="block text-[15px] font-semibold">{t.name}</span>
            <span className="block text-[12px] text-ink-soft">{t.online} · {t.role}</span>
          </span>
        </div>
        <button type="button" onClick={onClose} aria-label={t.close} className="absolute top-3 right-3 grid size-11 place-items-center rounded-full hover:bg-ink/5">
          <X size={20} aria-hidden />
        </button>
      </div>

      <div ref={list} aria-live="polite" className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-3">
        {[{ role: "model" as const, text: t.hello }, ...msgs].map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} className="flex items-end justify-end gap-2">
              <p className="max-w-[80%] rounded-[18px] rounded-br-md bg-white px-4 py-3 text-[15px] leading-relaxed shadow-[0_2px_10px_rgb(15_17_11/0.07)]">{msg.text}</p>
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-clay text-[11px] font-semibold">{t.you}</span>
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2">
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-sprout"><Mascot size={24} /></span>
              <div className="max-w-[80%]">
                <p className="rounded-[18px] rounded-bl-md bg-olive-deep px-4 py-3 text-[15px] leading-relaxed text-ivory">{msg.text}</p>
                {i > 0 && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] text-ink-soft shadow-[0_2px_8px_rgb(15_17_11/0.08)]">
                    <Sparkle size={12} weight="fill" className="text-olive" aria-hidden /> {t.answered}
                  </span>
                )}
              </div>
            </div>
          ),
        )}
        {status === "sending" && (
          <div className="flex items-center gap-2 text-[14px] text-ink-soft">
            <span className="grid size-9 place-items-center rounded-full bg-sprout"><Mascot size={24} className="mascot-bob" /></span>
            {t.thinking}
          </div>
        )}
        {notice && (
          <div className="rounded-[14px] bg-clay px-4 py-3 text-[15px]">
            <p>{notice}</p>
            {status !== "error" && (
              <Link to={pathFor("contact", lang)} onClick={onClose} className="mt-2 inline-flex min-h-11 items-center font-medium text-earth underline underline-offset-4">
                {t.contact}
              </Link>
            )}
          </div>
        )}
      </div>

      <form onSubmit={onSend} className="px-4 pt-2 pb-4">
        <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-[0_4px_16px_rgb(15_17_11/0.08)]">
          <label htmlFor="chat-input" className="sr-only">{t.placeholder}</label>
          <input
            ref={input}
            id="chat-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            disabled={blocked}
            placeholder={t.placeholder}
            autoComplete="off"
            className="min-h-10 flex-1 bg-transparent text-base focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!text.trim() || status === "sending" || blocked}
            aria-label={t.send}
            className="grid size-10 place-items-center rounded-full bg-earth text-ivory transition-colors hover:bg-earth-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PaperPlaneRight size={18} aria-hidden />
          </button>
        </div>
        <p className="mt-2 px-2 text-[12px] text-ink-soft">
          {left === 1 ? t.remainingOne : fill(t.remaining, { n: left })} · {t.disclaimer}
        </p>
      </form>
    </m.div>
  );
}
