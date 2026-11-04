import { HtmlBasePlugin } from "@11ty/eleventy";
import { existsSync, readFileSync } from "node:fs";
import site from "./src/_data/site.js";
import nav from "./src/_data/nav.js";
import blog from "./src/_data/blog.js";

// Imagen para compartir de una página: src/assets/og/<slug>.jpg si existe (la genera tools/og.mjs) y, si no, la general.
// alt: «ADQA · <lo que se lee en la imagen>» (src/assets/og/alt.json, que escribe la misma herramienta).
const ogDir = new URL("./src/assets/og/", import.meta.url);
const OG_DEFAULT = { src: "/assets/og-adqa.jpg", alt: "ADQA · Informática, telecomunicaciones y ciberseguridad para empresas en Barcelona" };
function ogImage(url, title) {
  const slug = String(url || "/").replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
  if (!existsSync(new URL(`${slug}.jpg`, ogDir))) return OG_DEFAULT;
  let alt = {};
  try { alt = JSON.parse(readFileSync(new URL("alt.json", ogDir), "utf8")); } catch {}
  const text = alt[url] || String(title || "").replace(/\s*\|\s*ADQA$/, "");
  return { src: `/assets/og/${slug}.jpg`, alt: text ? `ADQA · ${text}` : OG_DEFAULT.alt };
}

// Builds the schema.org @graph for a page from its front matter.
function jsonldGraph(d) {
  const base = site.url;
  const url = base + d.url;
  const org = { "@id": `${base}/#organization` };
  const graph = [];

  if (d.isHome) {
    graph.push({
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${base}/#organization`,
      name: site.name,
      legalName: site.legalName,
      url: `${base}/`,
      logo: `${base}/assets/logo-adqa.svg`,
      image: `${base}/assets/og-adqa.jpg`,
      slogan: site.claim,
      description: site.orgDescription,
      telephone: site.phoneE164,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        postalCode: site.address.postalCode,
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        addressCountry: "ES",
      },
      areaServed: site.areaServed.map((a) => ({ "@type": a.type, name: a.name })),
      knowsAbout: site.knowsAbout,
      hasCredential: site.credentials.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: c,
      })),
      subOrganization: {
        "@type": "Organization",
        name: "Anxanet",
        url: "https://anxanet.com/",
        description: "Operador de telecomunicaciones propio de ADQA.",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios TIC para empresas",
        itemListElement: nav.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.label, url: base + s.url },
        })),
      },
    });
    graph.push({
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: `${base}/`,
      name: site.name,
      inLanguage: "es-ES",
      publisher: org,
    });
  }

  graph.push({
    "@type": d.pageType || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: d.title,
    description: d.description,
    inLanguage: "es-ES",
    isPartOf: { "@id": `${base}/#website` },
    about: org,
    ...(d.breadcrumbs ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    ...(d.article || d.caso ? { mainEntity: { "@id": `${url}#article` } } : {}),
    ...(d.itemList ? { mainEntity: { "@id": `${url}#itemlist` } } : {}),
  });

  // Artículo de /recursos/ («Respuestas»): contenido de consulta revisado, no entradas de blog (Article, no BlogPosting).
  if (d.article) {
    const a = d.article;
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      headline: a.headline,
      description: d.description,
      url,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      datePublished: a.datePublished,
      dateModified: a.dateModified || a.datePublished,
      author: {
        "@type": "Organization",
        name: a.author,
        url: `${base}/quienes-somos/`,
        parentOrganization: org,
      },
      publisher: org,
      isPartOf: { "@id": `${base}/recursos/#webpage` },
      articleSection: a.section,
      ...(a.keywords && a.keywords.length ? { keywords: a.keywords.join(", ") } : {}),
      ...(a.wordCount ? { wordCount: a.wordCount } : {}),
      image: base + ogImage(d.url).src,
      inLanguage: "es-ES",
    });
  }

  // Página de un caso de éxito (src/casos-de-exito/caso.njk). Los casos anónimos no llevan «mentions».
  if (d.caso) {
    const c = d.caso;
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      headline: c.titulo,
      description: d.description,
      url,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      articleSection: "Casos de éxito",
      author: org,
      publisher: org,
      image: base + ogImage(d.url).src,
      inLanguage: "es-ES",
      datePublished: c.publicado,
      dateModified: c.publicado,
      about: c.servicios.map((s) => ({ "@type": "Service", name: s.label, url: base + s.href.split("#")[0] })),
      ...(c.cliente ? { mentions: { "@type": "Organization", name: c.cliente } } : {}),
    });
  }

  // Listado de artículos (índice y categorías).
  if (d.itemList && d.itemList.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#itemlist`,
      numberOfItems: d.itemList.length,
      itemListElement: d.itemList.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: base + it.url,
        name: it.name,
      })),
    });
  }

  if (d.service) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: d.service.name,
      serviceType: d.service.serviceType || d.service.name,
      description: d.service.description || d.description,
      provider: org,
      areaServed: site.areaServed.map((a) => ({ "@type": a.type, name: a.name })),
      url,
    });
  }

  if (d.breadcrumbs) {
    const items = [{ name: "Inicio", url: "/" }, ...d.breadcrumbs];
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: items.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: base + (b.url || d.url),
      })),
    });
  }

  if (d.faq) {
    const qs = [...(d.faq.manager || []), ...(d.faq.tecnico || []), ...(d.faq.items || [])];
    if (qs.length) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: qs.map((q) => ({
          "@type": "Question",
          name: q.q,
          acceptedAnswer: { "@type": "Answer", text: q.a },
        })),
      });
    }
  }

  if (d.extra) graph.push(...[].concat(d.extra));

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)
    .replace(/</g, "\\u003c");
}

// Casos de éxito (src/_data/casos.json): comprobación barata en cada build.
function checkCasos() {
  const read = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), "utf8"));
  const casos = read("./src/_data/casos.json");
  const fotos = read("./src/_data/fotos.json");
  const ids = new Set(casos.map((c) => c.id));
  const urls = new Set();
  const err = [];
  for (const c of casos) {
    for (const k of ["id", "slug", "url", "corto", "titulo", "sector", "sectorTag", "resumen", "highlight", "foto", "servicios", "seo", "publicado"])
      if (c[k] == null || c[k] === "") err.push(`${c.id}: falta «${k}»`);
    if (c.url !== `/casos-de-exito/${c.slug}/`) err.push(`${c.id}: url y slug no cuadran`);
    if (urls.has(c.url)) err.push(`${c.id}: url duplicada`);
    urls.add(c.url);
    for (const o of c.otros || []) if (!ids.has(o) || o === c.id) err.push(`${c.id}: «otros» apunta a «${o}»`);
    if (c.foto && c.foto.tipo === "equipo" && !fotos[c.foto.slug]) err.push(`${c.id}: la foto «${c.foto.slug}» no está en fotos.json`);
    if (c.foto && c.foto.tipo === "cliente" && !existsSync(new URL(`./src${c.foto.src}`, import.meta.url))) err.push(`${c.id}: no existe ${c.foto.src}`);
    if (c.anon && c.cliente) err.push(`${c.id}: anónimo con cliente`);
  }
  if (ids.size !== casos.length) err.push("ids duplicados");
  if (err.length) throw new Error("casos.json:\n  " + err.join("\n  "));
}

export default function (eleventyConfig) {
  checkCasos();
  eleventyConfig.addPlugin(HtmlBasePlugin);
  // El modo corrección (assets/revisio) solo existe en la vista previa (ELEVENTY_ENV=preview).
  const preview = process.env.ELEVENTY_ENV === "preview";
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" }, {
    filter: (p) => preview || !/^revisio(\/|$)/.test(String(p).replace(/\\/g, "/")),
  });
  eleventyConfig.addFilter("jsonld", jsonldGraph);
  eleventyConfig.addFilter("absUrl", (path) => site.url + path);
  eleventyConfig.addFilter("ogImage", ogImage);
  eleventyConfig.addFilter("startsWith", (str, prefix) => String(str || "").startsWith(prefix));
  eleventyConfig.addFilter("year", () => String(new Date().getFullYear()));

  // ---------- Blog ----------
  const toDate = (v) => (v instanceof Date ? v : new Date(String(v) + (String(v).length === 10 ? "T00:00:00Z" : "")));
  // «1 de julio de 2026»
  eleventyConfig.addFilter("fecha", (v) =>
    new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(toDate(v)));
  // 2026-07-01
  eleventyConfig.addFilter("isoDate", (v) => toDate(v).toISOString().slice(0, 10));
  const plain = (html) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  eleventyConfig.addFilter("wordCount", (html) => plain(html).split(" ").filter(Boolean).length);
  eleventyConfig.addFilter("readingTime", (html) => Math.max(1, Math.round(plain(html).split(" ").filter(Boolean).length / 200)));
  // Artículos de una categoría.
  eleventyConfig.addFilter("byCategory", (items, slug) => (items || []).filter((p) => p.data.category === slug));
  // Orden editorial (índice y categorías): entender → elegir → hacer (campo «tipo»); dentro de cada tipo, por titular.
  const tipoRank = (p) => { const i = blog.tipos.indexOf(p.data.tipo); return i < 0 ? blog.tipos.length : i; };
  eleventyConfig.addFilter("byTipo", (items) => [...(items || [])].sort((a, b) =>
    tipoRank(a) - tipoRank(b) || String(a.data.h1).localeCompare(String(b.data.h1), "es") || a.url.localeCompare(b.url)));
  // Todas, tema a tema (orden de blog.categories) y, dentro de cada tema, el orden editorial: el ItemList del índice.
  const temaRank = (p) => blog.categories.findIndex((c) => c.slug === p.data.category);
  eleventyConfig.addFilter("byTema", (items) => [...(items || [])].sort((a, b) =>
    temaRank(a) - temaRank(b) || tipoRank(a) - tipoRank(b) || String(a.data.h1).localeCompare(String(b.data.h1), "es")));
  // Busca artículos por slug (los que no existen se ignoran).
  eleventyConfig.addFilter("bySlugs", (items, slugs) =>
    (slugs || []).map((s) => (items || []).find((p) => p.page.fileSlug === s)).filter(Boolean));
  // Relacionados: primero los indicados en «related», luego los más recientes de la misma categoría.
  eleventyConfig.addFilter("relatedFor", (items, page, related, category, n = 3) => {
    const all = items || [];
    const out = [];
    const add = (p) => { if (p && p.url !== page.url && !out.includes(p) && out.length < n) out.push(p); };
    for (const s of related || []) add(all.find((p) => p.page.fileSlug === s));
    [...all].filter((p) => p.data.category === category).sort((a, b) => b.date - a.date).forEach(add);
    return out;
  });
  // Casos de éxito: uno por id, y el área del formulario de contacto según el primer servicio del caso.
  eleventyConfig.addFilter("byId", (items, id) => (items || []).find((c) => c.id === id));
  // Hub: casos que pasan una tecla del filtro («svc:wifi», «sec:sanidad» o «all») y la lista para el ItemList.
  const casoHas = (c, f) => { if (f === "all") return true; const [k, v] = f.split(":");
    return k === "svc" ? c.filtros.includes(v) : c.sectorTag === v; };
  eleventyConfig.addFilter("casoCount", (items, f) => (items || []).filter((c) => casoHas(c, f)).length);
  eleventyConfig.addFilter("caseItemList", (items) => (items || []).map((c) => ({ url: c.url, name: c.titulo })));
  const AREA_FORM = { redes: "Redes y WiFi", telecomunicaciones: "Telecomunicaciones", "sistemas-cloud": "Sistemas y cloud",
    "soporte-it": "Soporte y mantenimiento IT", ciberseguridad: "Ciberseguridad", "desarrollo-software-medida": "Web y software",
    "diseno-programacion-web": "Web y software", "google-workspace": "Google Workspace / Microsoft 365", "microsoft-365": "Google Workspace / Microsoft 365" };
  eleventyConfig.addFilter("formArea", (href) => AREA_FORM[String(href || "").split("/")[1]] || "Varias / no lo sé");
  eleventyConfig.addFilter("exclude", (items, url) => (items || []).filter((p) => p.url !== url));
  eleventyConfig.addFilter("navLabel", (url) => {
    for (const g of nav.groups) for (const l of g.links) if (l.url === url) return l.label;
    return null;
  });
  // Lista para el JSON-LD ItemList.
  eleventyConfig.addFilter("itemList", (items) => (items || []).map((p) => ({ url: p.url, name: p.data.h1 || p.data.title })));
  // Añade id a los h2 del artículo, envuelve las tablas y devuelve el índice («En este artículo»).
  const slugify = (t) => plain(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "seccion";
  eleventyConfig.addFilter("withToc", (html) => {
    const toc = [];
    const used = new Set();
    let out = String(html || "").replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (m, attrs = "", inner) => {
      const idm = attrs.match(/\sid="([^"]+)"/);
      let id = idm ? idm[1] : slugify(inner);
      while (used.has(id)) id += "-2";
      used.add(id);
      toc.push({ id, text: plain(inner) });
      return idm ? m : `<h2 id="${id}"${attrs}>${inner}</h2>`;
    });
    out = out.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
    return { html: out, toc };
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
