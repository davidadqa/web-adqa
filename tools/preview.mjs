// Construye en aislado SOLO las páginas indicadas (más plantillas, datos y assets compartidos),
// las sirve y hace capturas en escritorio (1440) y móvil (390). Sirve para trabajar en paralelo
// sin que el error de otra página rompa tu build.
//
// Uso: node tools/preview.mjs <carpeta-de-salida> src/redes/index.njk [src/redes/otra/index.njk ...]
// Imprime un JSON por página con errores de consola, overflow horizontal, nº de h1, JSON-LD y rutas de las capturas.
import { mkdtemp, mkdir, cp, symlink, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { serve, inspect, chromium } from "./lib.mjs";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const [outDir, ...pages] = process.argv.slice(2);
if (!outDir || !pages.length) {
  console.error("Uso: node tools/preview.mjs <carpeta-de-salida> src/<ruta>/index.njk ...");
  process.exit(1);
}
await mkdir(outDir, { recursive: true });
const work = await mkdtemp(join(tmpdir(), "adqa-preview-"));
try {
  for (const f of ["eleventy.config.js", "package.json"]) await cp(join(root, f), join(work, f));
  await symlink(join(root, "node_modules"), join(work, "node_modules"));
  await mkdir(join(work, "src"));
  for (const d of ["_data", "_includes"]) await cp(join(root, "src", d), join(work, "src", d), { recursive: true });
  await symlink(join(root, "src", "assets"), join(work, "src", "assets"));
  for (const p of pages) {
    const rel = p.replace(/^\.?\/?/, "");
    await mkdir(dirname(join(work, rel)), { recursive: true });
    await cp(join(root, rel), join(work, rel));
  }
  execFileSync("npx", ["@11ty/eleventy", "--quiet"], { cwd: work, stdio: ["ignore", "ignore", "inherit"] });
  const site = await serve(join(work, "_site"));
  const browser = await chromium.launch();
  for (const p of pages) {
    const urlPath = p.replace(/^\.?\/?src\//, "").replace(/index\.njk$/, "").replace(/\.njk$/, "/");
    const slug = urlPath.replace(/\//g, "_") || "home";
    const d = await inspect(browser, site.base + urlPath, { shot: join(outDir, `${slug}-desktop.png`) });
    const m = await inspect(browser, site.base + urlPath, { width: 390, height: 844, shot: join(outDir, `${slug}-mobile.png`) });
    console.log(JSON.stringify({
      page: "/" + urlPath, status: d.status, title: d.title, titleLength: d.title.length, descLength: d.desc.length,
      h1: d.h1, jsonld: d.jsonld, consoleErrors: [...new Set([...d.errors, ...m.errors])], failedRequests: d.failed,
      overflowX: { desktop: d.overflowX, mobile: m.overflowX },
      screenshots: [join(outDir, `${slug}-desktop.png`), join(outDir, `${slug}-mobile.png`)],
    }, null, 1));
  }
  await browser.close();
  await site.close();
} finally {
  await rm(work, { recursive: true, force: true });
}
