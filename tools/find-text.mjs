#!/usr/bin/env node
// Busca en src/ dónde está un texto tal como se ve en la web (para aplicar las correcciones del modo corrección).
// Sin dependencias. Normaliza etiquetas HTML, énfasis y enlaces Markdown, entidades, escapes y concatenaciones JS,
// comillas tipográficas, guiones, mayúsculas, acentos y espacios (también textos partidos en varias líneas).
//
// Uso:
//   node tools/find-text.mjs "<texto renderizado>"     → fichero:línea y el fragmento del código fuente
//   node tools/find-text.mjs --md correcciones.md       → localiza cada «original» del Markdown que copia el modo corrección
//   cat correcciones.md | node tools/find-text.mjs --md -
// Opciones: --json (salida para máquinas) · --top N (candidatos parecidos, 5 por defecto) · --assets (incluye src/assets)
//           · --all (todas las coincidencias exactas; si no, las 6 mejores: primero la página, el bloque entero y la misma mayúscula)
// Salida: 0 si hay coincidencia exacta (con --md, en todas); 2 si alguna solo tiene candidatos parecidos; 1 si alguna no tiene nada.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (k) => argv.includes(k);
const opt = (k, d) => { const i = argv.indexOf(k); return i < 0 ? d : argv[i + 1]; };
const TOP = +opt("--top", 5);
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
  return { file: relative(ROOT, p), raw, text, map, vars, lines };
});
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
// ¿es el fuente propio de la página? (para ordenar: primero el fichero de la página, luego lo compartido)
const ownScore = (file, url) => {
  if (!url) return 0;
  const segs = url.split("/").filter(Boolean), last = segs[segs.length - 1] || "index";
  const rel = file.replace(/^src\//, "").replace(/\.\w+$/, "");
  if (rel === (segs.length ? segs.join("/") + "/index" : "index")) return 3;
  if (rel.endsWith("/" + last) || rel === last) return 2;
  return /^_includes|^_data/.test(rel) ? 1 : 0;
};

/* ---------- búsqueda ---------- */
function bigrams(s) { const m = new Map(); for (let i = 0; i < s.length - 1; i++) { const k = s.slice(i, i + 2); m.set(k, (m.get(k) || 0) + 1); } return m; }
function dice(a, bm, bn) { const am = bigrams(a); let inter = 0; for (const [k, v] of am) inter += Math.min(v, bm.get(k) || 0); return (2 * inter) / Math.max(1, a.length - 1 + bn); }
// ¿ocupa el texto un bloque entero del fuente (celda, <li>, comillas de YAML, línea) o es un trozo de una frase?
// Sirve para ordenar los textos cortos («Velocidad», «Recursos»), que aparecen en muchas frases.
const whole = (f, a, z) => {
  const cnt = f.raw.slice(z, z + 200).match(/^<[^<>]*\bdata-count=[^<>]*>[^<]*/); // una cifra con contador: el token entero
  let i = a - 1, j = z + (cnt ? cnt[0].length : 1);
  while (i >= 0 && /[ \t*_~]/.test(f.raw[i])) i--;
  while (j < f.raw.length && /[ \t*_~.]/.test(f.raw[j])) j++;
  return (i < 0 || /[>|"'\n#\-«]/.test(f.raw[i]) ? 1 : 0) + (j >= f.raw.length || /[<|"'\n»]/.test(f.raw[j]) ? 1 : 0);
};
function search(query, url) {
  const q = normalize(query).text, res = { query, exact: [], candidates: [], pieces: [] };
  // un solo carácter («4», la cifra de un .stat) solo se busca en los ficheros propios de la página
  const pool = q.length < 2 ? (url ? files.filter((f) => ownScore(f.file, url) >= 2) : []) : files;
  if (!q.length || !pool.length) return res;
  const first = (query.match(/[\p{L}\p{N}]/u) || [""])[0]; // misma mayúscula/minúscula inicial que en la web
  for (const f of pool) for (let i = f.text.indexOf(q); i >= 0; i = f.text.indexOf(q, i + 1)) {
    const a = f.map[i], z = f.map[i + q.length - 1], w = whole(f, a, z), cs = f.raw[a] === first ? 1 : 0;
    res.exact.push(hit(f, i, q.length, { own: ownScore(f.file, url), whole: w === 2, rank: ownScore(f.file, url) * 4 + w * 2 + cs }));
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
    const h = hit(c.f, c.s, Math.max(1, c.l), { score: Math.round(c.score * 100), own: ownScore(c.f.file, url) });
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
function print(r, indent = "") {
  if (r.exact.length) {
    // las mejores primero (la página, el bloque entero, la misma mayúscula); con muchas, solo las primeras (--json las da todas)
    const show = flag("--all") ? r.exact : r.exact.slice(0, Math.max(TOP, 6));
    show.forEach((h) => console.log(`${indent}✔ ${h.file}:${h.line}${h.endLine !== h.line ? "-" + h.endLine : ""}${h.own === 3 || h.own === 2 ? "  (fuente de la página)" : ""}${h.whole ? "  (bloque entero)" : ""}${h.vars ? `  · incluye {{ ${h.vars.join(" }}, {{ ")} }} → src/_data/site.js` : ""}\n${indent}    ${short(h.snippet, 220)}`));
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
if (flag("--md")) {
  const src = opt("--md"), md = !src || src === "-" ? readFileSync(0, "utf8") : readFileSync(src, "utf8");
  const items = parseMd(md).map((it) => ({ ...it, ...search(it.original, it.url) }));
  if (!items.length) { console.error("No hay correcciones en ese texto: ¿es el bloque de «Copia per a Claude»?"); process.exitCode = 1; }
  else if (flag("--json")) console.log(JSON.stringify(items, null, 1));
  else items.forEach((it) => { console.log(`\n${it.n}. ${it.url} «${short(it.original, 80)}»`); print(it, "   "); if (it.text != null) console.log(`   → «${short(it.text, 200)}»`); if (it.note) console.log(`   Nota: ${it.note}`); });
  if (items.length) process.exitCode = code(items);
} else {
  const query = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--top").join(" ");
  if (!query) { console.error('Uso: node tools/find-text.mjs "<texto tal como se ve en la web>"  |  --md <fichero|->'); process.exitCode = 1; }
  else {
    const r = search(query);
    if (flag("--json")) console.log(JSON.stringify(r, null, 1)); else print(r);
    process.exitCode = code([r]);
  }
}
