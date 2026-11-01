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
  });

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

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
