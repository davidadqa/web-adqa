# Web ADQA

Nueva web de ADQA: informática, telecomunicaciones y ciberseguridad para empresas. Es un sitio estático (HTML, CSS y JS, sin dependencias ni compilación).

## Páginas

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/ciberseguridad/` | Ciberseguridad (incluye `#pentesting` y `#certificado-ens`) |
| `/redes/` | Redes informáticas y WiFi (incluye `#wifi` y `#certificacion`) |
| `/telecomunicaciones/` | Telecomunicaciones y networking (incluye `#networking`) |
| `/sistemas-cloud/` | Sistemas y cloud (incluye `#datacenter`) |
| `/soporte-it/` | Soporte y mantenimiento informático |
| `/diseno-y-programacion-web/` | Diseño web y software a medida |
| `/google-workspace/` | Google Workspace y Microsoft 365 |
| `/casos-de-exito/` | Casos de éxito |
| `/quienes-somos/` | Quiénes somos |

Estilos y scripts compartidos en `assets/site.css` y `assets/site.js`. Las rutas internas son relativas, así que la web funciona tanto en la raíz de un dominio como dentro de una subcarpeta (por ejemplo, GitHub Pages).

## Ver la web con GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`, carpeta `/ (root)`, **Save**. En uno o dos minutos estará en `https://davidadqa.github.io/web-adqa/`.

## Antes de publicarla en producción

- **Indexación:** esta copia de vista previa lleva `<meta name="robots" content="noindex, nofollow">` en todas las páginas para que los buscadores no la indexen. En producción hay que cambiarlo a `index, follow, max-image-preview:large`.
- **Formulario de contacto:** ahora solo valida en el navegador; hay que conectarlo a un servicio de formularios o al servidor.
- **Páginas aún no incluidas** (enlazadas, dan 404): artículos de `/recursos/`, páginas legales, `/certificado-bsi/` y `/trabaja-con-nosotros/`. Se pueden migrar desde la web actual.
- **Versión en catalán:** las etiquetas `hreflang` y el `sitemap.xml` ya apuntan a `/ca/...`, pero esas páginas no existen todavía.
- **Dominio:** `canonical`, `og:url`, JSON-LD, `sitemap.xml` y `llms.txt` usan `https://adqa.com/`.
