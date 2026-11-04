// Datos comunes a todos los artículos del blog (src/recursos/articulos/<slug>.md → /recursos/<slug>/).
export default {
  layout: "layouts/article.njk",
  tags: ["articulos"],
  ogType: "article",
  eleventyComputed: {
    permalink: (data) => `/recursos/${data.page.fileSlug}/`,
    breadcrumbs: (data) => {
      const c = data.blog.bySlug[data.category];
      return [
        { name: "Respuestas", url: "/recursos/" },
        ...(c ? [{ name: c.name, url: c.url }] : []),
        { name: data.crumb || data.h1 || data.title },
      ];
    },
  },
};
