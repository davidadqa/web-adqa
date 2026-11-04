// Páginas de caso de éxito (caso.njk, una por caso de src/_data/casos.json).
export default {
  eleventyComputed: {
    title: (d) => d.c.seo.title,
    description: (d) => d.c.seo.description,
    breadcrumbs: (d) => [{ name: "Casos de éxito", url: "/casos-de-exito/" }, { name: d.c.corto }],
  },
};
