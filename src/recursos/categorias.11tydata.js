// Una página por categoría del blog (paginación sobre blog.categories).
export default {
  eleventyComputed: {
    title: (data) => data.cat.title,
    description: (data) => data.cat.description,
    noindex: (data) => data.cat.noindex,
    breadcrumbs: (data) => [{ name: "Respuestas", url: "/recursos/" }, { name: data.cat.name }],
  },
};
