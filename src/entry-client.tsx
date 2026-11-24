import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App, PAGE_LOADERS } from "./App";
import { matchPath } from "./i18n/routes";
import "./styles/index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (root.hasChildNodes()) {
  // Página prerenderizada: precarga el código de la ruta y conserva el HTML mientras hidrata.
  const page = matchPath(location.pathname)?.page ?? "notFound";
  PAGE_LOADERS[page]().finally(() => hydrateRoot(root, app));
} else {
  createRoot(root).render(app);
}
