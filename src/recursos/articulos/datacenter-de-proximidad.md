---
title: "Datacenter de proximidad: qué es y cuándo conviene | ADQA"
description: "Qué es un datacenter de proximidad, qué incluye, qué conviene preguntar antes de elegir uno y en qué situaciones encaja mejor que la oficina o la nube pública."
h1: "Datacenter de proximidad: qué es y cuándo le conviene a tu empresa"
lead: "Una tercera vía entre dejar los servidores en la oficina y llevarlos a la nube pública."
keyword: "datacenter de proximidad"
category: cloud
etiquetas: ["Datacenter"]
date: 2026-07-01
updated: 2026-11-02
servicio: "/sistemas-cloud/datacenter/"
related: ["datacenter-propio-o-nube-publica", "enlace-privado-oficina-datacenter", "backup-y-continuidad-de-negocio"]
imagen: "Pasillo de un datacenter con racks de servidores cerrados y un técnico revisando un equipo"
tldr: "Un datacenter de proximidad es una instalación cercana a la empresa, preparada para alojar servidores con temperatura controlada, alimentación redundante y acceso restringido, y atendida por un equipo con el que se puede hablar directamente. No ofrece la escala de la nube pública; a cambio, da control, cercanía y un coste previsible. Encaja con cargas estables y críticas más que con picos de demanda imprevisibles."
faq:
  manager:
    - q: "¿Un datacenter de proximidad es una alternativa real a la nube pública?"
      a: "Sí. No es una versión reducida de la nube, sino una opción que resuelve necesidades distintas: control, cercanía y coste previsible, frente a escala y elasticidad. Muchas empresas que podrían usar la nube pública eligen un datacenter cercano porque encaja mejor con cómo trabajan, y otras combinan los dos."
    - q: "¿En qué se diferencia de tener los servidores en la oficina?"
      a: "En el entorno y en quién lo cuida. En un datacenter, los servidores están en una sala preparada para ellos, con temperatura estable, alimentación redundante y acceso controlado, y no dependen del aire acondicionado ni del SAI de la oficina. Un corte de luz o una avería de la climatización en la oficina ya no afecta a los servidores."
    - q: "¿Un datacenter de proximidad se queda corto si la empresa crece?"
      a: "No, si la infraestructura se dimensiona con margen desde el principio y se revisa de forma periódica. Los servidores virtuales se amplían sin comprar hardware nuevo, y nada impide combinar el datacenter para lo crítico con la nube pública para lo que necesite crecer a picos."
  tecnico:
    - q: "¿Qué tiempos de intervención física conviene acordar?"
      a: "Depende de lo crítico que sea cada sistema, y debe quedar por escrito en el contrato. En un datacenter cercano, quien interviene suele conocer ya el montaje, y eso acorta el diagnóstico. Antes de firmar, conviene preguntar qué plazos se comprometen, en qué horario y cómo queda registrada cada actuación."
    - q: "¿Cómo se gestiona la redundancia frente a una nube con varias zonas de disponibilidad?"
      a: "Depende del proveedor. Hay que revisar la redundancia eléctrica, la de refrigeración y la de conectividad, y si las copias se guardan en un segundo emplazamiento. No es automático como en una nube con varias zonas, así que conviene preguntarlo de forma explícita antes de migrar."
    - q: "¿Se puede usar un datacenter de proximidad solo para las copias de seguridad?"
      a: "Sí, y es un primer paso habitual. Los servidores siguen en la oficina y una copia se guarda en el datacenter, aislada de la red interna y con restauraciones de prueba periódicas. Más adelante se puede decidir si algún servidor también se traslada."
---
Cuando toca decidir dónde van los servidores de la empresa, casi siempre aparecen dos respuestas: «nos vamos a la nube» o «seguimos como estamos». Entre las dos hay otra opción que se menciona menos y que encaja con muchas pymes: un datacenter de proximidad.

Aquí se explica qué es, qué gana la empresa con él y en qué situaciones tiene sentido. Si lo que buscas es compararlo criterio a criterio con la nube pública, lo tienes en [datacenter propio o nube pública](/recursos/datacenter-propio-o-nube-publica/).

## Qué es un datacenter de proximidad

Es una instalación preparada para alojar servidores, situada cerca de la empresa y gestionada por un equipo identificable. Tres rasgos lo definen:

- **Ubicación conocida y cercana.** Sabes en qué ciudad y en qué edificio están tus datos, y llegar hasta ellos es cuestión de un desplazamiento corto.
- **Una sala pensada para servidores.** Climatización dedicada, alimentación redundante, accesos registrados y supervisión de la temperatura y de la conectividad.
- **Un trato directo.** Las personas que intervienen saben cómo están configurados tus sistemas, así que no hace falta ponerlas al día en cada incidencia.

Lo que se aloja puede ser de dos tipos. Con **housing**, la empresa lleva sus propios servidores y el proveedor pone el espacio en el rack, la alimentación, la refrigeración y la conexión. Con **servidores virtuales**, la empresa usa procesador, memoria y almacenamiento de la infraestructura del proveedor, sin comprar hardware. Las dos modalidades se pueden combinar.

## Qué gana la empresa

- **Equipos en un entorno adecuado.** Los servidores dejan el cuarto técnico de la oficina, que depende de la climatización de todo el edificio, y pasan a una sala con frío y corriente pensados para ellos.
- **Manos cerca del servidor.** Cambiar un disco, revisar un equipo que no arranca o instalar uno nuevo lo hace un técnico que puede desplazarse hasta la sala y que ya conoce la instalación.
- **Un camino privado hasta los servidores.** Con un [enlace privado](/recursos/enlace-privado-oficina-datacenter/), que presta un operador presente en los dos extremos, la oficina llega al datacenter sin pasar por internet y con tiempos de respuesta más regulares.
- **Copias en otro edificio.** Guardarlas lejos de los equipos originales es una de las bases de la [continuidad de negocio](/recursos/backup-y-continuidad-de-negocio/).
- **Un coste que se conoce de antemano**, con una cuota estable en lugar de una factura que depende del consumo de cada mes.

<!-- PENDIENTE: el WordPress prometía «intervención en horas, no en días». Se ha quitado por la decisión D8 (sin acuerdos de nivel de servicio ni tiempos garantizados). Confirmar con ADQA si quiere algún plazo orientativo («habitualmente…»). -->

## Qué preguntar antes de elegir uno

No todos los datacenters de proximidad ofrecen lo mismo. Estas preguntas ayudan a comparar:

- ¿Qué redundancia tiene la sala en alimentación, refrigeración y conectividad?
- ¿Quién puede entrar y cómo queda registrado cada acceso?
- ¿Dónde se guardan las copias: en la misma sala o en un segundo emplazamiento?
- ¿Cómo llegará la oficina a los servidores: por internet o por un enlace privado?
- ¿Puedes llevarte tus datos y tus máquinas virtuales si un día cambias de proveedor?
- ¿Qué tiempos de intervención recoge el contrato y cómo se registran las actuaciones?

Si alguna respuesta queda en el aire, conviene pedir el detalle por escrito antes de firmar.

## Cuándo tiene sentido (y cuándo no)

| Situación | ¿Encaja un datacenter de proximidad? |
|---|---|
| Carga de trabajo estable y previsible | Sí |
| Servidores en la oficina, sin sala ni refrigeración propias | Sí |
| Necesidad de saber dónde están físicamente los datos | Sí |
| Aplicaciones que se usan todo el día desde la oficina o la planta | Sí, mejor con enlace privado |
| Demanda con picos fuertes o estacionales | Mejor nube pública o modelo mixto |
| Usuarios repartidos por varios países | Mejor nube pública |
| Máquinas de producción que necesitan el servidor a su lado | Mejor en local, con la copia en el datacenter |

Si la conclusión es trasladar los servidores, la clave está en la preparación: inventario, réplica en paralelo y un cambio final corto, a la hora que menos molesta. Se explica paso a paso en [migrar servidores sin parar la producción](/recursos/migrar-servidores-sin-parar-la-produccion/).
