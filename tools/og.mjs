// Genera la imagen para compartir (Open Graph, 1200×630) de cada página: src/assets/og/<slug>.jpg.
// Construye el sitio en producción en una carpeta temporal, recorre todas las páginas, saca de cada una el H1,
// el área (primer segmento de la URL) y, en los artículos, la categoría, y pinta una plantilla HTML con Playwright.
// Con --icons genera, en cambio, los iconos de móvil y escritorio a partir de src/assets/favicon.svg.
//
// Uso: node tools/og.mjs                         todas las páginas (y borra las imágenes de páginas que ya no existen)
//      node tools/og.mjs --only=redes,recursos   solo las URL que empiezan por esos caminos ("home" = portada)
//      node tools/og.mjs --out=/tmp/og           escribe en otra carpeta (para probar sin tocar src/assets/og)
//      node tools/og.mjs --html=/tmp/og.html     guarda también la plantilla, para abrirla en el navegador
//      node tools/og.mjs --icons                 src/assets/icons/: favicon-32, apple-touch-icon (180),
//                                                icon-192, icon-512 e icon-maskable-512 (PNG)
//
// Slug: el camino de la URL con guiones (/redes/wifi-entornos-complejos/ → redes-wifi-entornos-complejos.jpg);
// la portada es «home». Junto a las imágenes escribe alt.json (URL → texto que se lee en la imagen), del que sale
// og:image:alt. El filtro ogImage de eleventy.config.js usa la imagen de la página si existe y, si no, /assets/og-adqa.jpg.
// Hay que volver a ejecutarlo cuando cambia un H1, se crea una página o se toca el diseño de la plantilla;
// y con --icons, cuando cambia favicon.svg.
//
// Variantes: portada (el lema con la tecla «una» y la órbita), servicio y categoría del blog (H1 a la izquierda e
// ilustración del área a la derecha), artículo («Respuestas · <categoría>», minutos de lectura y la ilustración de la
// categoría arriba a la derecha), empresa (órbita), certificados y legal (una hoja dibujada con su sello) e índice de
// /recursos/, «Respuestas» (las baldosas de las categorías). JPEG de calidad 82; si pasa de 100 KB, baja la calidad.
import { mkdtemp, mkdir, readFile, readdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL, fileURLToPath } from "node:url";
import { chromium } from "./lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "src", "assets");
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const outDir = resolve(args.out || join(assets, "og"));
const only = args.only ? args.only.split(",").map((s) => s.replace(/^\/|\/$/g, "")) : null;

const site = (await import(pathToFileURL(join(root, "src/_data/site.js")))).default;
const nav = (await import(pathToFileURL(join(root, "src/_data/nav.js")))).default;
const blog = (await import(pathToFileURL(join(root, "src/_data/blog.js")))).default;

// ---------- Textos por área ----------
const AREA = {
  ciberseguridad: "Ciberseguridad",
  redes: "Redes y WiFi",
  telecomunicaciones: "Telecomunicaciones",
  "sistemas-cloud": "Sistemas y cloud",
  "soporte-it": "Soporte IT",
  "diseno-programacion-web": "Diseño web y software",
  "desarrollo-software-medida": "Web y software",
  "google-workspace": "Google Workspace",
  "microsoft-365": "Microsoft 365",
};
// Subpáginas de servicio: «Área · Subservicio». Por defecto, la etiqueta del menú; aquí, las que no encajan.
const SUB = {
  "/desarrollo-software-medida/": "Web y software · Software a medida",
  "/diseno-programacion-web/mantenimiento-web-para-empresas/": "Diseño web · Mantenimiento web",
};
const navLabel = (url) => {
  for (const g of nav.groups) for (const l of g.links) if (l.url === url) return l.label;
  return null;
};
// Páginas de empresa y legales: eyebrow y, en certificados y legales, el sello de la hoja dibujada.
const COMPANY = {
  "quienes-somos": { eyebrow: "Quiénes somos" },
  contacto: { eyebrow: "Contacto", foot: `${site.phone} · ${site.email}` },
  "trabaja-con-nosotros": { eyebrow: "Trabaja con nosotros" },
  "casos-de-exito": { eyebrow: "Casos de éxito" },
  "certificado-bsi": { eyebrow: "Certificaciones · Calidad", icon: "award" },
  "certificado-ens": { eyebrow: "Certificaciones · Seguridad", icon: "award" },
  "aviso-legal": { eyebrow: "Información legal", icon: "file", kind: "legal" },
  "politica-de-privacidad": { eyebrow: "Información legal", icon: "lock", kind: "legal" },
  "politica-de-seguridad": { eyebrow: "Información legal", icon: "shield", kind: "legal" },
};
// Categoría del blog → ilustración del área.
const CAT_ART = {
  ciberseguridad: "ciberseguridad", redes: "redes", telecomunicaciones: "telecomunicaciones", cloud: "sistemas-cloud",
  "soporte-it": "soporte-it", web: "diseno-programacion-web", workspace: "google-workspace",
};

// ---------- Ilustraciones de área ----------
// Las de src/assets/art/heroes-<área>.svg rodean el H1 centrado del hero (1344×576): una mitad a cada lado, unidas
// por arriba. Aquí se recortan las dos mitades (x0, y0, x1, y1 en coordenadas del SVG) y se juntan, de modo que los
// cables que cruzaban el hueco del titular empalman solos. «col» las apila en vez de ponerlas lado a lado.
const ART = {
  // Las tres capas acababan en x=256.5 y x=1088.5, a 12 unidades de cada corte, y al juntar las mitades quedaba una
  // muesca arriba y abajo. Aquí se alargan hasta el corte para que cada capa se cierre.
  ciberseguridad: { pieces: [[48, 80, 268, 560], [1076, 80, 1296, 560]],
    patch: [["M256.5 96.5H", "M268.5 96.5H"], ["104.5 544.5H256.5", "104.5 544.5H268.5"],
      ["M256.5 128.5H", "M268.5 128.5H"], ["158.5 512.5H256.5", "158.5 512.5H268.5"],
      ["M256.5 160.5H", "M268.5 160.5H"], ["214.5 480.5H256.5", "214.5 480.5H268.5"],
      ["M1088.5 96.5H", "M1075.5 96.5H"], ["1240.5 544.5H1088.5", "1240.5 544.5H1075.5"],
      ["M1088.5 128.5H", "M1075.5 128.5H"], ["1186.5 512.5H1088.5", "1186.5 512.5H1075.5"],
      ["M1088.5 160.5H", "M1075.5 160.5H"], ["1130.5 480.5H1088.5", "1130.5 480.5H1075.5"]] },
  redes: { pieces: [[24, 112, 248, 464], [1104, 112, 1320, 464]] },
  // El arco antena → edificio cruzaba el hueco por arriba; aquí se rehace para que empalme sobre el corte.
  telecomunicaciones: { pieces: [[24, 128, 236, 528], [1108, 128, 1320, 528]],
    patch: [["M1250.5 212.5Q690.5 -24 132.5 250.5", "M1250.5 212.5Q1222.5 150.5 1108.5 150.5H236.5Q160.5 150.5 132.5 250.5"]] },
  "sistemas-cloud": { pieces: [[48, 112, 216, 528], [1088, 112, 1320, 528]] },
  "soporte-it": { pieces: [[40, 112, 272, 400], [1072, 112, 1272, 400]] },
  "diseno-programacion-web": { pieces: [[48, 112, 264, 432], [1136, 112, 1264, 432]] },
  // En estas dos, el cable de arriba pasa a discontinuo entre x=256.5 y x=1088.5 (el puente sobre el titular): al
  // juntar las mitades quedaba un trocito discontinuo en el empalme. Se alarga el tramo continuo hasta el corte.
  "desarrollo-software-medida": { pieces: [[48, 112, 264, 376], [1080, 112, 1248, 376]],
    patch: [["V128.5H256.5", "V128.5H264.5"], ["M1088.5 128.5H1192.5", "M1079.5 128.5H1192.5"]] },
  "google-workspace": { pieces: [[44, 112, 264, 448], [1080, 112, 1296, 448]],
    patch: [["V128.5H256.5", "V128.5H264.5"], ["M1088.5 128.5H1216.5", "M1079.5 128.5H1216.5"]] },
  "microsoft-365": { col: true, pieces: [[40, 184, 240, 336], [1096, 248, 1336, 328]] },
};

// Páginas legales y certificados: una hoja dibujada a línea, con un sello en rosa (el único elemento rosa de la escena).
const SEAL = {
  file: '<path class="a" d="M199.5 312.5l6 6 12-12"/>',
  lock: '<rect class="a" x="198.5" y="309.5" width="20" height="15" rx="3"/><path class="a" d="M202.5 309.5v-5a6 6 0 0 1 12 0v5"/>',
  shield: '<path class="a" d="M208.5 297.5l-11 4.5v8c0 6.8 4.7 12.2 11 14 6.3-1.8 11-7.2 11-14v-8z"/><path class="a" d="M204 311.5l3 3 6-6"/>',
  award: '<circle class="a" cx="208.5" cy="309.5" r="9"/><path class="a" d="M203 317l-2.5 11 8-4.5 8 4.5-2.5-11"/>',
};
const docArt = (seal) => `<path class="t" d="M48.5 32.5H216.5L256.5 72.5V368.5H48.5Z"/><path class="t" d="M216.5 32.5V72.5H256.5"/>
<path class="t" d="M80.5 104.5H176.5"/><path class="l" d="M80.5 136.5H224.5M80.5 152.5H224.5M80.5 168.5H192.5M80.5 200.5H224.5M80.5 216.5H208.5M80.5 232.5H224.5M80.5 264.5H224.5M80.5 280.5H160.5"/>
<path class="t2" d="M80.5 334.5H168.5"/><circle class="rg" cx="208.5" cy="312.5" r="26"/><circle class="t" cx="208.5" cy="312.5" r="26"/>${SEAL[seal]}
<path class="l" d="M16.5 32.5V368.5M10.5 32.5H22.5M10.5 368.5H22.5"/><path class="l" d="M48.5 392.5H256.5M48.5 386.5V398.5M256.5 386.5V398.5"/>`;
for (const k of Object.keys(SEAL)) ART["doc-" + k] = { pieces: [[0, 16, 272, 408]], svg: docArt(k) };

// ---------- Lectura del HTML construido ----------
// Entidades: numéricas (decimales y hexadecimales) y las con nombre habituales. &nbsp; se queda como espacio
// irrompible (si la web lo pone, es para que esas palabras no se separen); &shy; desaparece.
const ENT = { nbsp: "\u00A0", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", laquo: "«", raquo: "»",
  hellip: "…", ndash: "–", mdash: "—", iexcl: "¡", iquest: "¿", middot: "·", euro: "€", shy: "" };
// …y las letras acentuadas por su nombre (&aacute;, &ntilde;, &Uuml;, &ccedil;…).
for (const [suf, mark] of [["acute", "\u0301"], ["grave", "\u0300"], ["uml", "\u0308"], ["tilde", "\u0303"], ["cedil", "\u0327"]])
  for (const l of "aeiouncAEIOUNC") ENT[l + suf] = (l + mark).normalize("NFC");
const decode = (s) => s.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] !== "#" ? (ENT[e] ?? ENT[e.toLowerCase()] ?? m)
  : String.fromCodePoint(/^#x/i.test(e) ? parseInt(e.slice(2), 16) : +e.slice(1)));
const VOID = new Set(["br", "img", "wbr", "hr", "input", "meta", "link", "source"]);
// H1 → trozos [{t, a (acento), br}] sin HTML. El acento (cualquier elemento con la clase «accent», o <em>) se pinta
// en rosa, como en la web, aunque lleve otras etiquetas dentro (palabras envueltas en <span>, por ejemplo). El texto
// oculto a la vista (sr-only, visually-hidden, aria-hidden) no se pinta.
function h1Parts(html) {
  const parts = [], stack = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-z][\w-]*)([^>]*)>|([^<]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    if (m[4] != null) {
      if (stack.some((s) => s.hidden)) continue;
      const t = decode(m[4]), a = stack.some((s) => s.accent), last = parts.at(-1);
      if (last && !last.br && last.a === a) last.t += t; else if (t) parts.push({ t, a });
      continue;
    }
    if (!m[2]) continue; // comentario
    const name = m[2].toLowerCase(), attrs = m[3] || "";
    if (name === "br") { parts.push({ br: true }); continue; }
    if (VOID.has(name) || /\/\s*$/.test(attrs)) continue;
    if (m[1]) { const i = stack.map((s) => s.name).lastIndexOf(name); if (i >= 0) stack.length = i; continue; }
    const cls = (attrs.match(/\bclass\s*=\s*["']([^"']*)["']/i) || [])[1] || "";
    stack.push({ name, accent: name === "em" || /(^|\s)accent(\s|$)/.test(cls),
      hidden: /(^|\s)(sr-only|visually-hidden)(\s|$)/.test(cls) || /\baria-hidden\s*=\s*["']true["']/i.test(attrs) });
  }
  return parts;
}
const plainText = (parts) => parts.map((p) => (p.br || p.nl ? " " : p.t)).join("").replace(/\s+/g, " ").trim();

function describe(url, html) {
  const area = url.split("/")[1] || "home";
  const cat = (html.match(/<body[^>]*\sdata-cat="([^"]+)"/) || [])[1];
  const h1 = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "";
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "").replace(/\s*\|\s*ADQA$/, "").trim();
  let parts = h1Parts(h1);
  if (!plainText(parts)) parts = [{ t: title || site.name }]; // sin H1 (o vacío): el título de la página
  const d = { url, slug: url.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home", area, parts, text: plainText(parts) };
  const mins = (html.match(/(\d+) min de lectura/) || [])[1];
  const article = (c) => {
    let art = c && CAT_ART[c.slug];
    if (c?.slug === "workspace" && /Microsoft 365/.test(d.text) && !/Google/.test(d.text)) art = "microsoft-365";
    if (c?.slug === "web" && /software/i.test(d.text)) art = "desarrollo-software-medida";
    return { kind: "article", eyebrow: c ? `Respuestas · ${c.name}` : "Respuestas", art, foot: mins ? `${mins} min de lectura` : "Respuestas" };
  };

  if (area === "home") {
    // El lema de la web, con «teclas» en rosa y «una» como la tecla del pie (si el lema cambia de forma, tal cual).
    const m = site.claimFull.match(/^(.*?)\bteclas\b(.*?)\buna\.?$/);
    Object.assign(d, { kind: "home", eyebrow: "Informática · Telecom · Ciberseguridad", deco: "orbit",
      parts: !m ? [{ t: site.claimFull }] : [{ t: m[1] }, { t: "teclas", a: true }, { nl: true },
        ...m[2].trim().replace(/(tengas) /, "$1\n").split("\n").flatMap((t, i) => (i ? [{ nl: true }, { t }] : [{ t: " " + t }])),
        { t: " " }, { t: "una", key: true }, { t: "." }],
      foot: "We make I.T. better" });
  } else if (AREA[area]) {
    const sub = url.split("/").filter(Boolean).length > 1;
    const eyebrow = SUB[url] || [AREA[area], sub && navLabel(url)].filter(Boolean).join(" · ");
    Object.assign(d, { kind: "service", eyebrow, art: area, foot: site.claim });
  } else if (area === "recursos") {
    const seg = url.split("/").filter(Boolean);
    const c = blog.bySlug[cat] || null, catPage = !cat && seg.length === 2 && blog.bySlug[seg[1]];
    if (cat) Object.assign(d, article(c)); // artículo (la categoría la marca <body data-cat>)
    else if (catPage) Object.assign(d, { kind: "service", eyebrow: `Respuestas · ${catPage.name}`, art: CAT_ART[catPage.slug], foot: "Preguntas y respuestas" });
    else if (seg.length === 1) Object.assign(d, { kind: "blog", eyebrow: "Respuestas", deco: "tiles", foot: "Respuestas prácticas para empresas",
      tiles: blog.categories.map((x) => x.icon.replace(/^i-/, "")) });
    else Object.assign(d, article(null)); // un artículo sin categoría reconocible
  } else {
    const c = COMPANY[area] || { eyebrow: title };
    Object.assign(d, { kind: c.kind || "company", eyebrow: c.eyebrow, art: c.icon ? "doc-" + c.icon : undefined,
      deco: c.icon ? undefined : "orbit", foot: c.foot || (c.kind === "legal" ? site.legalName : site.claim) });
  }
  d.alt = plainText(d.parts) || title; // lo que se lee en la imagen (en la portada, el lema)
  return d;
}

// ---------- Plantilla ----------
const warn = [];
const sprite = await readFile(join(root, "src/_includes/partials/sprite.njk"), "utf8");
const icons = Object.fromEntries([...sprite.matchAll(/<symbol id="i-([\w-]+)" viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/symbol>/g)]
  .map((m) => [m[1], { vb: m[2], body: m[3] }]));
const arts = {};
for (const f of await readdir(join(assets, "art"))) {
  const m = f.match(/^heroes-(.+)\.svg$/);
  if (m) arts[m[1]] = (await readFile(join(assets, "art", f), "utf8")).replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "");
}
// Retoques de las ilustraciones (ART[*].patch). Si el SVG de origen cambia y un retoque ya no encaja, se avisa.
for (const [k, def] of Object.entries(ART)) for (const [a, b] of def.patch || []) {
  if (arts[k]?.includes(a)) arts[k] = arts[k].replace(a, b);
  else warn.push(`heroes-${k}.svg: el retoque «${a.slice(0, 40)}…» ya no encaja; revisa la ilustración`);
}
// Figtree local: las mismas caras que declara site.css (con su unicode-range) y, si no se encuentran, todos los
// figtree-*.woff2 de src/assets/fonts. Si no hay ninguna, se para: sin la tipografía de la web no hay imagen.
const font = (f) => pathToFileURL(join(assets, "fonts", f)).href;
const css = await readFile(join(assets, "site.css"), "utf8");
let faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, b]) => [
  (b.match(/src:\s*url\(\s*["']?fonts\/([^)"'\s]+)["']?\s*\)/) || [])[1], (b.match(/unicode-range:\s*([^;}]+)/) || [])[1],
  /font-family:\s*["']?Figtree/i.test(b)]).filter(([f, , fig]) => fig && f && existsSync(join(assets, "fonts", f)));
if (!faces.length) faces = (await readdir(join(assets, "fonts"))).filter((f) => /^figtree.*\.woff2$/i.test(f)).map((f) => [f]);
if (!faces.length) throw new Error("No encuentro Figtree (src/assets/fonts/figtree-*.woff2)");

const TEMPLATE = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
${faces.map(([f, r]) => `@font-face{font-family:"Figtree";font-weight:300 900;src:url(${font(f)}) format("woff2")${r ? `;unicode-range:${r.trim()}` : ""}}`).join("\n")}
:root{--pink:#E32772;--pink-50:#FCE9F1;--ink:#242424;--gray:#444;--muted:#6b6b6b;--line:#e7e5e4;--line-2:#d6d3d1;--bg:#FAFAF9;
  --c:#cdc8c4;--sw:2.25px}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;overflow:hidden;background:var(--bg)}
body{font-family:"Figtree",sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
#c{position:relative;width:1200px;height:630px;overflow:hidden;background:var(--bg)}
/* El plano: cuadrícula de 64 px centrada (marcas en sus cruces) que se desvanece hacia el texto. */
.grid{position:absolute;inset:0;
  background:linear-gradient(90deg,var(--line) 1.5px,transparent 0) 24px 0/64px 64px,linear-gradient(var(--line) 1.5px,transparent 0) 0 27px/64px 64px;
  -webkit-mask-image:radial-gradient(ellipse 62% 88% at 82% 30%,#000 25%,rgba(0,0,0,.35) 62%,transparent 92%)}
.glow{position:absolute;width:760px;height:760px;right:-260px;top:-300px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(227,39,114,.075),rgba(227,39,114,.03) 55%,transparent)}
.reg{position:absolute;inset:0;width:1200px;height:630px;fill:none;stroke:var(--line-2);stroke-width:2;stroke-linecap:round}
.logo{position:absolute;left:88px;top:58px;height:34px}
/* Texto */
.txt{position:absolute;left:88px;width:var(--tw,1024px);display:flex;flex-direction:column;align-items:flex-start}
.eb{display:inline-flex;align-items:center;gap:14px;font-size:23px;font-weight:600;letter-spacing:.01em;color:var(--gray);
  padding:9px 22px 9px 15px;border:2px solid var(--line);border-radius:999px;background:#fff;white-space:nowrap;max-width:min(100%,720px)}
.eb span{min-width:0;overflow:hidden;text-overflow:ellipsis}
.eb::before{content:"";width:11px;height:11px;border-radius:50%;background:var(--pink);box-shadow:0 0 0 6px var(--pink-50)}
h1{margin-top:26px;font-weight:600;letter-spacing:-.035em;line-height:1.07;text-wrap:balance;hyphens:none;overflow-wrap:normal;word-break:normal}
h1 .a{color:var(--pink)}
.key{display:inline-block;font-size:.8em;line-height:1;padding:.16em .4em .24em;margin-left:.04em;border-radius:.26em;color:#fff;
  background:linear-gradient(#2c2c2c,#1d1d1d);border:1px solid #3d3d3d;box-shadow:0 .14em 0 #070707,inset 0 1px 0 rgba(255,255,255,.09);
  transform:translateY(-.08em);letter-spacing:-.02em}
/* Franja inferior: el filete, el señal que llega al nodo y la dirección. */
.strip{position:absolute;left:88px;right:88px;top:539px;height:64px;display:flex;align-items:center;gap:24px;
  font-size:21px;font-weight:500;color:var(--muted);letter-spacing:.005em}
.strip::before{content:"";position:absolute;left:0;right:0;top:-1px;height:2px;background:var(--line)}
.strip .sig{position:absolute;right:0;top:-1px;width:180px;height:2px;background:linear-gradient(90deg,transparent,rgba(227,39,114,.55) 70%,var(--pink))}
.strip .node{position:absolute;right:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:var(--pink);box-shadow:0 0 0 5px var(--pink-50)}
.strip .url{margin-left:auto;font-weight:600;color:var(--ink);font-size:22px;letter-spacing:.01em}
/* Ilustración del área */
.art{position:absolute;display:flex;align-items:center;justify-content:center}
.art.col{flex-direction:column;gap:calc(var(--s)*40px)}
.art.corner{justify-content:flex-end;align-items:flex-start}
.art svg{display:block;overflow:hidden;fill:none;stroke-linecap:round;stroke-linejoin:round}
.art :is(.t,.t2,.l,.d,.u){stroke:var(--c)}
.art .t{stroke-width:calc(var(--k)*var(--sw))}
.art .t2{stroke-width:calc(var(--k)*1.6px);stroke-dasharray:calc(var(--k)*5px) calc(var(--k)*7px)}
.art .l{stroke-width:calc(var(--k)*1.6px)}
.art .d{stroke-width:calc(var(--k)*3.5px);stroke-dasharray:0 var(--sp,24px)}
.art .u{stroke-width:6;stroke-dasharray:1 15;stroke-linecap:butt}
.art .n{fill:#fff;stroke:var(--c);stroke-width:calc(var(--k)*var(--sw))}
.art .a{stroke:var(--pink);stroke-width:calc(var(--k)*var(--sw))}
.art .af{fill:var(--pink)}
.art .fl{fill:var(--c)}
.art :is(.hl,.rg){fill:var(--pink-50)}
.art .w{stroke:var(--ink);opacity:.22}
.art .ckc{fill:#fff;stroke:rgba(227,39,114,.3);stroke-width:calc(var(--k)*var(--sw))}
.art .led{fill:var(--muted)}
.art .led.pk{fill:var(--pink)}
.art .rb{stroke:var(--pink)}
.art .cur{stroke:var(--ink);stroke-width:calc(var(--k)*var(--sw))}
.art .s{stroke:none}
.art .sig{fill:none;stroke:var(--pink)}
.art .sig.k1{stroke-width:calc(var(--k)*var(--sw));stroke-opacity:.25}
.art .sig.k2{stroke-width:calc(var(--k)*var(--sw));stroke-opacity:.55}
.art .sig.k3{stroke-width:calc(var(--k)*8px)}
/* Órbita (empresa y portada): un solo núcleo con todo alrededor. */
.orbit{position:absolute;inset:0;width:1200px;height:630px;fill:none;stroke-linecap:round}
.orbit .r{stroke:var(--c);stroke-width:var(--sw)}
.orbit .r2{stroke:var(--c);stroke-width:1.6;stroke-dasharray:5 7}
.orbit .n{fill:#fff;stroke:var(--c);stroke-width:var(--sw)}
.orbit .core{fill:var(--pink)}
.orbit .halo{fill:var(--pink-50)}
/* Baldosas con icono */
.tiles{position:absolute;display:flex;gap:14px}
.tile{width:var(--ts,84px);height:var(--ts,84px);border-radius:20px;display:grid;place-items:center;background:#fff;border:2px solid var(--line);color:var(--gray)}
.tile svg{width:46%;height:46%}
.tile.pk{background:var(--pink-50);border-color:#f6d3e2;color:var(--pink)}
</style></head><body><div id="c"></div></body></html>`;

// Pinta una página dentro de #c. Corre en el navegador.
async function paint(d, ctx) {
  const { arts, icons, ART, logo } = ctx;
  const side = d.art && d.kind !== "article"; // texto a la izquierda e ilustración a la derecha
  const c = document.getElementById("c");
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const icon = (n, sw = 1.8) => `<svg viewBox="${icons[n].vb}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${icons[n].body}</svg>`;
  c.innerHTML = "";
  c.dataset.kind = d.kind;
  c.append(el("div", "grid"), el("div", "glow"));
  // Marcas de registro: L de 18 px en las cuatro esquinas del pliego (cruces de la cuadrícula).
  const L = 18, X0 = 24, Y0 = 27, X1 = 1176, Y1 = 603;
  c.insertAdjacentHTML("beforeend", `<svg class="reg" viewBox="0 0 1200 630"><path d="M${X0} ${Y0 + L}V${Y0}H${X0 + L}M${X1 - L} ${Y0}H${X1}V${Y0 + L}M${X1} ${Y1 - L}V${Y1}H${X1 - L}M${X0 + L} ${Y1}H${X0}V${Y1 - L}"/></svg>`);
  const img = el("img", "logo"); img.src = logo; img.alt = ""; c.append(img);

  // Texto: eyebrow + H1.
  const txt = el("div", "txt");
  const eb = el("span", "eb"), ebt = el("span"); ebt.textContent = d.eyebrow || ""; eb.append(ebt); txt.append(eb);
  if (!d.eyebrow) eb.style.display = "none";
  const h1 = el("h1");
  // Ortotipografía del titular (solo en la imagen; el texto no cambia): las palabras de una letra (a, e, o, u, y)
  // no se quedan al final de la línea, un número va con la palabra de delante («Microsoft 365», «Cat 6A»,
  // «ISO 9001»), «Google Workspace» y «por qué» no se separan, y las palabras con guion («oficina-datacenter») no se
  // parten por el guion.
  const tie = (t) => t.replace(/(?<=^|[\s(¿¡«"])([aeouyAEOUY])\s+(?=\S)/g, "$1\u00A0")
    .replace(/(?<=\S)\s+(?=\d)/g, "\u00A0").replace(/\bGoogle\s+Workspace\b|\bpor\s+qué(?!\p{L})/gu, (m) => m.replace(/\s+/, "\u00A0"));
  const words = (t, into) => tie(t).split(/(\S+-\S+)/).forEach((w, i) => {
    if (!(i % 2)) return w && into.append(w);
    const n = el("span"); n.style.whiteSpace = "nowrap"; n.textContent = w; into.append(n);
  });
  for (const p of d.parts) {
    if (p.br) { h1.append(" "); continue; }
    if (p.nl) { h1.append(el("br")); continue; }
    if (p.a || p.key) { const s = el(p.key ? "kbd" : "span", p.key ? "key" : "a"); words(p.t, s); h1.append(s); }
    else words(p.t, h1);
  }
  txt.append(h1);
  c.append(txt);

  // Franja inferior.
  const strip = el("div", "strip");
  const left = el("span"); left.textContent = d.foot || ""; strip.append(left, el("i", "sig"), el("i", "node"));
  const url = el("span", "url"); url.textContent = "adqa.com"; strip.append(url);
  c.append(strip);
  // La tipografía de la web o nada: se piden las caras que usa el texto y se comprueba que han cargado.
  const loaded = (await Promise.all(["600 72px", "600 23px", "500 21px"].map((f) => document.fonts.load(`${f} "Figtree"`, c.textContent)))).flat();
  await document.fonts.ready;
  if (!loaded.length || !document.fonts.check(`600 72px "Figtree"`, c.textContent)) throw new Error("Figtree no ha cargado");

  // Ajuste del H1: el tamaño más grande (72 → 56 px) que cabe en 3 líneas sin partir palabras. Con ilustración,
  // la columna de texto puede ensancharse (y la ilustración, encoger) antes de bajar de 56 px.
  const ZT = 108, ZB = 515; // zona útil entre el logo y el filete
  const lines = () => Math.round(h1.getBoundingClientRect().height / (parseFloat(h1.style.fontSize) * 1.07));
  const fits = (w) => { txt.style.setProperty("--tw", w + "px"); return h1.scrollWidth <= w + 1 && lines() <= 3; };
  const widths = side ? [600, 640, 680, 720, 760, 800] : d.deco === "orbit" ? [860, 900] : [1024];
  let size = 72, w = widths[0], ok = false;
  const sizes = [72, 70, 68, 66, 64, 62, 60, 58, 56];
  outer: for (const ww of widths) for (const s of sizes) {
    if (ww > widths[0] && s > 64) continue; // ensanchar solo si a 64 px no cabe
    h1.style.fontSize = s + "px";
    if (fits(ww)) { size = s; w = ww; ok = true; break outer; }
  }
  if (!ok) for (const s of [54, 52, 50, 48]) { h1.style.fontSize = s + "px"; size = s; w = widths.at(-1); if (fits(w)) { ok = true; break; } }
  // Lo que ocupa de verdad el texto (text-wrap: balance deja las líneas más cortas que la columna).
  const n = lines();
  const rg = document.createRange(); rg.selectNodeContents(h1);
  const used = Math.ceil(Math.max(eb.getBoundingClientRect().right, ...[...rg.getClientRects()].map((r) => r.right))) - 88;
  const th = txt.getBoundingClientRect().height;
  // Posición vertical: centrado en la zona útil con ilustración al lado; si no, apoyado abajo (la cartela del plano).
  const top = side ? Math.round(ZT + (ZB - ZT - th) / 2) : Math.round(ZB - th);
  txt.style.top = top + "px";

  // Ilustración: a la derecha del texto (servicios, categorías, legales) o arriba a la derecha (artículos).
  if (d.art) {
    const def = ART[d.art];
    // En los artículos, la esquina libre llega hasta la altura del H1 si el eyebrow no ocupa ese ancho.
    const h1Top = top + h1.offsetTop;
    const box = side ? { x0: 88 + used + 64, x1: 1112, y0: ZT, y1: ZB + 8 }
      : { x0: Math.max(640, Math.ceil(eb.getBoundingClientRect().right) + 64), x1: 1112, y0: 54, y1: h1Top - 26 };
    const col = def.col && side; // apiladas solo en la columna derecha; en la esquina, siempre en fila
    const bw = box.x1 - box.x0, bh = box.y1 - box.y0;
    const ws = def.pieces.map((p) => p[2] - p[0]), hs = def.pieces.map((p) => p[3] - p[1]);
    const gap = 40;
    const tw = col ? Math.max(...ws) : ws.reduce((a, b) => a + b, 0);
    const th2 = col ? hs.reduce((a, b) => a + b, 0) + gap * (hs.length - 1) : Math.max(...hs);
    const s = Math.min(1, bw / tw, bh / th2);
    const a = el("div", "art" + (col ? " col" : "") + (side ? "" : " corner"));
    a.style.cssText = `left:${box.x0}px;top:${box.y0}px;width:${bw}px;height:${bh}px;--k:${1 / s};--s:${s}`;
    for (const [x0, y0, x1, y1] of def.pieces) {
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
      svg.setAttribute("width", (x1 - x0) * s); svg.setAttribute("height", (y1 - y0) * s);
      svg.innerHTML = def.svg || arts[d.art];
      a.append(svg);
    }
    c.append(a);
    const gl = c.querySelector(".glow");
    gl.style.left = (box.x0 + box.x1) / 2 - 380 + "px"; gl.style.top = (box.y0 + box.y1) / 2 - 380 + "px";
    // El señal, quieto: cola y cabeza sobre el primer camino .s, cerca de su final y en un tramo visible.
    const svgs = [...a.querySelectorAll(":scope > svg")];
    const path = svgs[0].querySelector(".s");
    if (path) {
      const len = path.getTotalLength(), m = 10;
      const vis = (q) => def.pieces.some(([x0, y0, x1, y1]) => q.x >= x0 + m && q.x <= x1 - m && q.y >= y0 + m && q.y <= y1 - m);
      let at = null;
      for (let l = len - 18; l > 70; l -= 3) if (vis(path.getPointAtLength(l)) && vis(path.getPointAtLength(l - 70))) { at = l; break; }
      if (at != null) for (const svg of svgs) {
        const p = svg.querySelector(".s");
        for (const [k, dash] of [["k1", 110], ["k2", 40], ["k3", 0]]) {
          const q = p.cloneNode();
          q.setAttribute("class", "sig " + k);
          q.style.strokeDasharray = `${dash} ${len + 400}`;
          q.style.strokeDashoffset = String(-(at - dash));
          svg.append(q);
        }
      }
    }
  }

  // Órbita: anillos alrededor de un núcleo rosa, recortados por la esquina superior derecha.
  if (d.deco === "orbit") {
    const cx = 1112, cy = 91;
    const ring = (r, cls) => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
    const at = (r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
    const node = (r, deg, rr = 7) => { const [x, y] = at(r, deg); return `<circle class="n" cx="${x}" cy="${y}" r="${rr}"/>`; };
    c.insertAdjacentHTML("beforeend", `<svg class="orbit" viewBox="0 0 1200 630">
      ${ring(64, "r")}${ring(128, "r2")}${ring(192, "r")}${ring(256, "r2")}
      ${node(64, 135)}${node(128, 100)}${node(128, 168)}${node(192, 122)}${node(192, 196)}${node(256, 146)}
      <circle class="halo" cx="${cx}" cy="${cy}" r="15"/><circle class="core" cx="${cx}" cy="${cy}" r="8"/></svg>`);
  }

  // Baldosas: una (certificados, legal, artículos) o las de todas las categorías (índice de recursos).
  if (d.deco === "tiles") {
    const list = d.deco === "tiles" ? d.tiles : [d.icon];
    const t = el("div", "tiles");
    list.forEach((n, i) => t.append(el("span", "tile" + (i === 0 ? " pk" : ""), icon(n))));
    t.style.right = "88px"; t.style.top = "54px";
    c.append(t);
  }
  return { size, width: w, lines: n, used, ok };
}

// ---------- Iconos ----------
// favicon.svg tal cual (baldosa con esquinas redondeadas y fondo transparente) para favicon-32, icon-192 e icon-512.
// Para apple-touch-icon e icon-maskable, el fondo ocupa todo el cuadrado (iOS y Android ponen su propia máscara) y la
// letra se reduce para quedar dentro de la zona segura (el círculo central del 80 % en los iconos «maskable»).
async function makeIcons() {
  const svg = await readFile(join(assets, "favicon.svg"), "utf8");
  const vb = (svg.match(/viewBox="([^"]+)"/) || [, "0 0 64 64"])[1].split(/[\s,]+/).map(Number);
  const rect = svg.match(/<rect\b[^>]*\/>/)[0];
  const bg = rect.match(/fill="([^"]+)"/)[1];
  const glyph = svg.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "").replace(rect, "");
  const [x, y, w, h] = vb, cx = x + w / 2, cy = y + h / 2;
  const bleed = (k) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>` +
    `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${glyph}</g></svg>`;
  const out = join(assets, "icons");
  await mkdir(out, { recursive: true });
  const list = [
    ["favicon-32.png", 32, svg],
    ["icon-192.png", 192, svg],
    ["icon-512.png", 512, svg],
    ["apple-touch-icon.png", 180, bleed(0.9)],
    ["icon-maskable-512.png", 512, bleed(0.78)],
  ];
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const [file, size, src] of list) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${src}`);
    const buf = await page.screenshot({ type: "png", omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    await writeFile(join(out, file), buf);
    console.log(`${file}  ${size}×${size}  ${(buf.length / 1024).toFixed(1)} KB`);
  }
  await browser.close();
}

// ---------- Recorrido ----------
async function makeImages() {
  const work = await mkdtemp(join(tmpdir(), "adqa-og-"));
  try {
    execFileSync("npx", ["@11ty/eleventy", "--quiet", `--output=${join(work, "site")}`],
      { cwd: root, stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, ELEVENTY_ENV: "production" } });
    const pages = [];
    async function walk(dir, rel = "/") {
      for (const e of await readdir(dir, { withFileTypes: true })) {
        if (e.isDirectory() && e.name !== "assets") await walk(join(dir, e.name), rel + e.name + "/");
        else if (e.name === "index.html") pages.push({ url: rel, file: join(dir, e.name) });
      }
    }
    await walk(join(work, "site"));
    pages.sort((a, b) => a.url.localeCompare(b.url));
    const sel = pages.filter((p) => !only || only.some((o) => (o === "home" ? p.url === "/" : p.url.replace(/^\//, "").startsWith(o))));
    const list = [];
    for (const p of sel) {
      const d = describe(p.url, await readFile(p.file, "utf8"));
      if (d.art && !(ART[d.art]?.svg || arts[d.art])) { warn.push(`${d.url}: falta la ilustración heroes-${d.art}.svg; va sin ella`); delete d.art; }
      list.push(d);
    }

    await mkdir(outDir, { recursive: true });
    const tpl = join(work, "og.html");
    await writeFile(tpl, TEMPLATE);
    if (args.html) await writeFile(args.html, TEMPLATE);
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(tpl).href);
    const ctx = { arts, icons, ART, logo: pathToFileURL(join(assets, "logo-adqa.svg")).href };
    let total = 0;
    for (const d of list) {
      const r = await page.evaluate(([fn, d, ctx]) => (0, eval)(`(${fn})`)(d, ctx), [paint.toString(), d, ctx]);
      await page.evaluate(() => new Promise((ok) => { const i = document.querySelector(".logo"); i.complete ? ok() : (i.onload = ok); }));
      let q = 82, buf;
      do { buf = await page.screenshot({ type: "jpeg", quality: q, clip: { x: 0, y: 0, width: 1200, height: 630 } }); q -= 6; }
      while (buf.length > 100 * 1024 && q >= 60);
      await writeFile(join(outDir, d.slug + ".jpg"), buf);
      total += buf.length;
      if (!r.ok) warn.push(`${d.url}: el H1 no cabe en 3 líneas ni a ${r.size} px`);
      console.log(`${d.slug}.jpg  ${(buf.length / 1024).toFixed(0)} KB  ${d.kind}  h1 ${r.size}px×${r.lines}  «${d.alt}»`);
    }
    await browser.close();

    // alt.json: se fusiona con el que hubiera (con --only solo cambian esas páginas).
    const altFile = join(outDir, "alt.json");
    let alt = {};
    try { alt = JSON.parse(await readFile(altFile, "utf8")); } catch {}
    for (const d of list) alt[d.url] = d.alt;
    // En una pasada completa, fuera las imágenes y los textos de páginas que ya no existen.
    if (!only) {
      const keep = new Set(list.map((d) => d.slug + ".jpg"));
      for (const f of await readdir(outDir)) if (f.endsWith(".jpg") && !keep.has(f)) { await rm(join(outDir, f)); console.log(`borrada ${f}`); }
      alt = Object.fromEntries(list.map((d) => [d.url, d.alt]));
    }
    await writeFile(altFile, JSON.stringify(Object.fromEntries(Object.entries(alt).sort()), null, 1) + "\n");
    console.log(`\n${list.length} imágenes en ${outDir} (${(total / 1024).toFixed(0)} KB en total)`);
    for (const w of warn) console.warn("AVISO " + w);
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

if ("icons" in args) await makeIcons();
else await makeImages();
