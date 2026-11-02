---
title: "Switch gestionado o no gestionado: cuál elegir | ADQA"
description: "Switch gestionado o no gestionado: qué aporta cada uno en visibilidad, VLAN y prioridad del tráfico, y cómo saber cuál necesita la red de tu empresa."
h1: "Switch gestionado o no gestionado: qué diferencia hay y cuál necesita tu empresa"
lead: "Los dos conectan equipos. La diferencia está en lo que puedes ver, ordenar y priorizar dentro de la red."
keyword: "switch gestionado o no gestionado"
category: redes
etiquetas: ["Switching", "Segmentación", "Monitorización"]
date: 2026-07-03
updated: 2026-11-02
servicio: "/telecomunicaciones/networking/"
related: ["red-plana-o-red-segmentada", "monitorizacion-de-red", "cuando-renovar-la-red-de-tu-empresa"]
imagen: "Armario de red de una oficina con dos switches, latiguillos de colores ordenados y las luces de los puertos encendidas"
tldr: "Un switch no gestionado conecta equipos sin configuración. Se enchufa y funciona, pero no permite ver ni ordenar lo que pasa. Uno gestionado muestra el estado de cada puerto y separa la red en VLAN. También da prioridad a la voz o a las aplicaciones críticas y envía avisos. En un despacho pequeño, el no gestionado suele bastar. Con varios departamentos, telefonía IP o cámaras, conviene el gestionado."
faq:
  manager:
    - q: "¿Compensa pagar más por un switch gestionado?"
      a: "Depende de lo que funcione sobre tu red. En un despacho pequeño, sin telefonía IP ni cámaras, uno no gestionado suele bastar. Con varios departamentos, telefonía IP o videovigilancia, la diferencia de precio suele compensar. El gestionado te permite separar el tráfico y dar prioridad a lo importante. Y saber qué pasa en cada puerto cuando algo falla."
    - q: "¿Hace falta un técnico dedicado para mantener switches gestionados?"
      a: "No. La configuración inicial la hace un técnico. Después solo hay que intervenir para cambios, ampliaciones o actualizaciones de firmware. No requiere dedicación diaria, sobre todo si los switches están monitorizados."
    - q: "¿Cómo sé si los switches de mi empresa son gestionados?"
      a: "Basta con identificar la marca y el modelo de cada equipo. Después comprueba si tiene interfaz de gestión, web o por línea de comandos. Es una de las primeras comprobaciones de cualquier revisión de red."
  tecnico:
    - q: "¿Qué protocolos de gestión son los habituales?"
      a: "Interfaz web o línea de comandos para la configuración. SNMP para la monitorización externa. Y el estándar 802.1Q para las VLAN. Muchos modelos admiten además enviar registros a un servidor y gestionarse desde una consola centralizada del fabricante."
    - q: "¿Se pueden mezclar switches gestionados y no gestionados en la misma red?"
      a: "Sí, y es habitual. Lo razonable es que el núcleo y los armarios principales sean gestionados. Los no gestionados quedan para puntos de bajo impacto. Un switch no gestionado no distingue VLAN. Por eso conviene conectarlo a un puerto asignado a una sola VLAN."
    - q: "¿Qué aporta un switch gestionado al diagnosticar una incidencia?"
      a: "Te da contadores de tráfico y de errores por puerto, y el estado de cada enlace. También la tabla de equipos conectados y un registro de eventos. Con esos datos localizas el puerto o el equipo que causa el problema. No tienes que ir desconectando cables."
---
En el armario, un switch gestionado y uno no gestionado parecen iguales: una caja con puertos y lucecitas. Los dos conectan a la red ordenadores, impresoras, cámaras y puntos de acceso. La diferencia aparece cuando tu red crece y hay que ordenarla por dentro. O cuando algo va lento y necesitas saber dónde.

Lo que sigue te ayuda a ver qué aporta cada uno y cuál encaja con tu red.

## Qué ofrece un switch no gestionado

- **Cero configuración.** Se conecta y empieza a funcionar.
- **Coste bajo.** Es la opción más económica por puerto.
- **Suficiente para lo sencillo.** Un despacho con pocos equipos, sin telefonía IP ni tráfico que separar, puede no necesitar más.

Su límite es la visibilidad. El propio switch no te dice qué pasa en cada puerto. Si un equipo satura la red o un puerto da errores, hay que encontrarlo por otros medios. En la práctica, toca ir al armario y desconectar cables uno a uno hasta dar con él.

## Qué aporta un switch gestionado

- **Visibilidad puerto por puerto.** Ves cuánto tráfico pasa por cada puerto, qué errores hay y qué equipo está conectado.
- **Segmentación en VLAN.** Las VLAN son redes virtuales dentro del mismo switch físico. Separan oficina, servidores, telefonía, cámaras e invitados. Así, el grabador de las cámaras queda en su propia red, aparte de los ordenadores de la oficina. Qué aporta esa separación lo tienes en [red plana o red segmentada](/recursos/red-plana-o-red-segmentada/).
- **Prioridad para el tráfico crítico.** La voz y las aplicaciones de gestión pasan antes que una descarga cuando la red va cargada.
- **Avisos y monitorización.** Puede notificar la caída de un puerto o un tráfico fuera de lo normal. Y enviar datos a un sistema de [monitorización de red](/recursos/monitorizacion-de-red/).
- **Configuración documentada.** La configuración se guarda, se revisa y se puede replicar en otros switches.

Entre los dos extremos hay switches con gestión básica, a veces llamados «smart». Suelen permitir crear VLAN y poco más, desde una interfaz web sencilla. Pueden encajar en redes pequeñas que solo necesitan separar a los invitados o las cámaras.

Al revisar una red, es habitual descubrir que nadie eligió el switch no gestionado. Simplemente vino así en la instalación original. Funciona bien mientras la red es pequeña. Cuando crece y aparecen problemas intermitentes, falta información para localizarlos y el diagnóstico se alarga.

## Cómo decidirlo

| Criterio | Switch no gestionado | Switch gestionado |
|---|---|---|
| Configuración | Ninguna | Adaptada a la red |
| Visibilidad del tráfico | Ninguna | Puerto por puerto |
| Segmentación (VLAN) | No | Sí |
| Prioridad de tráfico (QoS) | No | Sí |
| Avisos y monitorización | No | Sí |
| Coste | Bajo | Mayor, según puertos y funciones |
| Encaja en | Despachos pequeños sin sistemas críticos | Empresas con varios departamentos, telefonía IP, cámaras o servidores |

Una guía rápida:

- **No gestionado** para una red muy pequeña, sin telefonía IP, cámaras ni necesidad de separar tráfico.
- **Gestionado** si tienes varios departamentos, telefonía IP, videovigilancia, WiFi de invitados o servidores que dependen de la red.
- **Una combinación** cuando hay de todo. Gestionados en el núcleo y en los armarios principales. No gestionados solo en puntos de bajo impacto, como una sala con un par de equipos.

## Si no sabes qué switches tienes

El primer paso es hacer inventario de la electrónica que tienes. Abre el armario y apunta, de cada switch:

- la marca;
- el modelo;
- el número de puertos;
- si el fabricante todavía publica actualizaciones.

En la página de [networking empresarial](/telecomunicaciones/networking/) verás qué se revisa en cada equipo. Con eso se decide si se aprovecha o se sustituye.

¿Tus switches llevan ya muchos años instalados? Lee [cuándo renovar la red de tu empresa](/recursos/cuando-renovar-la-red-de-tu-empresa/). Te ayuda a plantear el cambio por fases, sin parar la actividad.
