import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, m } from "motion/react";
import { X } from "@phosphor-icons/react/ssr";
import { useI18n } from "../../i18n/I18nProvider";
import { matchPath } from "../../i18n/routes";
import { EASE_EXPO } from "../motion/tokens";
import { Mascot } from "./Mascot";
import { ChatPanel, type Msg, type Status } from "./ChatPanel";

const LIMIT = 2; // igual que en api/chat.ts
const KEY = "greenova-chat";
const TIPS_OFF = "greenova-tips-off";
const DAY = 24 * 60 * 60 * 1000;

/** Preguntas que le quedan a este navegador hoy. El servidor aplica además su propio límite por IP. */
function readLeft() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return s && s.resetAt > Date.now() ? Math.max(0, LIMIT - s.count) : LIMIT;
  } catch {
    return LIMIT;
  }
}
function saveLeft(left: number) {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const resetAt = s && s.resetAt > Date.now() ? s.resetAt : Date.now() + DAY;
    localStorage.setItem(KEY, JSON.stringify({ count: LIMIT - left, resetAt }));
  } catch {
    /* sin almacenamiento: el límite del servidor sigue aplicando */
  }
}

/** Maízter: mascota que se mueve en la esquina, suelta mensajitos según la página y abre el chat con IA. */
export function ChatWidget() {
  const { d } = useI18n();
  const t = d.chat;
  const { pathname } = useLocation();
  const page = matchPath(pathname)?.page ?? "default";
  const tips = t.tips[page as keyof typeof t.tips] ?? t.tips.default;

  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [left, setLeft] = useState(LIMIT);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const l = readLeft();
    setLeft(l);
    if (l === 0) setStatus("limit");
  }, []);

  // Mensajitos: el primero a los 4 s, cada uno visible 7 s, uno cada 22 s, como mucho 3 por página.
  useEffect(() => {
    setTip(null);
    if (open || sessionStorage.getItem(TIPS_OFF)) return;
    const timers: number[] = [];
    tips.concat(tips[0]).slice(0, 3).forEach((msg, i) => {
      timers.push(window.setTimeout(() => setTip(msg), 4000 + i * 22000));
      timers.push(window.setTimeout(() => setTip(null), 11000 + i * 22000));
    });
    return () => timers.forEach(clearTimeout);
  }, [page, open, tips]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const dismissTip = () => {
    setTip(null);
    sessionStorage.setItem(TIPS_OFF, "1");
  };

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = text.trim();
    if (!q || status === "sending" || left === 0) return;
    const history = msgs.slice(-2);
    setMsgs((p) => [...p, { role: "user", text: q }]);
    setText("");
    setStatus("sending");
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q, history }) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) return setStatus("notConfigured");
      if (res.status === 429) {
        setLeft(0);
        saveLeft(0);
        return setStatus("limit");
      }
      if (!res.ok || !data.reply) return setStatus("error");
      const remaining = Math.min(left - 1, typeof data.remaining === "number" ? data.remaining : left - 1);
      setMsgs((p) => [...p, { role: "model", text: data.reply }]);
      setLeft(remaining);
      saveLeft(remaining);
      setStatus(remaining === 0 ? "limit" : "idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <m.div
            key="launcher"
            className="fixed right-3 bottom-3 z-40 flex items-end gap-2 sm:right-6 sm:bottom-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.8 }}
          >
            <AnimatePresence>
              {tip && (
                <m.div
                  key={tip}
                  role="status"
                  initial={{ opacity: 0, x: 12, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: EASE_EXPO }}
                  style={{ transformOrigin: "100% 100%" }}
                  className="relative mb-10 flex max-w-[230px] items-start gap-1 rounded-[16px] rounded-br-sm bg-white py-2.5 pr-1 pl-3.5 text-[14px] leading-snug shadow-[0_8px_24px_rgb(15_17_11/0.16)]"
                >
                  <button type="button" onClick={() => setOpen(true)} className="text-left">{tip}</button>
                  <button type="button" onClick={dismissTip} aria-label={t.dismiss} className="grid size-7 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-ink/5">
                    <X size={12} aria-hidden />
                  </button>
                </m.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.open}
              aria-expanded={open}
              aria-controls="chat-panel"
              className="group relative grid size-[76px] place-items-center rounded-full bg-sprout shadow-[0_10px_28px_rgb(15_17_11/0.22)] transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Mascot size={52} className="mascot-bob -mt-2" />
              <span aria-hidden className="absolute top-1.5 right-1.5 size-3.5 rounded-full bg-[#3fae4a] ring-2 ring-white" />
            </button>
          </m.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && <ChatPanel msgs={msgs} status={status} left={left} text={text} setText={setText} onSend={send} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
