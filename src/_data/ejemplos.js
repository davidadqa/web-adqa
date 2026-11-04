// Ejemplos de aplicación: las tarjetas breves sin nombre de cliente (macro anonCase) de cada página de servicio.
// Se calculan leyendo las plantillas de servicio, para que el índice de /casos-de-exito/#ejemplos nunca se desajuste.
// Las páginas de servicio no se tocan: si alguien cambia la forma de llamar a anonCase, aquí baja el recuento.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nav from "./nav.js";
const casos = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "casos.json"), "utf8"));

// Ejemplos que son el mismo proyecto que un caso de éxito con página propia: en el hub enlazan al caso completo
// (si no, el mismo proyecto saldría dos veces con títulos distintos). Título exacto del anonCase → id de casos.json.
const CASO = {
  "Detección y respuesta gestionada para una cadena hotelera internacional": "deteccion-hotel",
  "Pentest de web y APIs para una cadena hotelera": "pentest-hotel",
  "Servidores renovados a la medida de la carga real": "servidores",
  "Gestión de expedientes para una entidad de apoyo a emprendedores": "expedientes",
  "Business Plus solo para quien lo necesita": "licenciamiento",
};
const urlDe = (t) => { const c = CASO[t] && casos.find((x) => x.id === CASO[t]); return c ? c.url : ""; };

const src = join(dirname(fileURLToPath(import.meta.url)), "..");
const CALL = /m\.anonCase\(\s*"((?:[^"\\]|\\.)*)"/g;
const SECTION = /<section\b[^>]*\bid="([^"]+)"/g;

const grupos = [];
let total = 0;
let servicios = 0;
let conCaso = 0;
for (const g of nav.groups) {
  const items = [];
  for (const l of g.links) {
    if (l.external) continue;
    const file = join(src, l.url, "index.njk");
    if (!existsSync(file)) continue;
    const txt = readFileSync(file, "utf8");
    const titles = [...txt.matchAll(CALL)].map((m) => { const t = m[1].replace(/\\(.)/g, "$1"); return { t, url: urlDe(t) }; });
    if (!titles.length) continue;
    // El ancla: la última sección con id antes del primer ejemplo.
    const first = txt.search(/m\.anonCase\(/);
    const ids = [...txt.slice(0, first).matchAll(SECTION)];
    const anchor = ids.length ? "#" + ids[ids.length - 1][1] : "";
    items.push({ label: l.label, url: l.url, anchor, titles });
    total += titles.length;
    conCaso += titles.filter((x) => x.url).length;
    servicios++;
  }
  if (items.length) grupos.push({ title: g.title, icon: g.icon, items });
}

for (const t of Object.keys(CASO)) if (!grupos.some((g) => g.items.some((s) => s.titles.some((x) => x.t === t && x.url))))
  throw new Error(`ejemplos.js: el ejemplo «${t}» ya no está en ninguna página de servicio o su caso no existe`);

export default { total, servicios, conCaso, grupos };
