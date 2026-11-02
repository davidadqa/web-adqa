---
title: "Red plana o red segmentada: cuándo separar la red | ADQA"
description: "Red plana o red segmentada: qué aporta separar la red en VLAN, cuándo compensa hacerlo y cómo plantear la segmentación por fases sin parar el trabajo."
h1: "Red plana o red segmentada: cómo organizar la red de tu empresa por zonas"
lead: "Separar la red por zonas apenas cambia el día a día. Y ayuda a que un problema se quede donde empieza."
keyword: "red plana o red segmentada"
category: redes
etiquetas: ["Segmentación", "Seguridad"]
date: 2026-07-02
updated: 2026-11-02
servicio: "/redes/"
related: ["switch-gestionado-o-no-gestionado", "firewall-gestionado-o-propio", "monitorizacion-de-red"]
imagen: "Armario de comunicaciones con switches gestionados y cables de colores que identifican las distintas VLAN de la red"
tldr: "Una red plana conecta todos los dispositivos en el mismo segmento. Es sencilla de montar, pero no tiene barreras internas. Una red segmentada divide la red en zonas según su función o su nivel de riesgo, como oficina, producción, invitados o videovigilancia. Unas reglas fijan qué puede comunicarse con qué. Así, un problema en una zona no se extiende a las demás."
faq:
  manager:
    - q: "¿Segmentar la red obliga a cambiar el cableado o el WiFi?"
      a: "Normalmente no. Se hace configurando los switches y los puntos de acceso que ya tienes, siempre que admitan VLAN. Si algún switch no las admite, se sustituye ese equipo, no la instalación."
    - q: "¿Es algo solo para empresas grandes?"
      a: "No. Basta con tener WiFi de invitados, cámaras o algún sistema de producción conectado a la red. En ese caso, te conviene separarlos del resto, sea cual sea el tamaño de tu empresa."
    - q: "¿Cuánto se tarda en segmentar una red?"
      a: "Depende del tamaño de la red y del número de sedes. Habitualmente se resuelve en días, por fases. Los cambios que afectan al servicio se programan fuera de horario."
  tecnico:
    - q: "¿Qué segmentos se crean primero en una empresa típica?"
      a: "Habitualmente se separan oficina o administración, servidores, producción o dispositivos IoT, WiFi de invitados y videovigilancia. Cada uno va en su VLAN, con reglas de tráfico entre ellos según la necesidad real."
    - q: "¿Dónde se aplican las reglas entre segmentos?"
      a: "Hay dos sitios habituales. El firewall permite reglas más finas y registra el tráfico entre zonas. Los switches de capa 3 del núcleo enrutan más rápido entre segmentos internos de confianza. Usan listas de acceso más sencillas. Muchas redes combinan los dos."
    - q: "¿Cómo se comprueba que una red está bien segmentada?"
      a: "Revisando la configuración de switches, puntos de acceso y firewall, y comprobando que el tráfico permitido entre segmentos coincide con el diseño. No basta con el diagrama: hay que probarlo desde dentro de cada zona."
---
Cuando una red funciona, nadie se pregunta cómo está organizada por dentro. En muchas empresas, ordenadores, impresoras, cámaras, sistemas de producción y el WiFi de invitados comparten la misma red, sin separación. Es la forma más rápida de montarla, y durante años nadie lo nota.

La diferencia aparece cuando un equipo da problemas o cuando una visita conectada desde la sala de espera ve tu servidor de facturas. En una red segmentada, cada problema se queda en su zona. En una red plana, no hay nada que lo frene.

## Qué implica una red plana

- **Montaje sencillo.** Todo conectado a los mismos switches, sin configuración adicional.
- **Sin fricción en el día a día.** Cualquier dispositivo ve a cualquier otro. Es cómodo mientras la red es pequeña.
- **Sin barreras internas.** Si un portátil se infecta, el problema puede llegar a los servidores o a los sistemas de producción. Lo mismo si un invitado conecta un dispositivo comprometido.
- **Fallos que afectan a todos.** Un equipo que satura la red o un bucle en un switch se nota en toda la empresa. Y cuesta localizar el origen. Para un bucle basta un cable con los dos extremos enchufados al switch de debajo de una mesa.

En las revisiones de red es frecuente encontrar producción, oficina y WiFi de invitados en una misma red, completamente plana. Separarla suele ser una de las primeras recomendaciones, porque aprovecha en gran parte los equipos que ya tienes.

## Qué aporta segmentar con VLAN

Segmentar consiste en dividir la red en varias redes lógicas, las VLAN. Comparten cables y switches, pero funcionan como si estuvieran separadas. Es como un edificio con varias empresas: el ascensor es de todos, pero cada puerta tiene su llave.

- **Zonas aisladas por función.** El WiFi de invitados no ve la red de oficina. Y los equipos de producción no comparten segmento con los puestos administrativos.
- **Incidentes contenidos.** Si un dispositivo se ve comprometido, el daño queda limitado a su segmento.
- **Tráfico ordenado.** Cada zona puede tener su prioridad. La telefonía va primero, y las cámaras no compiten con la aplicación de gestión.
- **Mejor posición ante una auditoría.** En auditorías como las del [Esquema Nacional de Seguridad (ENS)](/recursos/certificacion-ens-categoria-alta/), separar los sistemas críticos cuenta a tu favor.

Segmentar no sustituye al firewall: lo complementa. Las VLAN separan las zonas y el firewall decide qué puede pasar de una a otra. Por eso las reglas se diseñan junto con la segmentación, sea el [firewall gestionado o propio](/recursos/firewall-gestionado-o-propio/).

## Cómo pasar de una red plana a una segmentada

No hace falta rehacer la red. Lo habitual es avanzar por pasos:

1. **Inventariar.** Qué dispositivos hay, dónde están y con qué necesita comunicarse cada uno. Suele empezar delante del armario, apuntando qué hay en cada puerto.
2. **Comprobar los switches.** Para crear VLAN hacen falta switches que las admitan. Si alguno es [no gestionado](/recursos/switch-gestionado-o-no-gestionado/), es el primer cambio.
3. **Separar primero lo más expuesto.** Los invitados y las cámaras suelen ser los primeros segmentos. Después vienen servidores, producción y dispositivos IoT, como sensores o pantallas conectadas.
4. **Definir las reglas entre zonas.** Qué puede comunicarse con qué, y nada más.
5. **Comprobar que funciona.** Revisar que el tráfico real coincide con el diseño. Un [pentesting interno](/recursos/pentesting-interno-o-externo/) es una buena forma de verificarlo.

Los cambios que afectan al servicio se programan por zonas o fuera de horario. Así, el trabajo diario apenas se interrumpe. Al final, conviene dejar documentada la tabla de segmentos, con cada VLAN y lo que puede hacer. Es parte de la [arquitectura de la red](/telecomunicaciones/networking/).

## Cómo decidirlo

| Criterio | Red plana | Red segmentada (VLAN) |
|---|---|---|
| Configuración | Mínima | Media; una vez hecha, es transparente para el usuario |
| Contención de un incidente | Ninguna | El problema queda en su segmento |
| WiFi de invitados | Comparte red con la oficina | Aislado, solo con salida a internet |
| Producción y oficina | Mezcladas | Separadas, con reglas entre ellas |
| Auditorías (ENS y otras) | Punto débil | Punto a favor |
| Coste | Ninguno adicional | Sobre todo configuración, si los switches admiten VLAN |

Una prueba sencilla: abre en tu portátil la lista de dispositivos de la red. Si ves las cámaras y las máquinas de producción, lo más probable es que tu red sea plana.

Una guía rápida:

- **Red plana** solo en redes muy pequeñas, sin invitados ni sistemas críticos.
- **Red segmentada** si tienes WiFi de invitados, producción, videovigilancia o cualquier mezcla de dispositivos distintos.
- **Una revisión de la red** si no sabes cómo está organizada hoy. Es habitual que nadie la haya revisado desde la instalación.
