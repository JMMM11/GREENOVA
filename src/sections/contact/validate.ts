export type FormValues = { name: string; email: string; phone: string; company: string; type: string; message: string; privacy: boolean };
export type FormErrors = Partial<Record<"name" | "email" | "type" | "message" | "privacy", true>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Reglas del formulario (se validan también en el servicio receptor). */
export function validate(v: FormValues): FormErrors {
  const e: FormErrors = {};
  if (v.name.trim().length < 2) e.name = true;
  if (!EMAIL.test(v.email.trim())) e.email = true;
  if (!v.type) e.type = true;
  if (v.message.trim().length < 20) e.message = true;
  if (!v.privacy) e.privacy = true;
  return e;
}
