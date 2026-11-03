#!/usr/bin/env node
// Busca en src/ dónde está un texto tal como se ve en la web (para aplicar las correcciones del modo corrección).
// Sin dependencias. Normaliza etiquetas HTML, énfasis y enlaces Markdown, entidades, escapes y concatenaciones JS,
// comillas tipográficas, guiones, mayúsculas, acentos y espacios (también textos partidos en varias líneas).
//
// Uso:
//   node tools/find-text.mjs "<texto renderizado>"     → fichero:línea y el fragmento del código fuente
//   node tools/find-text.mjs --url /redes/ "<texto>"   → igual, pero ordenado para esa página (como con --md)
//   node tools/find-text.mjs --md correcciones.md       → localiza cada «original» del Markdown que copia el modo corrección
//   cat correcciones.md | node tools/find-text.mjs --md -
//   node tools/find-text.mjs --selftest casos.json      → comprueba que el primer resultado de cada caso es el esperado (- = stdin)
//   node tools/find-text.mjs --uses /redes/             → qué plantilla genera esa URL y qué usa (--uses all: todas)
// Opciones: --json (salida para máquinas) · --top N (candidatos parecidos, 5 por defecto) · --assets (incluye src/assets)
//           · --all (todas las coincidencias exactas; si no, las 6 mejores)
// Orden de las coincidencias exactas (con página, es decir, con --md o --url):
//   1. el bloque entero antes que un trozo de una frase (el modo corrección siempre copia bloques enteros; una palabra en
//      <strong>, en un enlace o entre «» dentro de una frase es un trozo);
//   2. la misma mayúscula inicial (el modo corrección copia las mayúsculas del fuente: «redes» es un slug, no «Redes»);
//   3. la fuente de la página (src/redes/index.njk para /redes/; el .md de un artículo; la plantilla paginada) y lo que
//      la página usa: su layout y sus includes, las macros que llama (y las que llaman estas), los ficheros de src/_data
//      que nombran la página, su layout o esas macros, los .11tydata.js de su carpeta y el front matter de las
//      colecciones que recorre (collections.articulos). Primero lo que se ve (la página, luego lo que usa) y después lo
//      que no parece verse: un atributo (alt, content), <title>, <select>, el JSON-LD, una clave del front matter o de
//      src/_data que ninguna plantilla de la página pinta como texto (title, keyword, serviceType, el alt de un logo),
//      un comentario de un .js;
//   4. lo compartido que no consta que use (_includes, _data); 5. el resto.
//   En la salida: «(fuente de la página)», «(lo usa la página)», «(no parece verse)» y «(bloque entero)».
//   Si dos fuentes empatan (el mismo texto en el menú y en el pie), salen las dos: el Markdown no dice cuál se tocó.
// --selftest: JSON con [{ "url": "/redes/", "text": "…", "expect": "src/_data/projects.json:4" }, …]; «expect» puede
//   ir sin línea (solo el fichero). Las líneas cambian al editar las fuentes: si falla un caso, mira primero si se ha
//   movido el texto. Sale con 0 si todos están bien.
// Salida: 0 si hay coincidencia exacta (con --md, en todas); 2 si alguna solo tiene candidatos parecidos; 1 si alguna no tiene nada.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (k) => argv.includes(k);
const opt = (k, d) => { const i = argv.indexOf(k); return i < 0 ? d : argv[i + 1]; };
const TOP = +opt("--top", 5);
const WITH_VALUE = ["--top", "--md", "--url", "--selftest", "--uses"];
// {{ site.* }} se sustituye por su valor (datos canónicos de src/_data/site.js), para encontrar también el texto de plantillas.
let SITE = {};
try { SITE = (await import(pathToFileURL(join(ROOT, "src/_data/site.js")).href)).default || {}; } catch (e) { /* sin datos: se busca sin sustituir */ }
const siteVal = (path) => { const v = path.split(".").reduce((o, k) => (o == null ? o : o[k]), SITE); return typeof v === "string" || typeof v === "number" ? String(v) : null; };

/* ---------- normalización con mapa de posiciones (texto normalizado → offset en el fuente) ---------- */
const ENT = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", laquo: "«", raquo: "»", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", bdquo: "„", mdash: "—", ndash: "–", hellip: "…", middot: "·", bull: "•", shy: "", zwj: "", zwnj: "", thinsp: " ", ensp: " ", emsp: " ", euro: "€", copy: "©", reg: "®", trade: "™", deg: "°", times: "×", iexcl: "¡", iquest: "¿", ordf: "ª", ordm: "º", rarr: "→", larr: "←" };
const MARK = { acute: "\u0301", grave: "\u0300", tilde: "\u0303", uml: "\u0308", circ: "\u0302", cedil: "\u0327" };
const entity = (n) => {
  if (n[0] === "#") return String.fromCodePoint(/^#x/i.test(n) ? parseInt(n.slice(2), 16) : parseInt(n.slice(1), 10));
  if (n in ENT) return ENT[n];
  const m = n.match(/^([a-zA-Z])(acute|grave|tilde|uml|circ|cedil)$/);
  return m ? (m[1] + MARK[m[2]]).normalize("NFC") : null;
};
// Fragmentos que no se ven en la página (o se ven distintos): se sustituyen por su texto visible.
const TOK = new RegExp([
  "<!--[\\s\\S]*?-->", "\\{#[\\s\\S]*?#\\}",                       // comentarios HTML y Nunjucks
  "<(?<blk>style|script)\\b[^>]*>[\\s\\S]*?<\\/\\k<blk>>",          // <style> y <script> de la página: no se ven
  "<[a-zA-Z][^<>]*\\bdata-count=\"(?<cnt>[^\"]+)\"[^<>]*>[^<]*",           // contador: se ve el valor final, no el 0 del fuente
  "<\\/?[a-zA-Z][\\w:-]*(?:\\s[^<>]*)?\\/?>",                       // etiquetas HTML
  "&(?<ent>#\\d+|#x[\\da-fA-F]+|[a-zA-Z]+\\d*);",                  // entidades
  "\\\\u(?<uni>[\\da-fA-F]{4})", "\\\\[nrt]", "\\\\(?<esc>[\"'\\\\/`])", // escapes JS/JSON
  "[\"'`]\\s*\\+\\s*[\"'`]",                                         // "texto " + "partido" (JS)
  "\\{\\{-?\\s*site\\.(?<sv>[\\w.]+)\\s*-?\\}\\}",                        // {{ site.x }} → su valor
  "\\{\\{-?|-?\\}\\}|\\{%-?|-?%\\}",                                // delimitadores Nunjucks
  "\\]\\([^)\\s]*(?:\\s+\"[^\"]*\")?\\)",                            // cola de enlace Markdown ](url)
  "(?<yq>'')",                                                       // '' de YAML
  "\\*\\*|__|~~|\\*|(?<![\\p{L}\\p{N}])_|_(?![\\p{L}\\p{N}])",      // énfasis Markdown
].join("|"), "gu");
const FOLD = new Map();
const fold = (c) => {
  let f = FOLD.get(c);
  if (f !== undefined) return f;
  if (/[\s\u00a0\u200b\u2060\ufeff\u00ad\[\]]/.test(c)) f = "";
  else if ('"“”«»„‟″'.includes(c)) f = '"';
  else if ("'‘’‚‛′´`".includes(c)) f = "'";
  else if ("‐‑‒–—―−".includes(c)) f = "-";
  else if (c === "…") f = "...";
  else { const l = c.toLowerCase(), b = l.normalize("NFD").replace(/\p{M}+/gu, ""); f = b.length === 1 ? b : l; }
  FOLD.set(c, f); return f;
};
function normalize(raw) {
  const out = [], map = [], vars = [];
  const emit = (s, at) => { for (const ch of s) for (const c of fold(ch)) { out.push(c); map.push(at); } };
  const plain = (a, b) => { for (let i = a; i < b; i++) { const ch = raw[i]; for (const c of fold(ch)) { out.push(c); map.push(i); } } };
  let last = 0, m; TOK.lastIndex = 0;
  while ((m = TOK.exec(raw))) {
    plain(last, m.index);
    const g = m.groups;
    if (g.sv) { const v = siteVal(g.sv); if (v != null) { const a = out.length; emit(v, m.index); vars.push([a, out.length, "site." + g.sv]); last = TOK.lastIndex; continue; } }
    if (g.cnt && g.cnt.includes("{{")) { // contador con un dato de site.js: data-count="{{ site.survey.response }}"
      const a0 = out.length, names = [];
      emit(g.cnt.replace(/\{\{-?\s*site\.([\w.]+)\s*-?\}\}/g, (all, p) => { const v = siteVal(p); if (v != null) names.push("site." + p); return v ?? all; }), m.index);
      names.forEach((n) => vars.push([a0, out.length, n])); last = TOK.lastIndex; continue;
    }
    emit(g.cnt ? g.cnt : g.ent ? entity(g.ent) ?? m[0] : g.uni ? String.fromCharCode(parseInt(g.uni, 16)) : g.esc || (g.yq ? "'" : ""), m.index);
    last = TOK.lastIndex;
  }
  plain(last, raw.length);
  return { text: out.join(""), map, vars };
}

/* ---------- índice de src/ ---------- */
function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (e !== "node_modules" && (flag("--assets") || relative(join(ROOT, "src"), p) !== "assets")) walk(p, acc); }
    else if (/\.(njk|md|js|json)$/.test(e)) acc.push(p);
  }
  return acc;
}
const files = walk(join(ROOT, "src")).map((p) => {
  const raw = readFileSync(p, "utf8"), { text, map, vars } = normalize(raw), lines = [0];
  for (let i = 0; i < raw.length; i++) if (raw[i] === "\n") lines.push(i + 1);
  return { file: relative(ROOT, p).split("\\").join("/"), raw, text, map, vars, lines };
});
const byFile = new Map(files.map((f) => [f.file, f]));
const lineOf = (f, off) => { let lo = 0, hi = f.lines.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (f.lines[mid] <= off) lo = mid; else hi = mid - 1; } return lo + 1; };
const snippet = (f, a, b, ctx = 24) => {
  const s = Math.max(0, a - ctx), e = Math.min(f.raw.length, b + ctx);
  return ((s > 0 ? "…" : "") + f.raw.slice(s, a) + "⟦" + f.raw.slice(a, b) + "⟧" + f.raw.slice(b, e) + (e < f.raw.length ? "…" : "")).replace(/\s*\n\s*/g, " ⏎ ");
};
const hit = (f, i, len, extra) => {
  const a = f.map[i], z = f.map[i + len - 1], t = f.raw.slice(z, z + 200).match(/^(?:\{\{[\s\S]*?\}\}|&[^;\s]{1,10};|<[^>]*>)/), b = z + (t ? t[0].length : 1);
  const vars = f.vars.filter(([x, y]) => x < i + len && y > i).map((v) => v[2]); // datos de site.js dentro del texto
  return { file: f.file, line: lineOf(f, a), endLine: lineOf(f, b - 1), snippet: snippet(f, a, Math.max(b, a + 1)), ...(vars.length ? { vars } : {}), ...extra };
};

/* ---------- páginas: qué fichero genera cada URL y qué fuentes usa (para ordenar los resultados) ---------- */
const DATA = new Map(); // nombre global → fichero de src/_data (projects → src/_data/projects.json)
for (const f of files) { const m = f.file.match(/^src\/_data\/([\w-]+)\.(?:js|json)$/); if (m) DATA.set(m[1], f.file); }
const MODS = new Map();
const loadMod = async (file) => { // valor de un fichero de datos (.json o export default de un .js); null si falla
  if (MODS.has(file)) return MODS.get(file);
  let v = null;
  try { v = file.endsWith(".json") ? JSON.parse(byFile.get(file).raw) : (await import(pathToFileURL(join(ROOT, file)).href)).default; if (typeof v === "function") v = await v(); } catch (e) { v = null; }
  MODS.set(file, v); return v;
};
const frontMatter = (raw) => (raw.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---/) || [, ""])[1];
const fmScalar = (fm, k) => { const m = fm.match(new RegExp(`^${k}:[ \\t]*(\\S.*?)[ \\t]*$`, "m")); return m ? m[1].replace(/^(["'])(.*)\1$/, "$2") : null; };
const dig = (o, path) => path.split(".").reduce((x, k) => (x == null ? x : x[k]), o);
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normUrl = (u) => {
  let s = String(u).trim().replace(/^[a-z]+:\/\/[^/]+/i, "").replace(/[?#].*$/, "").replace(/^\/web-adqa(?=\/|$)/, "");
  if (!s.startsWith("/")) s = "/" + s;
  s = s.replace(/\/index\.html$/, "/");
  return /\.\w+$/.test(s) || s.endsWith("/") ? s : s + "/";
};
const TPLS = new Map(); // plantilla → { layout, tags, dd: [.11tydata] }
const PAGE_URL = new Map(), PAGE_PAT = []; // URL → plantilla; [patrón, plantilla] si no se ha podido calcular
async function buildPages() {
  for (const t of files) {
    if (!/\.(njk|md)$/.test(t.file) || /^src\/(_includes|_data|assets)\//.test(t.file)) continue;
    const rel = t.file.slice(4), parts = rel.split("/"), stem = rel.replace(/\.\w+$/, ""), base = parts.at(-1).replace(/\.\w+$/, "");
    // datos de carpeta (src/a/b/b.11tydata.js) y de plantilla (src/a/b/c.11tydata.js), de lo general a lo particular
    const ddNames = parts.slice(0, -1).map((p, i) => "src/" + parts.slice(0, i + 1).join("/") + "/" + p + ".11tydata.").concat("src/" + stem + ".11tydata.");
    const dd = ddNames.flatMap((n) => files.filter((f) => f.file.startsWith(n) && /\.11tydata\.(?:js|json)$/.test(f.file)));
    const data = {};
    for (const f of dd) { const v = await loadMod(f.file); if (v && typeof v === "object") Object.assign(data, v, { eleventyComputed: { ...data.eleventyComputed, ...v.eleventyComputed } }); }
    const fm = frontMatter(t.raw), tagsFm = fmScalar(fm, "tags");
    const pg = (fm.match(/^pagination:[ \t]*\r?\n((?:[ \t]+.*(?:\r?\n|$))+)/m) || [, ""])[1];
    const pdata = (pg.match(/^\s+data:\s*["']?([\w.]+)/m) || [])[1], alias = (pg.match(/^\s+alias:\s*["']?(\w+)/m) || [])[1];
    TPLS.set(t.file, {
      layout: fmScalar(fm, "layout") || (typeof data.layout === "string" ? data.layout : null), dd: dd.map((f) => f.file), paginate: pdata && alias ? [alias, pdata] : null,
      tags: [].concat(tagsFm ? tagsFm.replace(/[[\]"']/g, "").split(/[\s,]+/).filter(Boolean) : data.tags || []),
    });
    // permalink: eleventyComputed de los datos de carpeta > front matter > datos de carpeta > el de Eleventy por defecto
    const page = { fileSlug: (base === "index" ? parts.at(-2) || "" : base).replace(/^\d{4}-\d{2}-\d{2}-/, ""), filePathStem: "/" + stem, inputPath: "./" + t.file, outputFileExtension: "html" };
    let pl = null; const comp = data.eleventyComputed && data.eleventyComputed.permalink;
    if (typeof comp === "function") { try { pl = await comp({ ...data, page }); } catch (e) { pl = null; } }
    else if (typeof comp === "string") pl = comp;
    if (pl == null) pl = fmScalar(fm, "permalink");
    if (pl == null && typeof data.permalink === "string") pl = data.permalink;
    if (pl === false || pl === "false") continue;
    if (pl == null) pl = base === "index" ? "/" + parts.slice(0, -1).join("/") + (parts.length > 1 ? "/" : "") : "/" + stem + "/";
    pl = String(pl);
    if (!pl.includes("{{")) { const u = normUrl(pl); if (!PAGE_URL.has(u)) PAGE_URL.set(u, t.file); continue; }
    // plantilla paginada (permalink "/recursos/{{ cat.slug }}/"): una URL por elemento de pagination.data
    let items = null;
    const [root, ...path] = (pdata || "").split(".");
    if (alias && DATA.has(root)) { const m = await loadMod(DATA.get(root)), v = path.length ? dig(m, path.join(".")) : m; items = Array.isArray(v) ? v : null; }
    let ok = !!items;
    for (const it of items || []) {
      const u = pl.replace(/\{\{-?\s*([\w.]+)\s*(\|[^}]*)?-?\}\}/g, (all, p, filt) => {
        const v = filt ? null : p === alias ? it : p.startsWith(alias + ".") ? dig(it, p.slice(alias.length + 1)) : null;
        if (typeof v !== "string" && typeof v !== "number") { ok = false; return ""; } return String(v);
      });
      if (ok && !PAGE_URL.has(normUrl(u))) PAGE_URL.set(normUrl(u), t.file);
    }
    if (!ok) PAGE_PAT.push([new RegExp("^" + pl.split(/\{\{[\s\S]*?\}\}/).map(escRe).join("[^/]+") + "$"), t.file]);
  }
}
const pageFor = (url) => { const u = normUrl(url); return PAGE_URL.get(u) || (PAGE_PAT.find(([re]) => re.test(u)) || [])[1] || null; };

// macros de un fichero de _includes: nombre, parámetros, offsets y líneas
const macrosOf = (f) => f.macros || (f.macros = [...f.raw.matchAll(/\{%-?\s*macro\s+(\w+)\s*\(([^)]*)\)/g)].map((m) => {
  const e = f.raw.slice(m.index).search(/\{%-?\s*endmacro\b/), b = e < 0 ? f.raw.length : m.index + e;
  const params = new Set([...m[2].replace(/"[^"]*"|'[^']*'/g, "").matchAll(/(?:^|,)\s*([\w$]+)/g)].map((x) => x[1]));
  return { name: m[1], params, a: m.index, b, from: lineOf(f, m.index), to: lineOf(f, b) };
}));
const tplCode = (s) => (s.match(/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/g) || []).join("\n"); // solo lo que es código Nunjucks
const fmEnd = (f) => f.fmEnd ?? (f.fmEnd = (f.raw.match(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/) || [""])[0].length);
// ¿se ve lo que hay en la posición i de una plantilla? No, si está dentro de una etiqueta (un atributo: alt, content…)
// o de <script>, <style>, <title>, <head>, <select>, <textarea> o <noscript> (el modo corrección no los deja elegir).
const HIDDEN_EL = ["script", "style", "title", "head", "select", "textarea", "noscript"];
const textCtx = (s, i) => {
  const lt = s.lastIndexOf("<", i - 1);
  if (lt >= 0 && lt > s.lastIndexOf(">", i - 1) && /[a-zA-Z\/!]/.test(s[lt + 1] || "")) return false;
  return !HIDDEN_EL.some((el) => { const o = s.lastIndexOf("<" + el, i); return o >= 0 && /[\s>]/.test(s[o + el.length + 1] || "") && o > s.lastIndexOf("</" + el, i); });
};
// cadenas de una expresión Nunjucks: raíz y propiedades (site.address.street → site [address, street]), sin cadenas de
// texto, nombres de argumentos (title="…") ni filtros. Una raíz suelta dentro de una llamada (projectCard(p), m.faqSection(faq))
// puede pintarse entera: props "*".
const KW = new Set(["and", "or", "not", "if", "else", "in", "is", "true", "false", "none", "null", "loop", "super", "caller"]);
const chainsOf = (expr) => {
  const e = expr.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""').replace(/\|\s*[\w$]+/g, "").replace(/\b[\w$]+\s*=(?!=)/g, "");
  const call = /[\w$\]]\s*\(/.test(e), out = [];
  for (const m of e.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)((?:\s*\.\s*[A-Za-z_$][\w$]*|\s*\[[^\]]*\])*)/g)) {
    for (const br of m[2].matchAll(/\[([^\]]*)\]/g)) out.push(...chainsOf(br[1]));
    if (KW.has(m[1])) continue;
    const props = [...m[2].replace(/\[[^\]]*\]/g, "").matchAll(/\.\s*([\w$]+)/g)].map((x) => x[1]);
    if (!props.length && /^\s*\(/.test(e.slice(m.index + m[0].length))) continue; // el nombre de una función
    out.push({ root: m[1], props: !props.length && call ? "*" : props });
  }
  return out;
};
const USES = new Map();
// Lo que usa una página: { whole: ficheros enteros, lines: fichero → [[desde, hasta], …] (macros que llama; front matter
// de los ficheros de una colección), byRoot/props: variables y propiedades que se pintan como texto visible, hidden:
// blocks del layout que no se ven (jsonld, head) }
function uses(pageFile) {
  if (USES.has(pageFile)) return USES.get(pageFile);
  const whole = new Set([pageFile]), lines = new Map(), code = [], done = new Set(), bodies = [];
  const addLines = (file, a, b) => { if (!lines.has(file)) lines.set(file, []); lines.get(file).push([a, b]); };
  const inc = (name) => byFile.get("src/_includes/" + name) || byFile.get("src/_includes/" + name + ".njk");
  const useFile = (g) => { if (g && !whole.has(g.file)) { whole.add(g.file); visit(g, g.raw); } };
  const useMacro = (g, name) => {
    if (done.has(g.file + "#" + name)) return; done.add(g.file + "#" + name);
    const mac = macrosOf(g).find((x) => x.name === name); if (!mac) return;
    addLines(g.file, mac.from, mac.to);
    const body = g.raw.slice(mac.a, mac.b);
    visit(g, body, mac.params);
    for (const o of macrosOf(g)) if (o.name !== name && new RegExp(`(?<![\\w.$])${o.name}\\s*\\(`).test(tplCode(body))) useMacro(g, o.name);
  };
  function visit(f, body, params = null) {
    const js = /\.js$/.test(f.file), c = js ? body : tplCode(body) + "\n" + (frontMatter(body).match(/^\s+data:.*$/gm) || []).join("\n");
    code.push(c);
    if (!js) bodies.push({ f, body: body.slice(params ? 0 : fmEnd({ raw: body })), params });
    else bodies.push({ f, js: true, body });
    for (const m of c.matchAll(/\{%-?\s*(?:extends|include)\s+["']([^"']+)["']/g)) useFile(inc(m[1]));
    for (const m of c.matchAll(/\{%-?\s*import\s+["']([^"']+)["']\s+as\s+(\w+)/g)) {
      const g = inc(m[1]); if (g) for (const k of c.matchAll(new RegExp(`(?<![\\w.$])${m[2]}\\.(\\w+)\\s*\\(`, "g"))) useMacro(g, k[1]);
    }
    for (const m of c.matchAll(/\{%-?\s*from\s+["']([^"']+)["']\s+import\s+([\w\s,]+?)\s*-?%\}/g)) {
      const g = inc(m[1]); if (g) for (const n of m[2].split(",")) useMacro(g, n.trim().split(/\s+/)[0]);
    }
  }
  const tpl = TPLS.get(pageFile) || { dd: [], layout: null };
  visit(byFile.get(pageFile), byFile.get(pageFile).raw);
  for (const d of tpl.dd) useFile(byFile.get(d));
  if (tpl.layout) useFile(inc(tpl.layout));
  const all = code.join("\n");
  for (const [name, file] of DATA) if (new RegExp(`(?<![\\w$.-])(?:data\\.)?${escRe(name)}(?![\\w$-])`).test(all)) whole.add(file);
  // colecciones (collections.articulos): de cada fichero solo se ve su front matter (título, lead… en las tarjetas)
  for (const [, tag] of all.matchAll(/\bcollections\.(\w+)/g)) if (tag !== "all") for (const [file, t] of TPLS) if (t.tags.includes(tag) && file !== pageFile && !whole.has(file)) addLines(file, 1, lineOf(byFile.get(file), Math.max(0, fmEnd(byFile.get(file)) - 1)));
  // qué se pinta como texto: {{ … }} fuera de etiquetas y de los blocks ocultos, y los alias de {% for %} / {% set %}
  const hidden = new Set();
  for (const { f, body, js } of bodies) if (!js && f.file.startsWith("src/_includes/")) for (const m of body.matchAll(/\{%-?\s*block\s+(\w+)/g)) if (!textCtx(body, m.index)) hidden.add(m[1]);
  // (los alias son de cada plantilla o macro; los parámetros de una macro no son variables de la página)
  // byRoot: variable → propiedades que se pintan ("*": todas); props: todas las propiedades que se pintan
  const byRoot = new Map(), props = new Set();
  const put = (map, root, ps) => { const cur = map.get(root); if (cur === "*") return; if (ps === "*") return map.set(root, "*"); const set = cur || new Set(); ps.forEach((p) => { set.add(p); props.add(p); }); map.set(root, set); };
  for (const { body, params, js } of bodies) {
    if (js) { for (const m of body.matchAll(/\bdata((?:\.[\w$]+)+)/g)) put(byRoot, m[1].slice(1).split(".")[0], "*"); continue; } // datos calculados: no se sabe qué se pinta
    const local = new Map(), edges = [];
    const blocks = [...body.matchAll(/\{%-?\s*block\s+(\w+)[\s\S]*?\{%-?\s*endblock\s*-?%\}/g)].filter((m) => hidden.has(m[1])).map((m) => [m.index, m.index + m[0].length]);
    for (const m of body.matchAll(/\{\{([\s\S]*?)\}\}/g)) if (textCtx(body, m.index) && !blocks.some(([x, y]) => m.index > x && m.index < y)) for (const c of chainsOf(m[1])) put(local, c.root, c.props);
    // la expresión principal (antes del primer filtro) y los argumentos de los filtros (bySlugs(blog.featured), byCategory(c.slug)):
    // estos solo se usan para elegir, no heredan lo que se pinta del alias
    for (const m of body.matchAll(/\{%-?\s*(?:for\s+([\w$]+)(?:\s*,\s*([\w$]+))?\s+in|set\s+([\w$]+)\s*=)([\s\S]*?)-?%\}/g)) {
      const ex = m[4].replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""'), bar = ex.indexOf("|");
      edges.push([[m[1], m[2], m[3]].filter(Boolean), chainsOf(bar < 0 ? ex : ex.slice(0, bar)), bar < 0 ? [] : chainsOf(ex.slice(bar))]);
    }
    // alias pintado → lo que recorre también: {% for l in nav.main %}{{ l.label }} → nav [main, label]
    for (let n = -1, k = 0; n !== k;) { n = k; for (const [al, cs, args] of edges) for (const x of al) if (local.has(x)) { for (const c of cs) { put(local, c.root, c.props); put(local, c.root, local.get(x) === "*" ? "*" : [...local.get(x)]); } for (const c of args) put(local, c.root, c.props); } k = [...local.values()].reduce((t, v) => t + (v === "*" ? 1e6 : v.size + 1), 0); }
    for (const [r, ps] of local) if (!(params && params.has(r)) && !edges.some(([al]) => al.includes(r))) put(byRoot, r, ps === "*" ? "*" : [...ps]);
  }
  if (tpl.paginate && byRoot.has(tpl.paginate[0])) { // alias de la paginación (cat ← blog.categories)
    const [alias, path] = tpl.paginate, [r, ...ps] = path.split("."), got = byRoot.get(alias);
    put(byRoot, r, ps); put(byRoot, r, got === "*" ? "*" : [...got]); byRoot.delete(alias);
  }
  const u = { whole, lines, byRoot, props, hidden };
  USES.set(pageFile, u); return u;
}
// clave de un dato en la posición a (JSON, JS o YAML del front matter): «name» en "name": "…"; en una lista, la clave de la
// lista (partners: ["Ruckus", …], etiquetas:\n  - WiFi). top: si es una clave de primer nivel del front matter.
const lineKey = (pre) => { // última «clave:» de la línea fuera de cadenas; para en una cadena sin cerrar (la del texto)
  let key = null, prev = null;
  for (const m of pre.matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([\w$-]+)|(\S)/g)) {
    if (m[4] === '"' || m[4] === "'") break;
    if (m[4] === ":" && prev != null) key = prev;
    prev = m[1] ?? m[2] ?? m[3] ?? null;
  }
  return key;
};
const keyAt = (f, a) => {
  const ls = f.raw.lastIndexOf("\n", a - 1) + 1, pre = f.raw.slice(ls, a), key = lineKey(pre);
  if (key) return { key, top: new RegExp(`^["']?${escRe(key)}["']?\\s*:`).test(pre) };
  if (!/^\s*(?:-\s+)?["']?$/.test(pre)) return null;
  const ind = pre.match(/^\s*/)[0].length; // elemento de una lista o texto de varias líneas: la clave del padre
  for (let e = ls - 1; e > 0;) {
    const s = f.raw.lastIndexOf("\n", e - 1) + 1, line = f.raw.slice(s, e); e = s - 1;
    if (!line.trim()) continue;
    const k = line.match(/^(\s*)(?:-\s+)?["']?([\w$-]+)["']?\s*:\s*(?:\[|\||>[-+]?)?\s*$/);
    if (k && k[1].length <= ind) return { key: k[2], top: k[1].length === 0 };
    if (line.match(/^\s*/)[0].length < ind) return null;
  }
  return null;
};
// ¿está en un comentario de un .js? (// fuera de cadenas hasta el final de la línea, o /* … */)
const jsComment = (f, a) => {
  const o = f.raw.lastIndexOf("/*", a), c = f.raw.lastIndexOf("*/", a);
  if (o >= 0 && o > c && !/["'`]/.test(f.raw.slice(f.raw.lastIndexOf("\n", o) + 1, o))) return true;
  return f.raw.slice(f.raw.lastIndexOf("\n", a - 1) + 1, a).replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g, "").includes("//");
};
// ¿se ve en la página? 1 = sí o no se sabe · 0 = parece que no (atributo, <title>, JSON-LD, dato que no se pinta, comentario)
const visible = (f, a, page) => {
  if (/\.js$/.test(f.file) && jsComment(f, a)) return 0;
  if (!page) return /\.(njk|md)$/.test(f.file) && a >= fmEnd(f) && !textCtx(f.raw, a) ? 0 : 1;
  if (!/\.(njk|md|json|js)$/.test(f.file) || /\.11tydata\.js$/.test(f.file)) return 1;
  const u = uses(page), data = f.file.match(/^src\/_data\/([\w-]+)\./);
  // datos: el fichero se pinta (site.x, un alias de un {% for %}) y su clave también (.name, .partners)
  if (data) { const ps = u.byRoot.get(data[1]), k = ps && keyAt(f, a); return !ps ? 0 : ps === "*" || !k || ps.has(k.key) ? 1 : 0; }
  if (!/\.(njk|md)$/.test(f.file)) return 1;
  // front matter: de la página, {{ h1 }}; de otra página de una colección o anidado, {{ p.data.h1 }}, {{ f.q }}
  if (a < fmEnd(f)) { const k = keyAt(f, a); return !k || (k.top && f.file === page ? u.byRoot : u.props).has(k.key) ? 1 : 0; }
  if (!textCtx(f.raw, a)) return 0;
  const bl = [...f.raw.slice(0, a).matchAll(/\{%-?\s*(block|endblock)\b\s*(\w*)/g)], open = [];
  for (const m of bl) m[1] === "block" ? open.push(m[2]) : open.pop();
  return open.some((b) => u.hidden.has(b)) ? 0 : 1;
};
// 3 = fuente de la página · 2 = la página lo usa · 1 = compartido (_includes, _data) · 0 = otro
// Sin URL: 1 a lo compartido. URL que no es de ninguna plantilla: por el nombre (3 = misma ruta, 2 = mismo final).
const shared = (file) => /^src\/(_includes|_data)\//.test(file);
const ownScore = (file, line, url) => {
  if (!url) return shared(file) ? 1 : 0;
  const page = pageFor(url);
  if (!page) {
    const segs = normUrl(url).split("/").filter(Boolean), rel = file.replace(/^src\//, "").replace(/\.\w+$/, "");
    if (rel === (segs.length ? segs.join("/") + "/index" : "index")) return 3;
    if (segs.length && (rel.endsWith("/" + segs.at(-1)) || rel === segs.at(-1))) return 2;
    return shared(file) ? 1 : 0;
  }
  if (file === page) return 3;
  const u = uses(page);
  if (u.whole.has(file) || (u.lines.get(file) || []).some(([a, b]) => line >= a && line <= b)) return 2;
  return shared(file) ? 1 : 0;
};

/* ---------- búsqueda ---------- */
function bigrams(s) { const m = new Map(); for (let i = 0; i < s.length - 1; i++) { const k = s.slice(i, i + 2); m.set(k, (m.get(k) || 0) + 1); } return m; }
function dice(a, bm, bn) { const am = bigrams(a); let inter = 0; for (const [k, v] of am) inter += Math.min(v, bm.get(k) || 0); return (2 * inter) / Math.max(1, a.length - 1 + bn); }
// ¿ocupa el texto un bloque entero del fuente (celda, <li>, comillas, valor YAML, línea, entre etiquetas Nunjucks)
// o es un trozo de una frase? 0, 1 o 2 lados delimitados.
const yamlKey = (f, i) => f.raw[i] === ":" && /^[ \t]*(?:-[ \t]+)?[\w-]+$/.test(f.raw.slice(f.raw.lastIndexOf("\n", i - 1) + 1, i));
// etiquetas inline: hacia fuera (la que abre a la izquierda, la que cierra a la derecha) el bloque sigue
const INL = "a|abbr|b|bdi|bdo|cite|code|data|dfn|em|i|kbd|mark|q|s|samp|small|span|strong|sub|sup|time|u|var";
const INL_OPEN = new RegExp(`^<(?:${INL})(?:\\s[^<>]*)?>$`, "i"), INL_CLOSE = new RegExp(`^<\\/(?:${INL})\\s*>`, "i");
// cutL/cutR: el texto empieza o acaba a media pieza (dentro del valor de {{ site.email }}, de una entidad): ese lado no cuenta
const whole = (f, a, z, cutL = false, cutR = false) => {
  // el último carácter puede venir de un token entero: contador, {{ site.x }}, entidad o escape
  const end = f.raw.slice(z, z + 200).match(/^(?:<[^<>]*\bdata-count=[^<>]*>[^<]*|\{\{[\s\S]*?\}\}|&[^;\s]{1,10};|\\u[\da-fA-F]{4}|\\[nrt"'\\/`])/);
  let i = a - 1, j = z + (end ? end[0].length : 1);
  // se sale de las etiquetas inline que envuelven el texto y de los enlaces Markdown ([texto](url)): si al otro lado sigue
  // la frase («con <strong>Intune</strong>.», «la carpeta «Clientes» del…»), es una mención dentro de un bloque, no el bloque
  for (;;) {
    while (i >= 0 && /[ \t*_~[]/.test(f.raw[i])) i--;
    const lt = f.raw[i] === ">" ? f.raw.lastIndexOf("<", i) : -1;
    if (lt < 0 || !INL_OPEN.test(f.raw.slice(lt, i + 1))) break;
    i = lt - 1;
  }
  for (;;) {
    while (j < f.raw.length && /[ \t*_~]/.test(f.raw[j])) j++;
    const t = f.raw.slice(j, j + 200).match(INL_CLOSE) || f.raw.slice(j, j + 400).match(/^\]\([^)\s]*(?:\s+"[^"]*")?\)/);
    if (!t) break;
    j += t[0].length;
  }
  // a la izquierda, «-», «#» y «1.» solo como marca de lista o de título («- texto», «## Texto», «1. Paso»), no dentro de
  // un slug ni de una frase; «|» solo en una fila de tabla Markdown (no en title: "Aviso legal | ADQA")
  const cell = (k) => f.raw[k] === "|" && /^[ \t]*\|/.test(f.raw.slice(f.raw.lastIndexOf("\n", k - 1) + 1));
  const olist = (k) => /[.)]/.test(f.raw[k]) && /[ \t]/.test(f.raw[k + 1]) && /^[ \t]*\d+$/.test(f.raw.slice(f.raw.lastIndexOf("\n", k - 1) + 1, k));
  return (!cutL && (i < 0 || /[>"'\n}]/.test(f.raw[i]) || cell(i) || (/[-#]/.test(f.raw[i]) && /[ \t]/.test(f.raw[i + 1])) || olist(i) || yamlKey(f, i)) ? 1 : 0) +
    (!cutR && (j >= f.raw.length || /[<"'\n{]/.test(f.raw[j]) || cell(j)) ? 1 : 0);
};
// ¿empieza con la misma mayúscula/minúscula que en la web? El modo corrección copia el texto con las mayúsculas del
// fuente, así que «redes» (un slug, una clave) no es el origen de «Redes». Si la primera letra sale de {{ }}, de una
// entidad o de un escape, no se sabe: cuenta como sí.
const sameCase = (f, i, first) => {
  if (!first) return 1;
  let k = i; while (k < f.text.length && !/[\p{L}\p{N}]/u.test(f.text[k])) k++;
  const ch = f.raw[f.map[k]];
  return ch === first || /[{&\\<]/.test(ch || "") ? 1 : 0;
};
function search(query, url) {
  const q = normalize(query).text, res = { query, ...(url ? { page: pageFor(url) } : {}), exact: [], candidates: [], pieces: [] };
  // un solo carácter («4», la cifra de un .stat) solo se busca en la página y en lo que usa
  const pool = q.length >= 2 ? files : url ? files.filter((f) => ownScore(f.file, 0, url) >= 2 || (res.page && uses(res.page).lines.has(f.file))) : [];
  if (!q.length || !pool.length) return res;
  const first = (query.match(/[\p{L}\p{N}]/u) || [""])[0]; // misma mayúscula/minúscula inicial que en la web
  for (const f of pool) for (let i = f.text.indexOf(q); i >= 0; i = f.text.indexOf(q, i + 1)) {
    const a = f.map[i], z = f.map[i + q.length - 1], w = whole(f, a, z, i > 0 && f.map[i - 1] === a, f.map[i + q.length] === z);
    const cs = sameCase(f, i, first), own = ownScore(f.file, lineOf(f, a), url);
    if (q.length < 2 && own < 2) continue;
    const vis = visible(f, a, res.page), tier = own >= 2 ? (vis ? own + 1 : 2) : own;
    // por orden: bloque entero (64) > misma mayúscula inicial (32) > página que se ve (4) > lo que usa y se ve (3) > página
    // o lo que usa pero no parece verse (2) > compartido (1) > el resto (0), × 4 > se ve (2) > un lado delimitado (1)
    res.exact.push(hit(f, i, q.length, { own, whole: w === 2, ...(vis ? {} : { visible: false }), rank: (w === 2 ? 64 : 0) + cs * 32 + tier * 4 + vis * 2 + (w === 1 ? 1 : 0) }));
  }
  res.exact.sort((x, y) => y.rank - x.rank);
  if (res.exact.length || q.length < 2) return res;
  // parecidos: anclas repartidas por la consulta → ventanas del mismo largo → Dice de bigramas
  const qb = bigrams(q), qn = q.length - 1, al = Math.max(4, Math.min(14, Math.floor(q.length / 5))), seen = new Map();
  const anchors = []; for (let k = 0; k < 8; k++) anchors.push(Math.round(((q.length - al) * k) / 7));
  for (const f of files) for (const o of anchors) {
    const an = q.slice(o, o + al); let n = 0;
    for (let i = f.text.indexOf(an); i >= 0 && n < 300; i = f.text.indexOf(an, i + 1), n++) {
      const s = Math.max(0, i - o), key = f.file + ":" + (s >> 3);
      if (seen.has(key)) continue;
      let best = 0, bs = s, bl = q.length;
      for (const [ds, dl] of [[0, 0], [0, 0.15], [-0.1, 0.1], [0, -0.1]]) {
        const ss = Math.max(0, Math.round(s + ds * q.length)), ll = Math.max(4, Math.round(q.length * (1 + dl)));
        const sc = dice(f.text.slice(ss, ss + ll), qb, qn); if (sc > best) { best = sc; bs = ss; bl = ll; }
      }
      seen.set(key, { f, s: bs, l: Math.min(bl, f.text.length - bs), score: best });
    }
  }
  const cands = [...seen.values()].sort((x, y) => y.score - x.score), out = [];
  for (const c of cands) {
    if (out.length >= TOP) break;
    const h = hit(c.f, c.s, Math.max(1, c.l), { score: Math.round(c.score * 100), own: ownScore(c.f.file, lineOf(c.f, c.f.map[c.s] ?? 0), url) });
    if (!out.some((o) => o.file === h.file && Math.abs(o.line - h.line) < 2)) out.push(h);
  }
  res.candidates = out.filter((c) => c.score >= 35);
  // trozos: frases o grupos de ≤ 8 palabras que sí están tal cual (útil si el texto se compone de varias piezas)
  const words = query.replace(/[«»"“”]/g, " ").split(/(?<=[.;:!?·|])\s+|\s+(?=·)/).flatMap((s) => { const w = s.trim().split(/\s+/), r = []; for (let i = 0; i < w.length; i += 8) r.push(w.slice(i, i + 8).join(" ")); return r; });
  for (const w of words) {
    const n = normalize(w).text; if (n.length < 10) continue;
    for (const f of files) { const i = f.text.indexOf(n); if (i >= 0) { res.pieces.push(hit(f, i, n.length, { piece: w })); break; } }
  }
  return res;
}

/* ---------- salida ---------- */
const short = (s, n = 90) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const label = (r, h) => (h.own === 3 || (h.own === 2 && !r.page) ? "  (fuente de la página)" : h.own === 2 ? "  (lo usa la página)" : "") + (h.visible === false ? "  (no parece verse)" : "");
function print(r, indent = "") {
  if (r.exact.length) {
    // las mejores primero (el bloque entero, la misma mayúscula, la página y lo que usa); con muchas, solo las primeras (--json las da todas)
    const show = flag("--all") ? r.exact : r.exact.slice(0, Math.max(TOP, 6));
    show.forEach((h) => console.log(`${indent}✔ ${h.file}:${h.line}${h.endLine !== h.line ? "-" + h.endLine : ""}${label(r, h)}${h.whole ? "  (bloque entero)" : ""}${h.vars ? `  · incluye {{ ${h.vars.join(" }}, {{ ")} }} → src/_data/site.js` : ""}\n${indent}    ${short(h.snippet, 220)}`));
    if (show.length < r.exact.length) console.log(`${indent}  … y ${r.exact.length - show.length} coincidencias más (--all para verlas)`);
    return;
  }
  console.log(`${indent}✘ Sin coincidencia exacta.${r.candidates.length ? " Candidatos parecidos:" : ""}`);
  r.candidates.forEach((h) => console.log(`${indent}  ${String(h.score).padStart(3)}%  ${h.file}:${h.line}\n${indent}        ${short(h.snippet, 220)}`));
  if (r.pieces.length) { console.log(`${indent}  Trozos encontrados tal cual:`); r.pieces.forEach((h) => console.log(`${indent}    «${short(h.piece, 50)}» → ${h.file}:${h.line}`)); }
}
function parseMd(md) { // formato de «Copia per a Claude» (las líneas de continuación van sangradas 5 espacios)
  const out = []; let url = null, cur = null, open = null;
  for (const line of md.split(/\r?\n/)) {
    let m;
    if ((m = line.match(/^###\s+(\S+)/))) { url = m[1]; open = null; }
    else if ((m = line.match(/^(\d+)\.\s+«(.*)»\s*$/))) { out.push((cur = { n: +m[1], url, original: m[2], text: null, note: null })); open = null; }
    else if (cur && (m = line.match(/^\s+→\s+«(.*)$/))) { cur.text = m[1]; open = "text"; } // sigue mientras haya líneas sangradas 5 espacios
    else if (cur && (m = line.match(/^\s+Nota:\s?(.*)$/))) { cur.note = m[1]; open = "note"; }
    else if (cur && open && /^\s{5}/.test(line)) cur[open] += "\n" + line.slice(5);
    else open = null;
  }
  out.forEach((it) => { if (it.text != null) it.text = it.text.replace(/»\s*$/, ""); });
  return out;
}

// Sin process.exit(): con la salida en una tubería (| head, un agente que la lee) cortaría lo que aún no se ha escrito.
const code = (rs) => (rs.every((r) => r.exact.length) ? 0 : rs.some((r) => !r.exact.length && !r.candidates.length) ? 1 : 2);
if (flag("--md") || flag("--url") || flag("--selftest") || flag("--uses")) await buildPages();
if (flag("--uses")) { // qué cuenta como «fuente de la página» y «lo usa la página» para una URL (o --uses all: todas)
  const show = (url) => { const p = pageFor(url); if (!p) return console.log(`${url} → ninguna plantilla genera esta URL`);
    const u = uses(p), mac = [...u.lines].filter(([f]) => macrosOf(byFile.get(f)).length).map(([f, rs]) => `${f}: ${rs.map(([a, b]) => macrosOf(byFile.get(f)).find((m) => m.from === a).name + ` (${a}-${b})`).join(", ")}`);
    const col = [...u.lines.keys()].filter((f) => !macrosOf(byFile.get(f)).length);
    console.log(`${url} → ${p}\n   usa: ${[...u.whole].filter((f) => f !== p).join(", ")}${mac.length ? "\n   macros: " + mac.join("; ") : ""}` +
      `${col.length ? `\n   front matter de ${col.length} ficheros de colecciones (${col.slice(0, 3).join(", ")}${col.length > 3 ? "…" : ""})` : ""}` +
      `\n   se pinta como texto: ${[...u.byRoot].sort().map(([r, ps]) => r + (ps === "*" ? "{*}" : ps.size ? `{${[...ps].join(",")}}` : "")).join(" ")}${u.hidden.size ? `\n   blocks que no se ven: ${[...u.hidden].join(", ")}` : ""}`); };
  const url = opt("--uses");
  if (url === "all") [...PAGE_URL.keys()].sort().forEach(show); else show(url);
} else if (flag("--selftest")) {
  const src = opt("--selftest"), cases = JSON.parse(readFileSync(src && src !== "-" && !src.startsWith("--") ? src : 0, "utf8"));
  let ok = 0;
  for (const c of cases) {
    const r = search(c.text, c.url || null), top = r.exact[0], [file, line] = String(c.expect).split(/:(?=\d+$)/);
    const good = !!top && top.file === file && (line == null || (top.line <= +line && +line <= top.endLine));
    if (good) ok++;
    console.log(`${good ? "✔" : "✘"} ${c.url || "(sin URL)"} «${short(c.text, 60)}» → ${top ? `${top.file}:${top.line}` : "nada"}${good ? "" : `  · esperado ${c.expect}`}`);
    if (!good) r.exact.slice(0, 3).forEach((h) => console.log(`     ${h.file}:${h.line}  own ${h.own}${h.whole ? " · bloque entero" : ""} · rank ${h.rank}`));
  }
  console.log(`${ok}/${cases.length} casos bien`);
  process.exitCode = ok === cases.length ? 0 : 1;
} else if (flag("--md")) {
  const src = opt("--md"), md = !src || src === "-" || src.startsWith("--") ? readFileSync(0, "utf8") : readFileSync(src, "utf8");
  const items = parseMd(md).map((it) => ({ ...it, ...search(it.original, it.url) }));
  if (!items.length) { console.error("No hay correcciones en ese texto: ¿es el bloque de «Copia per a Claude»?"); process.exitCode = 1; }
  else if (flag("--json")) console.log(JSON.stringify(items, null, 1));
  else items.forEach((it) => { // las líneas de continuación, sangradas como en el Markdown
    console.log(`\n${it.n}. ${it.url} «${short(it.original, 80)}»`); print(it, "   ");
    if (it.text != null) console.log(`   → «${short(it.text, 200).replace(/\n/g, "\n     ")}»`); if (it.note) console.log(`   Nota: ${it.note.replace(/\n/g, "\n     ")}`);
  });
  if (items.length) process.exitCode = code(items);
} else {
  const query = argv.filter((a, i) => !a.startsWith("--") && !WITH_VALUE.includes(argv[i - 1])).join(" ");
  if (!query) { console.error('Uso: node tools/find-text.mjs [--url /ruta/] "<texto tal como se ve en la web>"  |  --md <fichero|->  |  --selftest <casos.json>'); process.exitCode = 1; }
  else {
    const r = search(query, opt("--url", null));
    if (flag("--json")) console.log(JSON.stringify(r, null, 1)); else print(r);
    process.exitCode = code([r]);
  }
}
