/** Datos de la empresa visibles en el sitio. Solo datos reales confirmados por GREENOVA. */
export const SITE_URL = (import.meta.env.SITE_URL ?? "https://greenova.vercel.app").replace(/\/$/, "");

export const COMPANY = {
  name: "GREENOVA",
  instagram: { handle: "@greenova.4", url: "https://www.instagram.com/greenova.4/" },
  // Sin correo público: el contacto es por teléfono y WhatsApp.
  phone: { label: "+507 6417-7723", tel: "+50764177723", whatsapp: "https://wa.me/50764177723" },
  mapUrl: "https://www.openstreetmap.org/search?query=Escuela%20Secundaria%20Pedro%20Pablo%20S%C3%A1nchez%20La%20Chorrera",
};
