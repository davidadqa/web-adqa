// QA de todo el sitio: construye, sirve y recorre todas las páginas.
// Informa de enlaces internos rotos (también anclas), errores de consola, overflow en móvil, JSON-LD inválido,
// nº de h1, longitud de title/description y reglas de marca (frases prohibidas, repeticiones).
//
// Uso: node tools/check.mjs [--prefix=/web-adqa/] [--json=informe.json]
import { mkdtemp, writeFile, rm, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { serve, inspect, chromium } from "./lib.mjs";

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const prefix = args.prefix || "/";
const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const out = await mkdtemp(join(tmpdir(), "adqa-check-"));

// Pendientes conocidos (fases posteriores): no cuentan como enlaces rotos.
const LATER = [/^\/recursos\//, /^\/casos-de-exito\/.+/, /^\/ca\//];
const BANNED = [
  [/primera empresa del Garraf|primera del Garraf/i, "«primera del Garraf» (decisión: eliminar)"],
  [/licencia propia/i, "«licencia propia» (decisión: no decirlo)"],
  [/partner (oficial )?de Microsoft|Microsoft Partner/i, "Microsoft como partner (decisión D4)"],
  [/soluciones (TIC )?globales/i, "cliché «soluciones globales»"],
  [/partner tecnológico de referencia|nos hace distintos/i, "cliché de marca"],
  [/el mejor servicio|líderes en|los mejores/i, "superlativo"],
  [/\bFortinet\b|\bFluke\b|\bCisco\b|\bUbiquiti\b|\bHPE\b/, "marca no autorizada (D9)"],
  [/más de 25 años|más de veinte años/i, "dato no canónico"],
  [/\d+[.,]?\d*\s?€/, "precio (D8: no publicar precios)"],
];

try {
  execFileSync("npx", ["@11ty/eleventy", "--quiet", `--output=${out}`, ...(prefix !== "/" ? [`--pathprefix=${prefix}`] : [])],
    { cwd: root, stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, ELEVENTY_ENV: prefix !== "/" ? "preview" : "production" } });
  const site = await serve(out, prefix);
  const browser = await chromium.launch();
  const pages = [];
  async function walk(dir, rel = "") {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory() && e.name !== "assets") await walk(join(dir, e.name), rel + e.name + "/");
      else if (e.name === "index.html") pages.push(rel);
    }
  }
  await walk(out);
  pages.sort();
  const report = { pages: [], brokenLinks: [], laterLinks: new Set(), problems: [] };
  const idsByPage = {};
  const linkList = [];
  for (const p of pages) {
    const d = await inspect(browser, site.base + p);
    const m = await inspect(browser, site.base + p, { width: 390, height: 844 });
    idsByPage["/" + p] = new Set(d.ids);
    const text = d.text;
    const count = (re) => (text.match(re) || []).length;
    const row = {
      page: "/" + p, status: d.status, h1: d.h1, title: d.title, titleLength: d.title.length, descLength: d.desc.length,
      jsonld: d.jsonld.join(","), consoleErrors: [...new Set([...d.errors, ...m.errors])], failed: d.failed,
      overflowMobile: m.overflowX, unico: count(/(?<!\p{L})únic[oa]s?(?!\p{L})/giu), ens: count(/\bENS\b/g), adqada: count(/respuesta ADQAda/gi),
      banned: BANNED.filter(([re]) => re.test(text)).map(([, why]) => why),
    };
    report.pages.push(row);
    for (const href of d.links) linkList.push({ from: "/" + p, href });
    if (row.h1 !== 1) report.problems.push(`${row.page}: ${row.h1} h1`);
    if (row.titleLength > 65) report.problems.push(`${row.page}: title de ${row.titleLength} caracteres`);
    if (row.descLength < 120 || row.descLength > 165) report.problems.push(`${row.page}: description de ${row.descLength} caracteres`);
    if (row.jsonld.includes("ERROR")) report.problems.push(`${row.page}: JSON-LD inválido`);
    if (row.consoleErrors.length) report.problems.push(`${row.page}: errores de consola ${row.consoleErrors.join(" | ")}`);
    if (row.overflowMobile > 0) report.problems.push(`${row.page}: overflow horizontal en móvil (${row.overflowMobile}px)`);
    if (row.unico > 1) report.problems.push(`${row.page}: «único/a» aparece ${row.unico} veces (máx. 1)`);
    if (row.adqada > 1) report.problems.push(`${row.page}: «la respuesta ADQAda» ${row.adqada} veces (máx. 1)`);
    for (const b of row.banned) report.problems.push(`${row.page}: ${b}`);
  }
  const origin = new URL(site.base).origin;
  for (const { from, href } of linkList) {
    if (!href.startsWith(origin)) continue;
    const u = new URL(href);
    let path = u.pathname.slice(prefix.length - 1);
    if (!path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path)) path += "/";
    if (/\.[a-z0-9]+$/i.test(path)) continue;
    if (LATER.some((re) => re.test(path)) && !idsByPage[path]) { report.laterLinks.add(path); continue; }
    if (!idsByPage[path]) { report.brokenLinks.push(`${from} → ${path}`); continue; }
    const frag = decodeURIComponent(u.hash.slice(1));
    if (frag && !idsByPage[path].has(frag)) report.brokenLinks.push(`${from} → ${path}#${frag} (ancla inexistente)`);
  }
  report.brokenLinks = [...new Set(report.brokenLinks)];
  report.laterLinks = [...report.laterLinks].sort();
  await browser.close();
  await site.close();
  const summary = {
    pages: report.pages.length,
    problems: report.problems,
    brokenLinks: report.brokenLinks,
    laterLinks: report.laterLinks.length,
  };
  if (args.json) await writeFile(args.json, JSON.stringify(report, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log("\nPor página:");
  for (const r of report.pages) console.log(`${r.page}  h1=${r.h1} title=${r.titleLength} desc=${r.descLength} único=${r.unico} ENS=${r.ens} ADQAda=${r.adqada} overflow=${r.overflowMobile}`);
} finally {
  await rm(out, { recursive: true, force: true });
}
