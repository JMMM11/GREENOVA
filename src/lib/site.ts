/** Datos de la empresa visibles en el sitio. Solo datos reales de información.md;
 *  lo que falta queda en null y se muestra como pendiente. */
export const SITE_URL = (import.meta.env.SITE_URL ?? "https://greenova.vercel.app").replace(/\/$/, "");

export const COMPANY = {
  name: "GREENOVA",
  instagram: { handle: "@greenova.4", url: "https://www.instagram.com/greenova.4/" },
  email: null as string | null, // pendiente
  phone: null as string | null, // pendiente
  whatsapp: null as string | null, // pendiente: número en formato internacional, p. ej. 5076xxxxxxx
  mapUrl: "https://www.openstreetmap.org/search?query=Escuela%20Secundaria%20Pedro%20Pablo%20S%C3%A1nchez%20La%20Chorrera",
};
