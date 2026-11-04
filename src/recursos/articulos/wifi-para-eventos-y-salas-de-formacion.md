---
title: "WiFi para eventos y salas de formación | ADQA"
description: "WiFi para eventos y salas de formación: por qué con muchos asistentes el reto es la capacidad, no la cobertura, y cómo preparar la red para los picos de uso."
h1: "WiFi para eventos y salas de formación: cuando decenas de personas se conectan a la vez"
lead: "Con la sala llena, el reto no es que la señal llegue. Es que alcance para todos a la vez."
keyword: "WiFi para eventos y salas de formación"
category: redes
tipo: hacer
etiquetas: ["WiFi"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/redes/wifi-entornos-complejos/"
related: ["cuantos-puntos-de-acceso-necesita-tu-wifi", "red-plana-o-red-segmentada", "wifi-domestico-o-wifi-profesional"]
imagen: "Sala de formación llena de asistentes trabajando con portátiles, con varios puntos de acceso WiFi en el techo"
tldr: "En eventos y salas de formación, el problema del WiFi no suele ser de cobertura, sino de capacidad. La señal llega a todas las sillas, pero los puntos de acceso no pueden atender bien a tantos dispositivos a la vez. La red se calcula por el número de dispositivos esperados, no por los metros de la sala. Los picos puntuales se planifican con antelación."
faq:
  manager:
    - q: "¿Hace falta equipamiento distinto para un evento puntual?"
      a: "No siempre. A veces basta con ajustar la configuración de la red. Otras veces se añaden puntos de acceso temporales para cubrir el pico de ocupación de esos días."
    - q: "¿Con cuánta antelación hay que preparar la red para un evento?"
      a: "Cuanta más, mejor, sobre todo si hace falta equipamiento adicional o una revisión previa de la sala. Si preparas la red el mismo día, no te queda margen para corregir nada."
    - q: "¿Se puede comprobar antes del evento que la red aguantará?"
      a: "Sí. Se revisa la configuración y se calcula la capacidad con el número de asistentes previsto. Cuando es posible, se hace una prueba con dispositivos reales en la sala. Durante la jornada, la carga de cada punto de acceso se puede seguir en tiempo real."
  tecnico:
    - q: "¿Cuántos dispositivos puede atender bien un punto de acceso en alta densidad?"
      a: "Depende del modelo, de las bandas disponibles y de la configuración. En alta densidad se calcula con márgenes mucho más conservadores que en una oficina. Y la carga se reparte entre varios puntos de acceso."
    - q: "¿Conviene llevar a los asistentes a las bandas de 5 y 6 GHz?"
      a: "Suele ayudar. Las bandas de 5 y 6 GHz ofrecen más canales que la de 2,4 GHz. Así, los puntos de acceso cercanos no se pisan entre sí. La de 2,4 GHz se deja para los dispositivos que solo funcionan en ella."
    - q: "¿Cómo se gestiona el acceso de los asistentes?"
      a: "Con una red de invitados separada de la interna. Se entra con un portal cautivo o con credenciales temporales para la jornada. El portal cautivo es la página de acceso que aparece al conectarse. Cada usuario tiene un límite de ancho de banda. Al ir en una red aparte, los asistentes navegan sin ver la de la empresa."
---
Tu WiFi funciona bien todo el año. Pero puede colapsar el día que se llena la sala de formación o organizas una jornada con cien personas conectadas a la vez. El formador pide a todos que abran la plataforma del curso, y la página se queda en blanco.

No se ha estropeado. Está pensado para tu día a día en la oficina, no para un pico de ocupación que solo llega unos días al año. La buena noticia es que ese pico se puede prever y calcular.

## Por qué la cobertura no es el problema

Tu móvil marca todas las rayas y, aun así, el correo se queda en la bandeja de salida. Un punto de acceso puede tener señal excelente en toda la sala. Pero si ciento cincuenta dispositivos intentan usarlo a la vez, irá lento igualmente.

Cada punto de acceso tiene un límite práctico de clientes simultáneos con buen rendimiento. Da igual la fuerza con la que llegue la señal. La diferencia entre cobertura y capacidad se explica en [cuántos puntos de acceso necesita tu WiFi](/recursos/cuantos-puntos-de-acceso-necesita-tu-wifi/).

En una sala llena, la saturación suele venir de tres sitios:

- **Un solo punto de acceso para toda la sala.** Por muy potente que sea, el número de dispositivos que atiende bien es limitado.
- **Todos en el mismo canal.** Los dispositivos que comparten canal se turnan para transmitir: cuantos más hay, más esperan.
- **Dispositivos muy distintos.** Portátiles, móviles y tablets con capacidades diferentes conviven en la misma red. Los más lentos ocupan el canal más tiempo.

## Cómo se diseña una red para alta densidad

- **Se calcula por dispositivos, no por metros.** Cuántas personas habrá y cuántos dispositivos lleva cada una. Suele ser más de uno: piensa en el portátil y el móvil de cada asistente.
- **Varios puntos de acceso con potencia moderada.** En [alta densidad](/redes/wifi-entornos-complejos/), varios equipos con la potencia ajustada reparten mejor la carga que uno solo muy potente.
- **Tráfico separado por función.** Ponentes, organización y retransmisión van en su propia red, aparte de la de asistentes. Así la retransmisión no se corta cuando media sala sube fotos de la ponencia. Es la misma lógica que la de una [red segmentada](/recursos/red-plana-o-red-segmentada/).
- **Límite de ancho de banda por usuario.** Evita que unas pocas descargas o un vídeo en alta calidad frenen al resto de la sala.
- **Refuerzo planificado para los picos puntuales.** Si la alta ocupación es excepcional, como una jornada anual, puedes reforzar la red solo para esos días.

<!-- PENDIENTE: confirmar con ADQA si ofrece refuerzo temporal de WiFi para eventos puntuales y si quiere citar experiencia en eventos. El texto lo plantea como opción técnica, sin atribuirlo como servicio. -->

## Antes y durante la jornada

Una jornada con mucha gente se prepara como cualquier otro montaje: con tiempo y sin dar nada por supuesto. Igual que pruebas el micro y el proyector la víspera, te conviene probar también la red. Su preparación tiene tres momentos:

- **Antes:** calcular la capacidad con el número de asistentes previsto y revisar canales y potencias. Si es posible, probar la sala con dispositivos reales.
- **Durante:** seguir la carga de cada punto de acceso y el número de clientes conectados. Así se puede actuar si una zona se satura. Es una aplicación directa de la [monitorización de red](/recursos/monitorizacion-de-red/).
- **Después:** revisar los datos de uso. Si tus jornadas se repiten, te dicen si basta con un refuerzo o si compensa un diseño permanente.

## Cómo decidirlo

| Situación | Qué necesitas |
|---|---|
| Sala de reuniones habitual, pocas personas | La infraestructura estándar suele bastar |
| Sala de formación con decenas de asistentes con portátil | Cálculo de capacidad, no solo de cobertura |
| Evento puntual con cientos de asistentes | Refuerzo temporal, planificado con antelación |
| Alta ocupación frecuente (formación recurrente, auditorio) | Diseño permanente pensado para ese pico |

El calendario de la sala te da media respuesta. No es lo mismo una jornada al año que un curso cada semana.

Para decidir rápido:

- **Cálculo de capacidad** siempre que esperes decenas de dispositivos en el mismo espacio y al mismo tiempo.
- **Refuerzo temporal** si es un evento puntual y el resto del año la ocupación es normal.
- **Rediseño permanente** si la alta ocupación es habitual y no algo excepcional.
