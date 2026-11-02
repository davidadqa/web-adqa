import { HtmlBasePlugin } from "@11ty/eleventy";
import site from "./src/_data/site.js";
import nav from "./src/_data/nav.js";

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
    ...(d.article ? { mainEntity: { "@id": `${url}#article` } } : {}),
    ...(d.itemList ? { mainEntity: { "@id": `${url}#itemlist` } } : {}),
  });

  // Blog: índice /recursos/.
  if (d.blog) {
    graph.push({
      "@type": "Blog",
      "@id": `${base}/recursos/#blog`,
      url: `${base}/recursos/`,
      name: d.blog.name,
      description: d.description,
      inLanguage: "es-ES",
      publisher: org,
    });
  }

  // Artículo del blog.
  if (d.article) {
    const a = d.article;
    graph.push({
      "@type": "BlogPosting",
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
      isPartOf: { "@id": `${base}/recursos/#blog` },
      articleSection: a.section,
      ...(a.keywords && a.keywords.length ? { keywords: a.keywords.join(", ") } : {}),
      ...(a.wordCount ? { wordCount: a.wordCount } : {}),
      image: `${base}/assets/og-adqa.jpg`,
      inLanguage: "es-ES",
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

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addFilter("jsonld", jsonldGraph);
  eleventyConfig.addFilter("absUrl", (path) => site.url + path);
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
  // Artículos de una categoría, del más reciente al más antiguo.
  eleventyConfig.addFilter("byCategory", (items, slug) => (items || []).filter((p) => p.data.category === slug));
  eleventyConfig.addFilter("newestFirst", (items) => [...(items || [])].sort((a, b) => b.date - a.date || a.url.localeCompare(b.url)));
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
