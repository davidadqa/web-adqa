// Estructura de servicios: alimenta el mega-menú, el menú móvil, el pie y el catálogo de servicios del JSON-LD.
export default {
  groups: [
    { title: "Seguridad", icon: "i-shield", links: [
      { label: "Ciberseguridad", url: "/ciberseguridad/" },
      { label: "Pentesting", url: "/ciberseguridad/pentesting/" },
      { label: "Certificado ENS", url: "/ciberseguridad/certificado-ens/" },
    ] },
    { title: "Redes", icon: "i-net", links: [
      { label: "Redes informáticas", url: "/redes/" },
      { label: "Soluciones WiFi", url: "/redes/wifi-entornos-complejos/" },
      { label: "Certificación de redes", url: "/redes/certificacion-redes/" },
    ] },
    { title: "Telecom", icon: "i-signal", links: [
      { label: "Telecomunicaciones", url: "/telecomunicaciones/" },
      { label: "Networking", url: "/telecomunicaciones/networking/" },
    ] },
    { title: "Cloud", icon: "i-cloud", links: [
      { label: "Sistemas y cloud", url: "/sistemas-cloud/" },
      { label: "Datacenter", url: "/sistemas-cloud/datacenter/" },
    ] },
    { title: "Servicios IT", icon: "i-tool", links: [
      { label: "Soporte IT", url: "/soporte-it/" },
      { label: "Asistencia remota", url: "https://extranet.adqa.com/", external: true },
    ] },
    { title: "Web", icon: "i-code", links: [
      { label: "Diseño web", url: "/diseno-programacion-web/" },
      { label: "Software a medida", url: "/desarrollo-software-medida/" },
      { label: "Mantenimiento web", url: "/diseno-programacion-web/mantenimiento-web-para-empresas/" },
    ] },
    { title: "Workspace", icon: "i-grid", wide: true, links: [
      { label: "Google Workspace", url: "/google-workspace/" },
      { label: "Microsoft 365", url: "/microsoft-365/" },
      { label: "Workspace vs Microsoft 365", url: "/google-workspace/google-workspace-vs-microsoft-365/" },
      { label: "Licenciamiento mixto", url: "/google-workspace/licenciamiento-mixto-google-workspace/" },
    ] },
  ],
  // Servicios principales (pie, menú móvil, catálogo JSON-LD).
  services: [
    { label: "Ciberseguridad", url: "/ciberseguridad/" },
    { label: "Redes y WiFi", url: "/redes/" },
    { label: "Telecomunicaciones", url: "/telecomunicaciones/" },
    { label: "Sistemas y cloud", url: "/sistemas-cloud/" },
    { label: "Soporte IT", url: "/soporte-it/" },
    { label: "Diseño web y software", url: "/diseno-programacion-web/" },
    { label: "Google Workspace", url: "/google-workspace/" },
    { label: "Microsoft 365", url: "/microsoft-365/" },
  ],
  main: [
    { label: "Casos de éxito", url: "/casos-de-exito/" },
    { label: "Recursos", url: "/recursos/" },
    { label: "Quiénes somos", url: "/quienes-somos/" },
  ],
};
