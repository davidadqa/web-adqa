// Mide la voz de las páginas («el ingeniero del café»): longitud de las frases, tuteo, primera persona
// del plural y fórmulas de registro burocrático o de folleto. No sustituye a leer el texto: señala dónde mirar.
//
// Uso: node tools/voice-check.mjs src/redes/index.njk src/recursos/articulos/cable-o-wifi.md [...]
//      node tools/voice-check.mjs --all            (todas las páginas)
// Construye en una carpeta temporal (sin tocar _site): con ficheros, SOLO esas páginas (como tools/preview.mjs,
// para que un error en otra página no rompa la medición); con --all, el sitio entero. Analiza el texto visible del <main>,
// sin cabecera, pie, migas ni bloque de contacto. Para cada página imprime las métricas y las frases más largas.
import { mkdtemp, rm, readFile, readdir, mkdir, cp, symlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve, relative, basename } from "node:path";
import { tmpdir } from "node:os";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const all = args.includes("--all");
const files = args.filter((a) => !a.startsWith("--"));
if (!all && !files.length) {
  console.error("Uso: node tools/voice-check.mjs src/<ruta>/index.njk src/recursos/articulos/<slug>.md ... | --all");
  process.exit(1);
}

// Objetivos de la guía de voz (veu A): frases de 8 a 18 palabras, tuteo natural, imágenes concretas.
const TARGET = { avg: 14, long: 12, tuPage: 12, tuBlog: 10 };
const FORMULAS = [
  /\bse recomienda\b/gi, /\bes recomendable\b/gi, /\bcabe (destacar|señalar)\b/gi, /\bes importante (destacar|señalar|tener en cuenta)\b/gi,
  /\ben este sentido\b/gi, /\basimismo\b/gi, /\bno obstante\b/gi, /\bpor otro lado\b/gi, /\bpor otra parte\b/gi,
  /\ben definitiva\b/gi, /\ba la hora de\b/gi, /\bde cara a\b/gi, /\bdicho esto\b/gi, /\bpermite(n)? (optimizar|garantizar|maximizar)\b/gi,
  /\bintegral(es)?\b/gi, /\bde primer nivel\b/gi, /\bde referencia\b/gi, /\bl[ií]der(es)?\b/gi, /\bexcelencia\b/gi, /\bsoluciones (tecnológicas )?globales\b/gi,
  /\bsinergias?\b/gi, /\b360\s?º\b/gi, /\bgarantiza(mos)?\b/gi, /\bóptim[oa]s?\b/gi, /\bpuntero[as]?\b/gi, /\bvanguardia\b/gi,
];
const TU = /\b(tú|tu|tus|te|ti|contigo|tienes|puedes|necesitas|quieres|sabes|eres|estás|haces|vas|notas|piensa|imagina|fíjate|cuéntanos|explícanos|escríbenos|llámanos|tuyo|tuya|tuyos|tuyas)\b/gi;
const NOS = /\b(nosotros|nuestro|nuestra|nuestros|nuestras|hacemos|llevamos|miramos|revisamos|instalamos|coordinamos|trabajamos|podemos|ayudamos|solemos|recomendamos|vemos|cuidamos|montamos|preparamos|seguimos|respondemos)\b/gi;

const out = await mkdtemp(join(tmpdir(), "adqa-voz-"));
const work = all ? root : await mkdtemp(join(tmpdir(), "adqa-voz-src-"));
try {
  if (!all) {
    for (const f of ["eleventy.config.js", "package.json"]) await cp(join(root, f), join(work, f));
    await symlink(join(root, "node_modules"), join(work, "node_modules"));
    await mkdir(join(work, "src"));
    for (const d of ["_data", "_includes"]) await cp(join(root, "src", d), join(work, "src", d), { recursive: true });
    await symlink(join(root, "src", "assets"), join(work, "src", "assets"));
    for (const p of files) {
      const rel = relative(root, resolve(root, p));
      await mkdir(dirname(join(work, rel)), { recursive: true });
      await cp(join(root, rel), join(work, rel));
      for (let d = dirname(rel); d.startsWith("src/"); d = dirname(d)) {
        for (const f of await readdir(join(root, d))) {
          if (f.endsWith(".11tydata.js") || f.endsWith(".11tydata.json")) await cp(join(root, d, f), join(work, d, f));
        }
      }
    }
  }
  execFileSync("npx", ["@11ty/eleventy", `--output=${out}`, "--quiet"], { cwd: work, stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, ELEVENTY_ENV: "preview" } });

  // Fichero fuente → página generada.
  const toUrl = (f) => {
    const rel = relative(join(root, "src"), resolve(root, f)).replace(/\\/g, "/");
    if (rel.startsWith("recursos/articulos/")) return `/recursos/${basename(rel, ".md")}/`;
    if (rel === "index.njk") return "/";
    return "/" + rel.replace(/index\.njk$/, "");
  };
  let urls = files.map(toUrl);
  if (all) {
    urls = [];
    const walk = async (d, u) => {
      for (const e of await readdir(d, { withFileTypes: true })) {
        if (e.isDirectory()) { if (e.name !== "assets") await walk(join(d, e.name), u + e.name + "/"); }
        else if (e.name === "index.html") urls.push(u);
      }
    };
    await walk(out, "/");
    urls.sort();
  }

  const rows = [];
  for (const url of urls) {
    let html;
    try { html = await readFile(join(out, url, "index.html"), "utf8"); }
    catch { console.log(`✗ ${url}: no se ha generado`); continue; }
    const isBlog = /^\/recursos\/[^/]+\/$/.test(url) && !/^\/recursos\/(ciberseguridad|redes|telecomunicaciones|cloud|soporte-it|web|workspace)\/$/.test(url);
    let main = (html.match(/<main[^>]*>([\s\S]*)<\/main>/) || [, html])[1];
    main = main
      .replace(/<(script|style|svg|nav)[\s\S]*?<\/\1>/g, " ")
      .replace(/<section[^>]*id="contacto"[\s\S]*?<\/section>/g, " ")
      // Blog: sin la columna lateral ni las tarjetas de artículos relacionados (son textos de otras páginas).
      .replace(/<aside class="art-aside"[\s\S]*?<\/aside>/g, " ")
      .replace(/<section[^>]*aria-labelledby="h-rel"[\s\S]*?<\/section>/g, " ")
      // Índice de /recursos/: la lista de todas las respuestas son los titulares de otras páginas.
      .replace(/<ul class="qa-list"[\s\S]*?<\/ul>/g, " ")
      .replace(/<!--[\s\S]*?-->/g, " ");
    const text = main
      .replace(/<\/(p|li|h[1-6]|dd|dt|td|th|blockquote|figcaption|summary)>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const paras = text.split("\n").map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.split(" ").length >= 6);
    const sents = paras.flatMap((p) => p.split(/(?<=[.!?:])\s+(?=[¿¡«A-ZÁÉÍÓÚÑ])/)).filter((s) => s.split(" ").length >= 4);
    const lens = sents.map((s) => s.split(" ").length);
    const words = paras.join(" ").split(/\s+/).length || 1;
    const avg = lens.reduce((a, b) => a + b, 0) / (lens.length || 1);
    const long = (100 * lens.filter((n) => n > 18).length) / (lens.length || 1);
    const tu = (1000 * (paras.join(" ").match(TU) || []).length) / words;
    const nos = (1000 * (paras.join(" ").match(NOS) || []).length) / words;
    const formulas = FORMULAS.flatMap((re) => paras.join(" ").match(re) || []);
    const tuTarget = isBlog ? TARGET.tuBlog : TARGET.tuPage;
    const flags = [];
    if (avg > TARGET.avg) flags.push(`media ${avg.toFixed(1)} palabras/frase (objetivo ≤ ${TARGET.avg})`);
    if (long > TARGET.long) flags.push(`${long.toFixed(0)}% de frases de más de 18 palabras (objetivo ≤ ${TARGET.long}%)`);
    if (tu < tuTarget) flags.push(`tuteo ${tu.toFixed(1)}/1000 palabras (objetivo ≥ ${tuTarget})`);
    if (formulas.length) flags.push(`fórmulas de folleto o burocráticas: ${[...new Set(formulas.map((f) => f.toLowerCase()))].join(", ")}`);
    rows.push({ url, sents: lens.length, avg: +avg.toFixed(1), long: Math.round(long), tu: +tu.toFixed(1), nos: +nos.toFixed(1), flags });
    console.log(`${flags.length ? "△" : "✓"} ${url}  (${lens.length} frases · media ${avg.toFixed(1)} · >18: ${long.toFixed(0)}% · tú ${tu.toFixed(1)}/1000 · nosotros ${nos.toFixed(1)}/1000)`);
    for (const f of flags) console.log(`  - ${f}`);
    if (!all) {
      const top = sents.map((s) => [s.split(" ").length, s]).filter(([n]) => n > 18).sort((a, b) => b[0] - a[0]).slice(0, 8);
      for (const [n, s] of top) console.log(`    · (${n}) ${s.slice(0, 240)}`);
    }
  }
  if (rows.length > 1) {
    const m = (k) => (rows.reduce((a, r) => a + r[k], 0) / rows.length).toFixed(1);
    console.log(`\nTotal: ${rows.length} páginas · media ${m("avg")} palabras/frase · >18: ${m("long")}% · tú ${m("tu")}/1000 · nosotros ${m("nos")}/1000 · con avisos: ${rows.filter((r) => r.flags.length).length}`);
  }
} finally {
  await rm(out, { recursive: true, force: true });
  if (!all) await rm(work, { recursive: true, force: true });
}
