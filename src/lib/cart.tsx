import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { SKU, priceCart, type CartLine } from "../data/catalog";

type Action = { type: "add"; id: string; qty?: number } | { type: "set"; id: string; qty: number } | { type: "clear" } | { type: "load"; lines: CartLine[] };

function reducer(lines: CartLine[], a: Action): CartLine[] {
  switch (a.type) {
    case "load":
      return a.lines.filter((l) => SKU[l.id] && Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 999);
    case "clear":
      return [];
    case "add": {
      const qty = a.qty ?? 1;
      const found = lines.find((l) => l.id === a.id);
      return found ? lines.map((l) => (l.id === a.id ? { ...l, qty: Math.min(999, l.qty + qty) } : l)) : [...lines, { id: a.id, qty }];
    }
    case "set":
      return a.qty <= 0 ? lines.filter((l) => l.id !== a.id) : lines.map((l) => (l.id === a.id ? { ...l, qty: Math.min(999, a.qty) } : l));
  }
}

const KEY = "greenova-cart";

type CartValue = {
  lines: CartLine[];
  totals: ReturnType<typeof priceCart>;
  count: number;
  add: (id: string, qty?: number) => void;
  set: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartValue | null>(null);

/** Carrito sin cuentas: vive en el navegador (localStorage, almacenamiento técnico, sin rastreo). */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) dispatch({ type: "load", lines: saved });
    } catch {
      /* almacenamiento corrupto o bloqueado: se empieza vacío */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* modo privado sin almacenamiento: el carrito vive solo en esta pestaña */
    }
  }, [lines, loaded]);

  const value = useMemo<CartValue>(() => {
    const totals = priceCart(lines);
    return {
      lines,
      totals,
      count: lines.reduce((s, l) => s + l.qty, 0),
      add: (id, qty) => dispatch({ type: "add", id, qty }),
      set: (id, qty) => dispatch({ type: "set", id, qty }),
      clear: () => dispatch({ type: "clear" }),
      open,
      setOpen,
    };
  }, [lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}

export const money = new Intl.NumberFormat("es-PA", { style: "currency", currency: "PAB" });
