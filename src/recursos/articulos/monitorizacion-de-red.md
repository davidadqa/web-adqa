---
title: "Monitorización de red: qué vigilar y cómo empezar | ADQA"
description: "Monitorización de red para empresas: qué conviene vigilar en switches, enlaces y WiFi, cómo funcionan las alertas y por dónde empezar si hoy no se vigila nada."
h1: "Monitorización de red: qué vigilar para anticiparse a los problemas"
lead: "Ver las primeras señales de un fallo cuando todavía hay margen para actuar. De eso trata monitorizar la red."
keyword: "monitorización de red"
category: redes
etiquetas: ["Monitorización", "Mantenimiento"]
date: 2026-07-02
updated: 2026-11-02
servicio: "/redes/"
related: ["soporte-it-reactivo-o-proactivo", "cuando-renovar-la-red-de-tu-empresa", "red-plana-o-red-segmentada"]
imagen: "Pantalla con un panel de monitorización que muestra el estado de switches, enlaces y puntos de acceso de una red de empresa"
tldr: "La monitorización de red vigila de forma continua switches, enlaces, firewall y puntos de acceso. Avisa cuando algo se sale de lo normal: un enlace que pierde paquetes, un puerto con errores o un equipo que se calienta. Así se puede actuar antes de que el problema se convierta en un corte. Además, deja un historial que acelera el diagnóstico cuando algo falla."
faq:
  manager:
    - q: "¿Hace falta comprar equipos nuevos para monitorizar la red?"
      a: "Normalmente no. La mayoría de switches, firewalls y puntos de acceso profesionales ya ofrecen la información necesaria. Si tu red tiene equipos domésticos o switches no gestionados, esa parte se ve peor. Es un buen motivo para renovarlos cuando toque."
    - q: "¿Vale la pena en una empresa pequeña?"
      a: "Suele valer la pena si el trabajo diario pasa por la red. Imagina una mañana entera sin conexión. Si eso frena la facturación, la atención a clientes o la producción, ya tienes la respuesta. Un buen comienzo es vigilar al menos la conexión a internet y el firewall."
    - q: "¿Monitorizar la red supone vigilar lo que hace el personal?"
      a: "No. La monitorización de red mira el estado de los equipos y de los enlaces. Comprueba si están disponibles, cuánta carga tienen, si dan errores y a qué temperatura funcionan. No necesita leer el contenido del tráfico ni el correo de nadie. Si se analizan flujos de tráfico, se hace de forma agregada, para ver qué consume ancho de banda."
  tecnico:
    - q: "¿Qué protocolos se usan para monitorizar una red?"
      a: "Sobre todo SNMP, para leer el estado de los equipos. También se usan sondas activas que comprueban disponibilidad y latencia, y registros syslog. Para ver qué consume el ancho de banda se usa el análisis de flujos, como NetFlow o sFlow. Todo se reúne en un panel con alertas por umbral."
    - q: "¿Se puede monitorizar el WiFi con la misma herramienta que el resto de la red?"
      a: "Sí. La controladora WiFi ya recoge el estado de los puntos de acceso, los clientes conectados y las interferencias. Esos datos se pueden integrar en el mismo panel que los switches y el firewall. Así sabes si el fallo viene de la radio o del cable que llega al punto de acceso."
    - q: "¿La monitorización sustituye al mantenimiento preventivo?"
      a: "No, se complementan. La monitorización detecta síntomas en tiempo real. El mantenimiento preventivo corrige las causas de fondo antes de que generen esos síntomas. Es el caso de un firmware desactualizado o de unos equipos al final de su vida útil."
---
Muchas veces, la primera noticia de un problema en la red es que alguien no puede trabajar. Suena el teléfono y te dicen: «No va nada». Entonces toca reconstruir qué ha pasado, sin datos de cómo estaba la red un rato antes.

Monitorizar la red cambia el orden. Los equipos avisan de las primeras señales, y el historial queda guardado para cuando haga falta. La misma idea, aplicada a servidores y puestos de trabajo, se explica en [soporte IT reactivo o proactivo](/recursos/soporte-it-reactivo-o-proactivo/). Este artículo se centra en la red.

## Qué conviene vigilar en la red

Cada parte de la red da sus propias señales tempranas. Estas son las más útiles:

| Qué se vigila | Señal temprana | Qué permite anticipar |
|---|---|---|
| Conexión a internet y firewall | Latencia alta, pérdida de paquetes, caídas breves | Cortes de conexión y problemas con el cloud o los accesos remotos |
| Enlaces entre switches y entre sedes | Uso cerca del máximo, errores crecientes | Lentitud en horas punta y cuellos de botella |
| Puertos de los switches | Errores, cambios de velocidad, reconexiones | Cables o conectores dañados y equipos que fallan |
| Puntos de acceso WiFi | Clientes por punto de acceso, interferencias, desconexiones | Zonas saturadas o con poca cobertura |
| Equipos de red | Temperatura, uso del procesador (CPU) y memoria, alimentación | Averías de hardware, ventiladores o fuentes que fallan |
| SAI del armario (batería de respaldo) | Estado de la batería, cortes de alimentación | Paradas por un corte eléctrico |

El SAI es un buen ejemplo. Si nadie mira su batería, puede estar agotada justo el día que se va la luz. Si se vigila, el aviso llega antes de que haga falta.

No hace falta vigilarlo todo desde el primer día. Basta con saber qué es crítico y empezar por ahí.

## Cómo funcionan las alertas

Una monitorización útil no avisa de todo: avisa de lo que importa.

- **Umbrales con sentido.** Se fijan a partir de cómo se comporta tu red normalmente (su línea base), no con valores genéricos. Un enlace muy cargado puede ser normal un lunes a las nueve y raro un domingo.
- **Avisos agrupados.** Si cae un switch, no quieres que el móvil te vibre por cada equipo que cuelga de él. Las dependencias se configuran para que llegue un aviso con la causa.
- **Un responsable para cada aviso.** Quién recibe las alertas, en qué horario y qué hace con ellas se decide de antemano.
- **Historial.** Los datos se guardan durante semanas o meses. Sirven para ver tendencias y comparar con lo que pasaba antes de un fallo.

<!-- PENDIENTE: confirmar con ADQA el alcance del servicio de monitorización de red: qué se vigila, en qué horario se atienden las alertas y si hay actuación fuera de horario. El texto no atribuye ningún horario al servicio. -->

Una red ordenada se monitoriza mejor. Si tienes los segmentos bien definidos, como en una [red segmentada](/recursos/red-plana-o-red-segmentada/), cada alerta apunta a una zona concreta. Y el problema se localiza antes.

## Lo que aporta además de evitar cortes

- **Diagnóstico con datos.** Cuando algo falla, tienes el registro de lo que pasaba antes. Así la causa se encuentra más rápido.
- **Inversión con criterio.** Los datos de uso muestran qué enlaces se quedan cortos y qué equipos dan más problemas. Llegas a la reunión de presupuesto con la gráfica en la mano. Es una buena base para decidir [cuándo renovar la red](/recursos/cuando-renovar-la-red-de-tu-empresa/).
- **Varias sedes a la vista.** Con una consola común, ves el estado de todas las oficinas desde el mismo sitio, igual que en un [WiFi multisede](/recursos/wifi-multisede/).

## Por dónde empezar según tu red

| Situación | Qué monitorizar |
|---|---|
| Oficina pequeña, sin servidores propios | Conexión a internet y firewall |
| Empresa con servidores y varias plantas | Además, switches de núcleo, enlaces entre armarios y SAI |
| Uso intensivo del WiFi | Además, puntos de acceso y carga por zonas |
| Varias sedes | Además, enlaces y túneles entre sedes |
| Producción o atención al público que no puede parar | Todo lo anterior, con un horario de atención de alertas definido |

Si no sabes por dónde empezar, hazte una pregunta. ¿Qué equipo, si se apaga, deja a más gente sin trabajar? Ese va primero.

Una guía rápida:

- **Empieza por lo crítico** si no puedes vigilarlo todo. Son la conexión a internet, el firewall, el núcleo de la red y los servidores.
- **Amplía por capas** a medida que la red crece: WiFi, sedes y equipos de planta.
- **Revisa los umbrales** a las pocas semanas. Las primeras alertas sirven para quitar ruido y ajustar lo que de verdad importa.
