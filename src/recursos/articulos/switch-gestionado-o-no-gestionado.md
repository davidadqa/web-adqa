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
tldr: "Un switch no gestionado conecta equipos sin configuración: se enchufa y funciona, pero no permite ver ni ordenar lo que pasa. Uno gestionado muestra el estado de cada puerto, separa la red en VLAN, da prioridad a la voz o a las aplicaciones críticas y envía avisos. En un despacho pequeño, el no gestionado suele bastar; con varios departamentos, telefonía IP o cámaras, conviene el gestionado."
faq:
  manager:
    - q: "¿Compensa pagar más por un switch gestionado?"
      a: "Depende de lo que funcione sobre la red. En un despacho pequeño, sin telefonía IP ni cámaras, uno no gestionado suele bastar. Con varios departamentos, telefonía IP o videovigilancia, la diferencia de precio suele compensar, porque el gestionado permite separar el tráfico, dar prioridad a lo importante y saber qué pasa en cada puerto cuando algo falla."
    - q: "¿Hace falta un técnico dedicado para mantener switches gestionados?"
      a: "No. La configuración inicial la hace un técnico y después solo hay que intervenir para cambios, ampliaciones o actualizaciones de firmware. No requiere dedicación diaria, sobre todo si los switches están monitorizados."
    - q: "¿Cómo sé si los switches de mi empresa son gestionados?"
      a: "Basta con identificar la marca y el modelo de cada equipo y comprobar si tiene interfaz de gestión, web o por línea de comandos. Es una de las primeras comprobaciones de cualquier revisión de red."
  tecnico:
    - q: "¿Qué protocolos de gestión son los habituales?"
      a: "Interfaz web o línea de comandos para la configuración, SNMP para la monitorización externa y el estándar 802.1Q para las VLAN. Muchos modelos admiten además el envío de registros a un servidor y la gestión centralizada desde una consola del fabricante."
    - q: "¿Se pueden mezclar switches gestionados y no gestionados en la misma red?"
      a: "Sí, y es habitual. Lo razonable es que el núcleo y los armarios principales sean gestionados y dejar los no gestionados para puntos de bajo impacto. Un switch no gestionado no distingue VLAN, así que conviene conectarlo a un puerto asignado a una sola VLAN."
    - q: "¿Qué aporta un switch gestionado al diagnosticar una incidencia?"
      a: "Contadores de tráfico y de errores por puerto, el estado de cada enlace, la tabla de equipos conectados y un registro de eventos. Con esos datos se localiza el puerto o el equipo que causa el problema sin tener que ir desconectando cables."
---
A simple vista, un switch gestionado y uno no gestionado hacen lo mismo: conectar ordenadores, impresoras, cámaras y puntos de acceso a la red. La diferencia aparece cuando la red crece y hay que ordenarla por dentro, o cuando algo va lento y hay que saber dónde.

Este artículo explica qué aporta cada uno y cómo saber cuál encaja con la red de tu empresa.

## Qué ofrece un switch no gestionado

- **Cero configuración.** Se conecta y empieza a funcionar.
- **Coste bajo.** Es la opción más económica por puerto.
- **Suficiente para lo sencillo.** Un despacho con pocos equipos, sin telefonía IP ni necesidad de separar tráfico, puede no necesitar más.

Su límite es la visibilidad. El propio switch no informa de lo que pasa en cada puerto: si un equipo satura la red o un puerto empieza a dar errores, hay que encontrarlo por otros medios.

## Qué aporta un switch gestionado

- **Visibilidad puerto por puerto.** Cuánto tráfico pasa por cada puerto, qué errores hay y qué equipo está conectado.
- **Segmentación en VLAN.** Separa oficina, servidores, telefonía, cámaras e invitados dentro del mismo switch físico. Qué aporta esa separación se explica en [red plana o red segmentada](/recursos/red-plana-o-red-segmentada/).
- **Prioridad para el tráfico crítico.** La voz y las aplicaciones de gestión pasan antes que una descarga cuando la red va cargada.
- **Avisos y monitorización.** Puede notificar la caída de un puerto o un tráfico fuera de lo normal, y enviar datos a un sistema de [monitorización de red](/recursos/monitorizacion-de-red/).
- **Configuración documentada.** La configuración se guarda, se revisa y se puede replicar en otros switches.

Entre los dos extremos hay switches con gestión básica, a veces llamados «smart»: suelen permitir crear VLAN y poco más, desde una interfaz web sencilla. Pueden encajar en redes pequeñas que solo necesitan separar a los invitados o las cámaras.

Un hallazgo habitual al revisar una red es que nadie eligió el switch no gestionado: simplemente vino así en la instalación original. Funciona bien mientras la red es pequeña. Cuando crece y aparecen problemas intermitentes, falta información para localizarlos y el diagnóstico se alarga.

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
- **Gestionado** si hay varios departamentos, telefonía IP, videovigilancia, WiFi de invitados o servidores que dependen de la red.
- **Una combinación** cuando hay de todo: gestionados en el núcleo y en los armarios principales, y no gestionados solo en puntos de bajo impacto, como una sala con un par de equipos.

## Si no sabes qué switches tienes

El primer paso es inventariar la electrónica actual: marca, modelo, número de puertos y si el fabricante todavía publica actualizaciones. En la página de [networking empresarial](/telecomunicaciones/networking/) se detalla qué se revisa en cada equipo antes de decidir si se aprovecha o se sustituye.

Si los switches llevan ya muchos años instalados, [cuándo renovar la red de tu empresa](/recursos/cuando-renovar-la-red-de-tu-empresa/) ayuda a plantear el cambio por fases, sin parar la actividad.
