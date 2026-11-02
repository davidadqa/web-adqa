---
title: "Red plana o red segmentada: cuándo separar la red | ADQA"
description: "Red plana o red segmentada: qué aporta separar la red en VLAN, cuándo compensa hacerlo y cómo plantear la segmentación por fases sin parar el trabajo."
h1: "Red plana o red segmentada: cómo organizar la red de tu empresa por zonas"
lead: "Separar la red por zonas apenas cambia el día a día, y ayuda a que un problema se quede donde empieza."
keyword: "red plana o red segmentada"
category: redes
etiquetas: ["Segmentación", "Seguridad"]
date: 2026-07-02
updated: 2026-11-02
servicio: "/redes/"
related: ["switch-gestionado-o-no-gestionado", "firewall-gestionado-o-propio", "monitorizacion-de-red"]
imagen: "Armario de comunicaciones con switches gestionados y cables de colores que identifican las distintas VLAN de la red"
tldr: "Una red plana conecta todos los dispositivos en el mismo segmento: es sencilla de montar, pero no tiene barreras internas. Una red segmentada divide la red en zonas según su función o su nivel de riesgo, como oficina, producción, invitados o videovigilancia, con reglas sobre qué puede comunicarse con qué. Así, un problema en una zona no se extiende a las demás."
faq:
  manager:
    - q: "¿Segmentar la red obliga a cambiar el cableado o el WiFi?"
      a: "Normalmente no. Se hace con la configuración de los switches y de los puntos de acceso que ya hay, siempre que admitan VLAN. Si algún switch no las admite, se sustituye ese equipo, no la instalación."
    - q: "¿Es algo solo para empresas grandes?"
      a: "No. Cualquier empresa con WiFi de invitados, cámaras o algún sistema de producción conectado a la red se beneficia de separarlos del resto, sea cual sea su tamaño."
    - q: "¿Cuánto se tarda en segmentar una red?"
      a: "Depende del tamaño de la red y del número de sedes. Habitualmente se resuelve en días, por fases, con los cambios que afectan al servicio programados fuera de horario."
  tecnico:
    - q: "¿Qué segmentos se crean primero en una empresa típica?"
      a: "Habitualmente, oficina o administración, servidores, producción o dispositivos IoT, WiFi de invitados y videovigilancia, cada uno en su VLAN y con reglas de tráfico entre ellos según la necesidad real."
    - q: "¿Dónde se aplican las reglas entre segmentos?"
      a: "Hay dos sitios habituales. El firewall permite reglas más finas y registra el tráfico entre zonas. Los switches de capa 3 del núcleo enrutan más rápido entre segmentos internos de confianza, con listas de acceso más sencillas. Muchas redes combinan los dos."
    - q: "¿Cómo se comprueba que una red está bien segmentada?"
      a: "Revisando la configuración de switches, puntos de acceso y firewall, y comprobando que el tráfico permitido entre segmentos coincide con el diseño. No basta con el diagrama: hay que probarlo desde dentro de cada zona."
---
Cuando una red funciona, nadie se pregunta cómo está organizada por dentro. En muchas empresas, ordenadores, impresoras, cámaras, sistemas de producción y el WiFi de invitados comparten la misma red, sin separación entre ellos. Es la forma más rápida de montarla, y durante años nadie lo nota.

La diferencia aparece el día que un equipo da problemas. En una red segmentada, ese problema se queda en su zona. En una red plana, no hay nada que lo frene.

## Qué implica una red plana

- **Montaje sencillo.** Todo conectado a los mismos switches, sin configuración adicional.
- **Sin fricción en el día a día.** Cualquier dispositivo ve a cualquier otro, lo que resulta cómodo mientras la red es pequeña.
- **Sin barreras internas.** Si un portátil se infecta o un invitado conecta un dispositivo comprometido, nada impide que el problema llegue a los servidores o a los sistemas de producción.
- **Fallos que afectan a todos.** Un equipo que satura la red o un bucle en un switch se nota en toda la empresa, y cuesta localizar el origen.

En las revisiones de red es un hallazgo frecuente: producción, oficina y WiFi de invitados en una misma red completamente plana. Separarla suele ser una de las primeras recomendaciones, porque aprovecha en gran parte los equipos que ya hay.

## Qué aporta segmentar con VLAN

Segmentar consiste en dividir la red en varias redes lógicas, las VLAN, que comparten cables y switches pero funcionan como si estuvieran separadas.

- **Zonas aisladas por función.** El WiFi de invitados no ve la red de oficina, y los equipos de producción no comparten segmento con los puestos administrativos.
- **Incidentes contenidos.** Si un dispositivo se ve comprometido, el daño queda limitado a su segmento.
- **Tráfico ordenado.** Cada zona puede tener su prioridad: la telefonía primero, y las cámaras sin competir con la aplicación de gestión.
- **Mejor posición ante una auditoría.** En auditorías como las del [ENS](/recursos/certificacion-ens-categoria-alta/), tener los sistemas críticos separados del resto de la red es un punto a favor.

Segmentar no sustituye al firewall: lo complementa. Las VLAN separan las zonas y el firewall decide qué puede pasar de una a otra. Por eso las reglas se diseñan junto con la segmentación, sea el [firewall gestionado o propio](/recursos/firewall-gestionado-o-propio/).

## Cómo pasar de una red plana a una segmentada

No hace falta rehacer la red. Lo habitual es avanzar por pasos:

1. **Inventariar.** Qué dispositivos hay, dónde están y con qué necesita comunicarse cada uno.
2. **Comprobar los switches.** Para crear VLAN hacen falta switches que las admitan. Si alguno es [no gestionado](/recursos/switch-gestionado-o-no-gestionado/), es el primer cambio.
3. **Separar primero lo más expuesto.** Los invitados y las cámaras suelen ser los primeros segmentos; después, servidores, producción y dispositivos IoT.
4. **Definir las reglas entre zonas.** Qué puede comunicarse con qué, y nada más.
5. **Comprobar que funciona.** Revisar que el tráfico real coincide con el diseño. Un [pentesting interno](/recursos/pentesting-interno-o-externo/) es una buena forma de verificarlo.

Los cambios que afectan al servicio se programan por zonas o fuera de horario, así que el trabajo diario apenas se interrumpe. Al final conviene dejar documentada la tabla de segmentos, con cada VLAN y lo que puede hacer, como parte de la [arquitectura de la red](/telecomunicaciones/networking/).

## Cómo decidirlo

| Criterio | Red plana | Red segmentada (VLAN) |
|---|---|---|
| Configuración | Mínima | Media; una vez hecha, es transparente para el usuario |
| Contención de un incidente | Ninguna | El problema queda en su segmento |
| WiFi de invitados | Comparte red con la oficina | Aislado, solo con salida a internet |
| Producción y oficina | Mezcladas | Separadas, con reglas entre ellas |
| Auditorías (ENS y otras) | Punto débil | Punto a favor |
| Coste | Ninguno adicional | Sobre todo configuración, si los switches admiten VLAN |

Una guía rápida:

- **Red plana** solo en redes muy pequeñas, sin invitados ni sistemas críticos.
- **Red segmentada** si tienes WiFi de invitados, producción, videovigilancia o cualquier mezcla de dispositivos distintos.
- **Una revisión de la red** si no sabes cómo está organizada hoy: es habitual que nadie la haya revisado desde la instalación.
