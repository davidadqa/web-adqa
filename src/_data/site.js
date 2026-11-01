// Datos canónicos de ADQA. Cualquier dato de empresa que aparezca en la web sale de aquí.
const env = process.env.ELEVENTY_ENV || "production";

export default {
  env,
  // La vista previa (GitHub Pages) nunca se indexa.
  noindex: env === "preview",
  url: "https://adqa.com",
  name: "ADQA",
  legalName: "Ingeniería y Suministros Profesionales, S.L.",
  claim: "Tocamos todas las teclas",
  claimFull: "Tocamos todas las teclas para que solo tengas que tocar una",
  orgDescription:
    "Empresa TIC y operador de telecomunicaciones propio en Barcelona. Soporte IT, redes, telecomunicaciones, cloud en datacenter propio y de proximidad, desarrollo web y software, y ciberseguridad para empresas e instituciones, con un mismo equipo.",
  phone: "+34 938 147 380",
  phoneE164: "+34938147380",
  email: "info@adqa.com",
  cvEmail: "cv@adqa.com",
  extranet: "https://extranet.adqa.com/",
  anxanet: "https://anxanet.com/",
  address: {
    street: "C. Masia d'en Notari 23, Nave 3, Polígono Masia d'en Frederic",
    postalCode: "08800",
    locality: "Vilanova i la Geltrú",
    region: "Barcelona",
    short: "C. Masia d'en Notari 23 · 08800 Vilanova i la Geltrú (Barcelona)",
  },
  areaServed: [
    { type: "City", name: "Barcelona" },
    { type: "AdministrativeArea", name: "Cataluña" },
    { type: "Country", name: "España" },
  ],
  credentials: [
    "ISO 9001:2015 — Gestión de la calidad",
    "Esquema Nacional de Seguridad (ENS), categoría ALTA",
  ],
  knowsAbout: [
    "Soporte informático para empresas",
    "Mantenimiento informático",
    "Redes informáticas",
    "Certificación de redes",
    "WiFi en entornos complejos",
    "Telecomunicaciones para empresas",
    "SD-WAN",
    "Centralitas IP",
    "Cloud privado",
    "Datacenter de proximidad",
    "Ciberseguridad",
    "Pentesting",
    "Esquema Nacional de Seguridad (ENS)",
    "Google Workspace",
    "Microsoft 365",
    "Diseño web",
    "Desarrollo de software a medida",
  ],
  // Satisfacción: encuesta de calidad ISO 9001.
  survey: { response: 87, knowledge: 97, recommend: 95, source: "Según nuestra encuesta de calidad (ISO 9001)" },
};
