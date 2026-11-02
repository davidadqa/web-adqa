// Revisión rápida (sin navegador) de los artículos del blog: front matter, enlaces internos y reglas de marca.
//
// Uso: node tools/lint-articles.mjs [src/recursos/articulos/<slug>.md ...] [--plan=plan.json]
// Sin ficheros, revisa todos los artículos. --plan añade como destinos válidos los slugs previstos
// (útil mientras se escriben artículos en paralelo). Sale con código 1 si hay errores.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import matter from "gray-matter";
import blog from "../src/_data/blog.js";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const artDir = join(root, "src/recursos/articulos");
const argv = process.argv.slice(2);
const opts = Object.fromEntries(argv.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
let files = argv.filter((a) => !a.startsWith("--")).map((f) => resolve(f));
if (!files.length) files = readdirSync(artDir).filter((f) => f.endsWith(".md")).map((f) => join(artDir, f));

// Destinos internos válidos: páginas .njk con carpeta propia, categorías, artículos existentes y previstos.
const valid = new Set(["/", "/recursos/"]);
(function walk(dir, rel) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_") || e.name === "assets") continue;
    if (e.isDirectory()) walk(join(dir, e.name), rel + e.name + "/");
    else if (e.name === "index.njk") valid.add("/" + rel);
  }
})(join(root, "src"), "");
for (const c of blog.categories) valid.add(c.url);
const slugs = new Set(readdirSync(artDir).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)));
if (opts.plan && existsSync(opts.plan)) for (const p of JSON.parse(readFileSync(opts.plan, "utf8"))) slugs.add(p.slug);
for (const s of slugs) valid.add(`/recursos/${s}/`);

const TAGS = ["Pentesting", "ENS", "Firewall", "Cumplimiento", "Gestión de la seguridad", "WiFi", "Cableado", "Certificación",
  "Switching", "Segmentación", "Monitorización", "Datacenter", "Backup", "Migración", "Conectividad", "Mantenimiento",
  "Soporte", "Diseño web", "Software a medida", "WordPress", "Google Workspace", "Microsoft 365", "Licencias", "Seguridad",
  "Colaboración"];
const BANNED = [
  [/primera empresa del Garraf|primera del Garraf/i, "«primera del Garraf»"],
  [/licencia propia/i, "«licencia propia»"],
  [/partner (oficial )?de Microsoft|Microsoft Partner/i, "Microsoft como partner (D4)"],
  [/soluciones (TIC )?globales|nos hace distintos|partner tecnológico de referencia/i, "cliché de marca"],
  [/el mejor servicio|líderes en|los mejores|el proveedor de referencia/i, "superlativo"],
  [/\bFortinet\b|\bFluke\b|\bCisco\b|\bUbiquiti\b|\bHPE\b/, "marca no autorizada (D9)"],
  [/más de 25 años|más de veinte años|30 años en cada/i, "dato no canónico"],
  [/\d+[.,]?\d*\s?€|€\s?\d/, "precio (D8)"],
  [/Azure AD\b/, "usar «Microsoft Entra ID»"],
  [/Partner Delegated Licensing/i, "término incorrecto"],
  [/preguntas reales que nos hacen|Para la dirección de la empresa/i, "texto heredado del WordPress"],
  [/hemos ayudado a|en las (webs|empresas|instalaciones|oficinas) que hemos|hemos visto (muchas|muchos|cómo|casos)|en nuestra experiencia/i, "prueba social en primera persona"],
  [/nou\.adqa\.com|www\.adqa\.com\/recursos/i, "enlace al WordPress"],
  [/la respuesta ADQAda/i, "«la respuesta ADQAda» no va en el blog"],
  [/\bTI\b/, "glosario: «informática», no «TI»"],
  [/seguridad informática/i, "glosario: «ciberseguridad»"],
];
const WARN = [
  [/\bCPD\b/, "glosario: «datacenter» (CPD solo si es el del cliente)"],
  [/24\s?\/\s?7|24x7/i, "vigilancia 24/7 (D7/D11): revisar"],
  [/(?<!\p{L})SLA(?!\p{L})|en (pocas|menos de \d+) horas/iu, "SLA o tiempos garantizados (D8): revisar"],
  [/\bMikroTik\b/i, "MikroTik: revisar (D9)"],
  [/\bnube\b/gi, null],
];

const words = (t) => String(t || "").trim().split(/\s+/).filter(Boolean).length;
let errors = 0;
for (const f of files) {
  const slug = basename(f, ".md");
  const e = [], w = [];
  let fm, body;
  try {
    ({ data: fm, content: body } = matter(readFileSync(f, "utf8")));
  } catch (err) {
    console.log(`✗ ${slug}\n  - YAML inválido: ${err.message}`);
    errors++;
    continue;
  }
  const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v || ""));
  // Front matter
  if (!fm.title) e.push("falta title");
  else {
    if (fm.title.length > 60) e.push(`title de ${fm.title.length} caracteres (máx. 60)`);
    if (!fm.title.endsWith(" | ADQA")) e.push("title debe acabar en « | ADQA»");
  }
  if (!fm.description) e.push("falta description");
  else if (fm.description.length < 140 || fm.description.length > 160) e.push(`description de ${fm.description.length} caracteres (140–160)`);
  if (!fm.h1) e.push("falta h1");
  if (fm.h1 && /\| ADQA/.test(fm.h1)) e.push("h1 no lleva « | ADQA»");
  if (fm.lead && fm.lead.length > 140) w.push(`lead de ${fm.lead.length} caracteres (recomendado ≤ 140)`);
  if (!fm.keyword) e.push("falta keyword");
  if (!blog.bySlug[fm.category]) e.push(`category «${fm.category}» no existe (${Object.keys(blog.bySlug).join(", ")})`);
  if (!/^\d{4}-\d\d-\d\d$/.test(iso(fm.date))) e.push("date debe ser AAAA-MM-DD (fecha del WordPress)");
  if (!/^\d{4}-\d\d-\d\d$/.test(iso(fm.updated))) e.push("updated debe ser AAAA-MM-DD");
  if (fm.servicio && !valid.has(fm.servicio)) e.push(`servicio «${fm.servicio}» no es una página existente`);
  if (!fm.servicio) w.push("sin servicio: se usará el de la categoría");
  if (!Array.isArray(fm.related) || fm.related.length !== 3) e.push("related: exactamente 3 slugs");
  else for (const r of fm.related) {
    if (r === slug) e.push("related no puede incluir el propio artículo");
    else if (!slugs.has(r)) e.push(`related «${r}» no es un artículo (existente o previsto)`);
  }
  if (!fm.imagen) e.push("falta imagen (descripción de la imagen destacada que hay que pedir)");
  if (!Array.isArray(fm.etiquetas) || fm.etiquetas.length < 1 || fm.etiquetas.length > 3) e.push("etiquetas: entre 1 y 3");
  else for (const t of fm.etiquetas) if (!TAGS.includes(t)) w.push(`etiqueta «${t}» fuera de la lista común`);
  const tw = words(fm.tldr);
  if (!fm.tldr) e.push("falta tldr («En resumen»)");
  else if (tw < 40 || tw > 75) e.push(`tldr de ${tw} palabras (40–70)`);
  const man = fm.faq?.manager?.length || 0, tec = fm.faq?.tecnico?.length || 0;
  if (man < 2 || tec < 2 || man + tec < 6 || man + tec > 8) e.push(`faq: ${man} manager + ${tec} técnico (2–4 + 2–4, total 6–8)`);
  for (const q of [...(fm.faq?.manager || []), ...(fm.faq?.tecnico || [])]) {
    if (!q.q || !q.a) e.push("faq: cada pregunta necesita q y a");
    else if (/<|\]\(/.test(q.a)) e.push(`faq: la respuesta de «${q.q.slice(0, 40)}…» debe ser texto plano`);
  }
  // Cuerpo
  if (/^#\s/m.test(body)) e.push("el cuerpo no lleva H1 (#): el h1 va en el front matter");
  if (/^#{2,3}\s+En resumen/im.test(body)) e.push("«En resumen» va en tldr, no en el cuerpo");
  if (/^#{2,4}\s+Preguntas frecuentes/im.test(body)) e.push("las FAQ van en el front matter, no en el cuerpo");
  const h2 = (body.match(/^##\s/gm) || []).length;
  if (h2 < 3) e.push(`solo ${h2} secciones H2 (mín. 3)`);
  if (/\{\{|\{%/.test(body)) e.push("el cuerpo no puede usar sintaxis de plantilla ({{ o {%)");
  const links = [...body.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
  const internal = links.filter((l) => l.startsWith("/"));
  const seen = {};
  for (const l of internal) {
    const path = l.split("#")[0];
    if (!valid.has(path)) e.push(`enlace interno roto: ${l}`);
    seen[path] = (seen[path] || 0) + 1;
  }
  for (const [p, n] of Object.entries(seen)) if (n > 1) w.push(`${n} enlaces a ${p} (mejor 1 por destino)`);
  if (internal.length < 2) w.push(`solo ${internal.length} enlaces internos en el cuerpo (recomendado 2–6)`);
  if (internal.length > 8) w.push(`${internal.length} enlaces internos en el cuerpo (recomendado 2–6)`);
  for (const l of links.filter((l) => /^https?:/.test(l))) w.push(`enlace externo: ${l}`);
  // Reglas de marca sobre todo el texto
  const all = JSON.stringify(fm) + "\n" + body;
  for (const [re, why] of BANNED) if (re.test(all)) e.push(`prohibido: ${why} (${all.match(re)[0]})`);
  for (const [re, why] of WARN) if (why && re.test(all)) w.push(why);
  const unico = (all.match(/(?<!\p{L})únic[oa]s?(?!\p{L})/giu) || []).length;
  if (unico > 1) e.push(`«único/a» ${unico} veces (máx. 1)`);
  const total = words(body.replace(/[#*|>_-]/g, " "));
  if (total < 350) w.push(`cuerpo corto: ${total} palabras`);

  errors += e.length;
  console.log(`${e.length ? "✗" : "✓"} ${slug}  (${total} palabras, ${h2} H2, ${internal.length} enlaces)`);
  for (const x of e) console.log(`  - ERROR: ${x}`);
  for (const x of w) console.log(`  - aviso: ${x}`);
}
process.exit(errors ? 1 : 0);
