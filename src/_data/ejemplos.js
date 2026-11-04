// Ejemplos de aplicación: las tarjetas breves sin nombre de cliente (macro anonCase) de cada página de servicio.
// Se calculan leyendo las plantillas de servicio, para que el índice de /casos-de-exito/#ejemplos nunca se desajuste.
// Las páginas de servicio no se tocan: si alguien cambia la forma de llamar a anonCase, aquí baja el recuento.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nav from "./nav.js";

const src = join(dirname(fileURLToPath(import.meta.url)), "..");
const CALL = /m\.anonCase\(\s*"((?:[^"\\]|\\.)*)"/g;
const SECTION = /<section\b[^>]*\bid="([^"]+)"/g;

const grupos = [];
let total = 0;
let servicios = 0;
for (const g of nav.groups) {
  const items = [];
  for (const l of g.links) {
    if (l.external) continue;
    const file = join(src, l.url, "index.njk");
    if (!existsSync(file)) continue;
    const txt = readFileSync(file, "utf8");
    const titles = [...txt.matchAll(CALL)].map((m) => m[1].replace(/\\(.)/g, "$1"));
    if (!titles.length) continue;
    // El ancla: la última sección con id antes del primer ejemplo.
    const first = txt.search(/m\.anonCase\(/);
    const ids = [...txt.slice(0, first).matchAll(SECTION)];
    const anchor = ids.length ? "#" + ids[ids.length - 1][1] : "";
    items.push({ label: l.label, url: l.url, anchor, titles });
    total += titles.length;
    servicios++;
  }
  if (items.length) grupos.push({ title: g.title, icon: g.icon, items });
}

export default { total, servicios, grupos };
