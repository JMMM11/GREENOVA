export type FormValues = { name: string; email: string; phone: string; company: string; type: string; message: string; privacy: boolean };
export type FormErrors = Partial<Record<"name" | "email" | "type" | "message" | "privacy", true>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Reglas del formulario (se validan también en el servicio receptor). */
export function validate(v: FormValues): FormErrors {
  const e: FormErrors = {};
  if (v.name.trim().length < 2) e.name = true;
  // Se necesita un medio de respuesta: teléfono/WhatsApp (7+ dígitos) o, si lo da, un correo válido.
  const email = v.email.trim();
  if (email ? !EMAIL.test(email) : v.phone.replace(/\D/g, "").length < 7) e.email = true;
  if (!v.type) e.type = true;
  if (v.message.trim().length < 20) e.message = true;
  if (!v.privacy) e.privacy = true;
  return e;
}
