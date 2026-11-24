import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router";
import { App } from "./App";

export { buildHead, headToString } from "./lib/seo";
export { LANGS, PAGES, pathFor } from "./i18n/routes";

/** HTML completo de una ruta, esperando a que carguen las páginas diferidas. */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const chunks: Buffer[] = [];
  for await (const c of prelude) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks).toString("utf8");
}
