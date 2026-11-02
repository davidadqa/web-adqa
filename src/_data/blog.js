// Blog /recursos/: categorías, autoría por especialidad y textos fijos.
// Los artículos viven en src/recursos/articulos/<slug>.md (una URL /recursos/<slug>/ por fichero).
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Cuenta los artículos de cada categoría leyendo el front matter (campo «category:»).
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "recursos", "articulos");
const counts = {};
if (existsSync(dir)) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    const m = readFileSync(join(dir, f), "utf8").match(/^category:\s*["']?([\w-]+)/m);
    if (m) counts[m[1]] = (counts[m[1]] || 0) + 1;
  }
}

const blog = {
  // Una categoría con menos artículos que este mínimo se publica con noindex (y fuera del sitemap)
  // hasta que tenga contenido suficiente.
  minArticles: 3,
  // Fecha de la última revisión editorial de los artículos migrados del WordPress.
  reviewed: "2026-11-02",
  cta: {
    title: "¿Quieres que revisemos juntos cuál encaja mejor con tu empresa?",
    text: "Cuéntanos cómo trabajáis hoy y qué te gustaría cambiar. Lo miramos con calma y te proponemos el siguiente paso, sin compromiso.",
  },
  // Destacados del índice /recursos/ (los que más enlaza el resto de la web).
  featured: [
    "cable-o-wifi",
    "pentesting-o-escaneo-automatizado",
    "datacenter-propio-o-nube-publica",
    "que-es-google-workspace-y-por-que-migrar-tu-empresa",
    "soporte-it-reactivo-o-proactivo",
    "web-a-medida-o-plantilla",
  ],
  categories: [
    {
      slug: "ciberseguridad",
      name: "Ciberseguridad",
      short: "Ciberseguridad",
      icon: "i-shield",
      author: "Equipo de ciberseguridad de ADQA",
      area: "Ciberseguridad",
      service: { url: "/ciberseguridad/", label: "Ciberseguridad para empresas" },
      title: "Ciberseguridad para empresas: guías prácticas | ADQA",
      description: "Guías de ciberseguridad para empresas: pentesting, ENS, firewall gestionado y políticas de seguridad, explicados con claridad para decidir con criterio.",
      h1: "Ciberseguridad para empresas, explicada sin alarmismo",
      intro: "Pentesting (pruebas de intrusión), Esquema Nacional de Seguridad, firewalls y políticas de seguridad. Quizá un cliente te ha pedido por escrito cómo proteges sus datos. Estas guías explican qué aporta cada medida y cuándo tiene sentido. También cómo encaja si tu empresa no tiene un departamento de seguridad propio.",
    },
    {
      slug: "redes",
      name: "Redes y WiFi",
      short: "Redes y WiFi",
      icon: "i-net",
      author: "Equipo de redes de ADQA",
      area: "Redes y WiFi",
      service: { url: "/redes/", label: "Redes informáticas y WiFi" },
      title: "Redes y WiFi para empresas: guías prácticas | ADQA",
      description: "Guías sobre redes y WiFi para empresas: cableado, certificación, switches, segmentación y cobertura WiFi en oficinas, naves y entornos con varias sedes.",
      h1: "Redes y WiFi: guías para una red que no da guerra",
      intro: "Cableado, certificación, switches, segmentación y WiFi en oficinas, naves industriales y empresas con varias sedes. Que el WiFi vaya justo en el despacho del fondo suele tener arreglo. Lo que conviene saber antes de ampliar, renovar o certificar tu red.",
    },
    {
      slug: "telecomunicaciones",
      name: "Telecomunicaciones",
      short: "Telecom",
      icon: "i-signal",
      author: "Equipo de telecomunicaciones de ADQA",
      area: "Telecomunicaciones",
      service: { url: "/telecomunicaciones/", label: "Telecomunicaciones para empresas" },
      title: "Telecomunicaciones para empresas: guías | ADQA",
      description: "Guías sobre telecomunicaciones para empresas: conectividad, enlaces privados entre la oficina y el datacenter, y cómo elegir la conexión de cada sede.",
      h1: "Telecomunicaciones para empresas: guías prácticas",
      intro: "Conectividad, enlaces privados y comunicaciones entre sedes y con el datacenter. Tu sede central no pide la misma línea que una delegación pequeña. Cómo elegir la conexión que necesita cada parte de tu empresa.",
    },
    {
      slug: "cloud",
      name: "Cloud y datacenter",
      short: "Cloud y datacenter",
      icon: "i-cloud",
      author: "Equipo de cloud y sistemas de ADQA",
      area: "Sistemas y cloud",
      service: { url: "/sistemas-cloud/", label: "Sistemas y cloud" },
      title: "Cloud y datacenter para empresas: guías | ADQA",
      description: "Guías de cloud y datacenter para empresas: datacenter propio o nube pública, backup y continuidad de negocio, y cómo migrar servidores sin parar la actividad.",
      h1: "Cloud y datacenter: dónde y cómo viven tus datos",
      intro: "Datacenter de proximidad o nube pública, copias de seguridad, continuidad de negocio y migración de servidores. El día que necesites recuperar una carpeta borrada, querrás saber dónde está la copia. Criterios claros para decidir dónde alojar tus sistemas.",
    },
    {
      slug: "soporte-it",
      name: "Soporte IT",
      short: "Soporte IT",
      icon: "i-tool",
      author: "Equipo de soporte IT de ADQA",
      area: "Soporte y mantenimiento IT",
      service: { url: "/soporte-it/", label: "Soporte IT y mantenimiento informático" },
      title: "Soporte IT para empresas: guías prácticas | ADQA",
      description: "Guías de soporte IT para empresas: mantenimiento informático reactivo o proactivo y cómo organizar el soporte para que la informática no frene el trabajo.",
      h1: "Soporte IT: guías para que la informática no frene el trabajo",
      intro: "Cómo organizar el soporte y el mantenimiento informático de tu empresa. El ordenador que cada mañana tarda un poco más en arrancar suele avisar antes de fallar. Qué conviene prevenir, qué se resuelve sobre la marcha y cómo medir que funciona.",
    },
    {
      slug: "web",
      name: "Web y software",
      short: "Web y software",
      icon: "i-code",
      author: "Equipo web y software de ADQA",
      area: "Web y software",
      service: { url: "/diseno-programacion-web/", label: "Diseño y programación web" },
      title: "Diseño web y software a medida: guías | ADQA",
      description: "Guías de diseño web, mantenimiento y software a medida para empresas: plantilla o desarrollo propio, CMS, mantenimiento preventivo y cuándo modernizar.",
      h1: "Web y software a medida: guías para decidir bien",
      intro: "Diseño y programación web, mantenimiento y software de gestión a medida. ¿Hay alguien en tu equipo que pase datos a mano de una hoja de cálculo a otra? Estas son las preguntas que conviene hacerse antes de encargar, renovar o modernizar.",
    },
    {
      slug: "workspace",
      name: "Google Workspace y Microsoft 365",
      short: "Workspace",
      icon: "i-grid",
      author: "Equipo de Workspace de ADQA",
      area: "Google Workspace / Microsoft 365",
      service: { url: "/google-workspace/", label: "Google Workspace y Microsoft 365" },
      title: "Google Workspace y Microsoft 365: guías | ADQA",
      description: "Guías sobre Google Workspace y Microsoft 365 para empresas: licencias, migración, seguridad, colaboración y cuándo tiene sentido cambiar de plataforma.",
      h1: "Google Workspace y Microsoft 365, sin letra pequeña",
      intro: "Licencias, migraciones, seguridad y trabajo en equipo en las dos grandes plataformas de productividad. Quizá tu equipo se pasa archivos por correo y ya no sabes cuál es la última versión. Si te toca elegir, migrar o sacarles más partido, aquí tienes información práctica.",
    },
  ],
};

for (const c of blog.categories) {
  c.count = counts[c.slug] || 0;
  c.url = `/recursos/${c.slug}/`;
  // Sin contenido suficiente: la página existe (se enlaza desde los artículos) pero no se indexa.
  c.noindex = c.count < blog.minArticles;
}
blog.bySlug = Object.fromEntries(blog.categories.map((c) => [c.slug, c]));

export default blog;
