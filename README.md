# Web ADQA

Nueva web de ADQA (Ingeniería y Suministros Profesionales, S.L.): informática, telecomunicaciones y ciberseguridad para empresas en Barcelona.

Es un sitio estático generado con [Eleventy 3](https://www.11ty.dev/): las páginas se escriben como plantillas Nunjucks y el resultado es HTML, CSS y JS puros, sin código de servidor.

## Cómo funciona

```
src/                     Fuentes de la web (lo único que se edita)
  _data/                 Datos compartidos por todas las páginas
  _includes/             Layout, cabecera, pie, iconos y macros
  assets/                CSS, JS, fuentes, logos e imágenes (se copian tal cual)
  <ruta>/index.njk       Una carpeta por página: src/redes/index.njk → /redes/
  sitemap.xml.njk        Genera /sitemap.xml
  llms.txt.njk           Genera /llms.txt (resumen para buscadores e IA)
  robots.txt.njk         Genera /robots.txt
tools/                   Herramientas de QA (vista previa y comprobación)
eleventy.config.js       Configuración de Eleventy y generador del JSON-LD
_site/                   Salida generada (no se edita ni se sube a Git)
```

### Datos compartidos (`src/_data/`)

| Fichero | Qué contiene |
|---|---|
| `site.js` | Datos canónicos de la empresa: razón social, teléfono, correos, dirección, claim, encuesta, `areaServed` y el interruptor `noindex` de la vista previa. Cualquier dato de empresa que salga en la web sale de aquí. |
| `nav.js` | Estructura de servicios: mega menú, menú móvil, pie y catálogo de servicios del JSON-LD. |
| `projects.json` | Proyectos con nombre (carril de casos y `m.projectCard`). |
| `clients.json` | Logos del muro de clientes. |
| `brands.js` | Partners y fabricantes que se pueden citar, y en qué sección. |

### Plantillas y estilos

- `src/_includes/layouts/base.njk`: layout común. Genera `title`, `description`, canonical, Open Graph y el JSON-LD (`WebPage`, `Service`, `BreadcrumbList`, `FAQPage`) a partir del front matter de cada página. No hay que escribir JSON-LD a mano.
- `src/_includes/macros.njk`: componentes reutilizables (`crumbs`, `faqSection`, `placeholder`, `contactBlock`, `projectCard`, `projectsRail`, `anonCase`, `clientWall`, `partnersBlock`, `surveyMetrics`).
- `src/assets/site.css`: todos los estilos compartidos, con las variables de color en `:root`. Al final están los componentes de página unificados (tablas `.vs` y `.spec`, textos legales `.doc`, certificados `.cert`, `.where`, `.note.card`, `.cases-wp`, etc.). Una página solo lleva CSS propio en su `{% block head %}` cuando es una pieza exclusiva de esa página.
- Las rutas internas se escriben siempre absolutas (`/redes/`, `/assets/...`). El plugin `HtmlBasePlugin` las adapta solo cuando la web se publica en una subcarpeta.

### Marcas en el código

- `data-origen="wp"`: casos anónimos heredados del WordPress, pendientes de que ADQA decida cuáles se quedan.
- `<!-- PENDIENTE: ... -->`: datos que faltan y no se han inventado.
- `<!-- CAMBIO LEGAL: ... -->`: cambios en los textos legales que debe validar el asesor.
- `data-fase3="..."`: tarjetas que enlazarán a páginas de la fase 3 cuando existan.
- Imágenes provisionales: macro `m.placeholder(...)`, con la etiqueta «Imagen provisional · cal substituir».

## Comandos

Requisitos: Node.js 18 o superior. La primera vez, `npm install`.

| Comando | Para qué |
|---|---|
| `npm run build` | Genera la web en `_site/` para producción (dominio raíz, indexable). |
| `npm run build:preview` | Genera la vista previa para GitHub Pages: rutas bajo `/web-adqa/` y `noindex` en todas las páginas. |
| `npm run serve` | Servidor local con recarga en `http://localhost:8080/`. |
| `node tools/preview.mjs <carpeta> src/<ruta>/index.njk [...]` | Construye solo esas páginas en aislado, las sirve y hace capturas a 1440×900 y 390×844 en `<carpeta>`. Imprime, por página, errores de consola, overflow horizontal, nº de `h1` y validez del JSON-LD. |
| `node tools/check.mjs [--json=informe.json] [--prefix=/web-adqa/]` (o `npm run check`) | QA de todo el sitio: enlaces internos y anclas rotos, errores de consola, overflow en móvil, JSON-LD, nº de `h1`, longitud de title y description, y reglas de marca (frases prohibidas, «único», «la respuesta ADQAda», precios, marcas no autorizadas). Los enlaces a `/recursos/...` y `/casos-de-exito/<caso>/` se cuentan aparte porque son de fases posteriores. Tarda varios minutos. |

Las herramientas de QA usan Playwright (Chromium).

## Vista previa (GitHub Pages) y `noindex`

`npm run build:preview` pone `ELEVENTY_ENV=preview`. Con ese entorno, `site.noindex` es `true` y todas las páginas llevan `<meta name="robots" content="noindex, nofollow">`, para que la copia de `https://davidadqa.github.io/web-adqa/` no se indexe ni compita con la web real. El build de producción (`npm run build`) pone `index, follow, max-image-preview:large`. Una página concreta también se puede excluir con `noindex: true` en su front matter (y así sale del `sitemap.xml` y del `llms.txt`).

### Cómo se publica la vista previa

`_site/` no se sube a `main`. La web generada se publica en la rama **`gh-pages`**, que solo contiene el HTML ya construido (con un `.nojekyll` para que GitHub no lo procese):

```bash
npm run build:preview -- --output=/tmp/adqa-gh-pages   # o la carpeta que quieras
cd /tmp/adqa-gh-pages && touch .nojekyll
# y se sube el contenido de esa carpeta a la rama gh-pages (sin historial de main)
```

En GitHub: Settings → Pages → Build and deployment → Source: **Deploy from a branch** → rama `gh-pages`, carpeta `/ (root)`. La URL es `https://davidadqa.github.io/web-adqa/`.

Alternativa automática: un workflow de GitHub Actions (`.github/workflows/pages.yml`) que ejecute `npm ci` y `npm run build:preview` y publique `_site` con `actions/upload-pages-artifact` y `actions/deploy-pages` (Source: **GitHub Actions**). Así cada push a `main` actualizaría la vista previa sin pasos manuales.

## Producción

- Alojamiento previsto: Cloudflare, con despliegue automático desde este repositorio (`npm run build`, carpeta de salida `_site`).
- Dominio: `canonical`, `og:url`, JSON-LD, `sitemap.xml` y `llms.txt` usan `https://adqa.com` (`site.url` en `src/_data/site.js`).
- Pendiente antes de publicar: redirecciones 301 de las URL de www.adqa.com (`_redirects`), conectar los formularios de `/contacto/` y `/trabaja-con-nosotros/` a un Worker con Turnstile (ahora solo validan en el navegador), y la versión en catalán (fase posterior).
- Sin cookies no técnicas ni analítica: no hace falta banner de cookies. La fuente Figtree está alojada en `src/assets/fonts/`.
