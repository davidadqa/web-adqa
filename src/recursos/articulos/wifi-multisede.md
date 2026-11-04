---
title: "WiFi multisede: una sola red para todas tus sedes | ADQA"
description: "WiFi multisede: qué implica gestionar cada oficina por separado, qué cambia con una gestión centralizada y cómo unificar el WiFi de varias sedes por fases."
h1: "WiFi multisede: gestionar el WiFi de varias oficinas como una sola red"
lead: "Cada sede tiene su propio espacio, pero todas pueden compartir configuración, credenciales y consola."
keyword: "WiFi multisede"
category: redes
tipo: hacer
etiquetas: ["WiFi"]
date: 2026-07-05
updated: 2026-11-02
servicio: "/redes/wifi-entornos-complejos/"
related: ["monitorizacion-de-red", "cuantos-puntos-de-acceso-necesita-tu-wifi", "red-plana-o-red-segmentada"]
imagen: "Mapa con varias oficinas conectadas y una consola que muestra el estado de los puntos de acceso WiFi de cada sede"
tldr: "Gestionar el WiFi de cada sede por separado obliga a duplicar configuración, contraseñas y soporte. Además, no da una visión conjunta. Una gestión multisede centralizada aplica la misma configuración en todas las sedes y muestra el estado de todas desde una sola consola. Con ella, el personal se conecta igual en cualquier oficina. La diferencia crece con el número de sedes."
faq:
  manager:
    - q: "¿Unificar el WiFi de varias sedes es un proyecto largo?"
      a: "Depende del número de sedes. Se puede planificar por fases, sede a sede. Los cambios se programan para que el WiFi de cada oficina apenas se interrumpa durante la transición."
    - q: "¿Importa que cada sede tenga un proveedor de internet distinto?"
      a: "Para el WiFi, no. La gestión centralizada no depende de qué operador dé internet en cada sede. Sí conviene revisarlo si además quieres unificar la conectividad o conectar las oficinas con la central."
    - q: "¿Qué nota el personal después del cambio?"
      a: "Que el portátil y el móvil se conectan solos en cualquier sede, sin pedir contraseñas. Y que las incidencias se resuelven con el mismo criterio en todas las oficinas."
  tecnico:
    - q: "¿Qué arquitectura permite gestionar varias sedes desde una consola?"
      a: "Habitualmente, una controladora WiFi en la nube o virtualizada. Centraliza la configuración y aplica políticas comunes a los puntos de acceso de todas las sedes, estén donde estén."
    - q: "¿Cómo se usan las mismas credenciales si las sedes no están conectadas por una red privada?"
      a: "Con una contraseña compartida, basta con que todas las sedes reciban la misma configuración desde la controladora. Otra opción es que cada persona entre con su propio usuario, por ejemplo con 802.1X. Entonces los puntos de acceso de cada sede tienen que llegar al servidor de autenticación. Pueden hacerlo a través de una VPN o con un servicio de autenticación en la nube. La VPN es un túnel cifrado a través de internet."
    - q: "¿Se puede aplicar una política distinta en una sede concreta?"
      a: "Sí. La gestión centralizada admite reglas comunes con excepciones donde hagan falta. Puede ser una red adicional para el almacén de una sede o un horario distinto para la red de invitados."
---
Cuando abres una segunda sede, lo habitual es replicar el WiFi de la primera. Se compra un equipo parecido, se configura por separado y listo. Funciona. Pero te deja dos redes independientes, con configuraciones y contraseñas distintas y sin una visión conjunta.

Con dos sedes se nota poco. Con cinco, cada cambio se convierte en cinco cambios.

## Lo que implica gestionar cada sede por separado

- **Configuración duplicada.** Cada cambio de política de seguridad o de contraseña se hace sede por sede. Es fácil que alguna quede desactualizada.
- **Una experiencia distinta en cada oficina.** Si vas a otra sede, te toca pedir la contraseña en recepción y conectarte con otras credenciales.
- **Sin visión conjunta.** Para saber qué pasa hay que revisar cada red por separado, a veces llamando a cada oficina.
- **Soporte más lento.** Cada incidencia exige conocer la configuración concreta de esa sede. No se parte de una base común.

## Qué cambia con una gestión centralizada

- **Una configuración para todas las sedes.** Los cambios de política se hacen una vez y se aplican en todas.
- **Las mismas credenciales en cualquier oficina.** Llegas a otra sede, abres el portátil y ya estás conectado, sin contraseñas nuevas.
- **Una consola para todo.** Los puntos de acceso de todas las sedes se ven en la misma pantalla. Un equipo caído en una oficina lejana avisa igual que uno de la central. Es la base de una buena [monitorización de red](/recursos/monitorizacion-de-red/).
- **Crecer es sumar.** Una sede nueva se añade a la [controladora centralizada](/redes/wifi-entornos-complejos/) en lugar de montarse desde cero.

Centralizar la gestión no significa que todas las sedes sean idénticas. Cada una necesita su propio [estudio de cobertura](/recursos/cuantos-puntos-de-acceso-necesita-tu-wifi/), porque los espacios y los usos cambian. Lo que comparten es lo demás: la configuración, las políticas y la consola.

## El WiFi y la conexión entre sedes

Con una controladora en la nube, gestionar el WiFi de forma centralizada no exige conectar tus sedes entre sí. Cada punto de acceso habla con la controladora a través de internet. Otra cosa es lo que necesita tu equipo una vez conectado.

¿Y si desde la delegación alguien abre cada mañana una carpeta del servidor de la central? Llegar a los servidores, a la telefonía o a las aplicaciones de la central es otra pieza. Esa [interconexión de sedes](/telecomunicaciones/networking/) se diseña a la vez que el WiFi. Así cada red WiFi lleva a los mismos segmentos, con las mismas reglas en todas partes.

## Varias sedes en la práctica

Lo que más se nota al unificar no suele ser técnico, sino organizativo. Deja de haber en cada oficina una persona distinta «encargada del WiFi», esa a la que todos buscan cuando algo falla. Pasa a haber una sola configuración de la que dependen todas por igual.

Dos proyectos reales lo muestran a escalas muy distintas. En KUKA Robots Iberia, la red de la central de España se completó con una implantación dirigida en delegaciones. Entre ellas están la del País Vasco y la de Argentina. En el Consorci Sanitari Alt Penedès-Garraf, el WiFi para pacientes y usuarios llega a cada uno de sus centros. Puedes verlos en [casos de éxito](/casos-de-exito/).

## Cómo decidirlo

| Criterio | Cada sede por separado | Gestión multisede centralizada |
|---|---|---|
| Configuración | Duplicada en cada sede | Una sola, aplicada a todas |
| Personal que se mueve entre sedes | Se conecta con otras credenciales | Se conecta igual en todas |
| Visibilidad | Sede por sede | Una consola para todas |
| Resolución de incidencias | Más lenta: cada sede es distinta | Más rápida: base común conocida |
| Añadir una sede | Un proyecto nuevo cada vez | Se suma a lo que ya existe |

Para decidir rápido:

- **Gestión centralizada** casi siempre que haya más de una sede y el número pueda crecer.
- **Con prioridad** si tu personal se mueve a menudo entre sedes o las reuniones rotan de oficina.
- **Por fases** si ya tienes varias sedes con redes independientes. Se pueden ir unificando una a una, sin rehacerlo todo de golpe.
