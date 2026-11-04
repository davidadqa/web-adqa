---
title: "Backup y continuidad de negocio: qué preguntar | ADQA"
description: "Backup y continuidad de negocio: qué preguntar sobre la frecuencia, la ubicación y la restauración de tus copias, y cómo fijar el RPO y el RTO de cada sistema."
h1: "Backup y continuidad de negocio: qué preguntar para saber si tus copias te cubren"
lead: "Tener copias es el punto de partida. Lo que importa es cuánto se tarda en volver a trabajar con ellas."
keyword: "backup y continuidad de negocio"
category: cloud
tipo: hacer
etiquetas: ["Backup"]
date: 2026-07-03
updated: 2026-11-02
servicio: "/sistemas-cloud/"
related: ["datacenter-de-proximidad", "soporte-it-reactivo-o-proactivo", "politica-de-seguridad-y-cumplimiento-normativo"]
imagen: "Técnico comprobando una restauración de prueba en un portátil junto a un servidor de copias de seguridad"
tldr: "El backup es la copia de los datos. La continuidad de negocio es el plan para seguir trabajando cuando algo falla. Para saber si una empresa está cubierta hay que revisar cada cuánto se copia y dónde se guarda. También hay que comprobar cuánto se tarda en restaurar y si las restauraciones se prueban. Cuántos datos se pueden perder (RPO) y cuánto puede estar parado cada sistema (RTO) marcan el diseño de las copias."
faq:
  manager:
    - q: "¿Quién debería encargarse de las copias de seguridad en la empresa?"
      a: "Alguien con la responsabilidad asignada por escrito, sea de tu equipo o de un proveedor. Esa persona revisa que las copias se completan y programa las restauraciones de prueba. También mantiene al día el procedimiento de recuperación. Cuando nadie lo tiene asignado, esas tareas tienden a quedarse sin hacer. Por eso conviene ponerle nombre."
    - q: "¿Cómo sé si el backup que tenemos hoy es suficiente?"
      a: "Con cuatro preguntas. ¿Cada cuánto se hace la copia? ¿Dónde se guarda? ¿Cuánto se tarda en restaurar? ¿Cuándo se probó una restauración por última vez? Si alguna respuesta no está clara, empieza por ese punto. Revísalo con quien gestiona tus sistemas."
    - q: "¿Hace falta duplicar toda la infraestructura para tener continuidad?"
      a: "No siempre. Depende de qué sistemas son realmente críticos para ti. No todo necesita el mismo nivel de protección. Un servidor de producción puede justificar una réplica lista para arrancar. En cambio, un archivo histórico se cubre bien con una copia diaria fuera de la oficina."
  tecnico:
    - q: "¿Cada cuánto se debería probar una restauración?"
      a: "Con una periodicidad definida, no solo cuando hay una incidencia. Como referencia, prueba una restauración completa al menos una vez al año y siempre después de un cambio importante en la infraestructura. Entre medias, haz pruebas parciales más frecuentes de archivos o máquinas concretas."
    - q: "¿Qué RPO y RTO son razonables para una pyme?"
      a: "Varían según el sistema. El RPO es el trabajo que puedes perder, y el RTO, el tiempo parado que aguantas. Un RPO de 24 horas puede bastar para datos poco críticos. Para un ERP en producción, en cambio, puede quedarse corto. Lo correcto es fijarlos sistema por sistema, no de forma genérica para toda la empresa. Pregunta a cada área cuánto tiempo y cuántos datos puede permitirse perder."
    - q: "¿Dónde debería guardarse la copia respecto al entorno de producción?"
      a: "En una ubicación física distinta, aislada de la red de producción y con credenciales propias. Así un mismo incidente no alcanza a la vez a los sistemas originales y a sus copias. Da igual que sea un fallo eléctrico, una avería o un cifrado de datos."
---
Casi todas las empresas tienen algún tipo de copia de seguridad. Lo que no es tan habitual es haber comprobado cuánto tardarías en volver a trabajar con ella. Esa es la diferencia entre tener un backup y tener continuidad de negocio.

La buena noticia es que lo puedes revisar con unas pocas preguntas. Sirven tanto si las copias las gestiona tu equipo interno como si las lleva un proveedor.

## Backup y continuidad no son lo mismo

El backup es la copia de los datos. La continuidad de negocio es el plan para seguir trabajando cuando algo falla. Incluye las copias, pero también otras cosas:

- cuánto se tarda en recuperar cada sistema;
- en qué orden se recuperan;
- quién se encarga de cada paso;
- cómo se comprueba que todo funciona.

Imagina que el servidor de archivos no arranca un martes a media mañana. Con un backup, sabes que los datos están en algún sitio. Con continuidad, además sabes quién los recupera, en qué orden y cuándo vuelve a trabajar tu equipo.

Por eso, más que «¿tenemos backup?», la pregunta útil es otra: «¿cuánto tardaríamos en volver a estar operativos, y con qué datos?».

## Las cuatro preguntas que importan

**¿Con qué frecuencia se hace la copia?** Una copia diaria no es lo mismo que una semanal. Si tu operativa genera datos importantes cada hora, la frecuencia de la copia debería reflejarlo.

**¿Dónde se guarda?** Si la copia está junto a los datos originales, un mismo incidente puede afectar a los dos. El caso típico es el disco externo que vive enchufado al servidor. La referencia habitual es la regla 3-2-1:

- tres versiones de los datos, el original incluido;
- en dos tipos de soporte distintos;
- y una de ellas fuera del edificio, por ejemplo en un [datacenter de proximidad](/recursos/datacenter-de-proximidad/).

**¿Cuánto se tarda en restaurar?** Tener la copia te sirve de poco si recuperarla lleva días. Importa tanto el tiempo de restauración como la frecuencia de copia.

**¿Alguien comprueba que la copia funciona?** Puede que cada mañana te llegue un correo que dice «completada». Eso no asegura que los datos vuelvan. Una copia está verificada cuando se ha restaurado con éxito.

## RPO y RTO: dos cifras para cada sistema

Dos conceptos resumen lo que tu empresa necesita de sus copias:

- **RPO (punto de recuperación):** cuánto trabajo puedes permitirte perder, medido en tiempo desde la última copia válida. Con una copia al día, en el peor caso pierdes un día de trabajo.
- **RTO (tiempo de recuperación):** cuánto tiempo puede estar parado un sistema antes de volver a funcionar.

No tienen por qué ser iguales para todos los sistemas. Piensa en el ERP de producción (el programa de gestión) el último día del mes, en plena facturación. Puede necesitar copias cada pocas horas y una recuperación rápida. El archivo de documentación antigua, mucho menos. Fijarlos sistema por sistema evita proteger de más lo secundario y de menos lo crítico.

## Del backup básico a la continuidad real

| Aspecto | Backup básico | Continuidad de negocio |
|---|---|---|
| Ubicación de la copia | A veces en el mismo sitio que el original | Fuera del edificio y aislada de la red de producción |
| Restauración | No siempre probada | Probada de forma periódica |
| Prioridades de recuperación | Sin definir | Definidas según lo crítico de cada sistema |
| Tiempo de recuperación | Desconocido | Conocido y acordado de antemano |
| Responsables | Repartidos o sin definir | Asignados para cada paso de la recuperación |

Supón que entras en la carpeta de facturas y ningún archivo se abre. Puede ser un cifrado de datos, un incidente de [ciberseguridad](/ciberseguridad/). Ahí una copia aislada de la red es la base para recuperarte. Los sistemas afectados se reconstruyen a partir de una copia que el incidente no ha alcanzado.

## Cómo ponerlo en marcha

Una lista de comprobación para pasar de tener copias a tener un plan:

- **Inventario de sistemas**, con lo crítico que es cada uno para tu negocio.
- **RPO y RTO definidos** para cada sistema, acordados con quien usa cada aplicación.
- **Al menos una copia en otro edificio**, fuera del alcance de la red de trabajo y con credenciales propias.
- **Restauraciones de prueba periódicas**, documentadas y repetidas tras cada cambio relevante en servidores o almacenamiento.
- **Un procedimiento escrito**: qué se recupera primero, quién lo hace y cómo se avisa a los usuarios. Que lo pueda seguir otra persona si quien lo montó está de vacaciones.
- **Revisión de que cada copia termina sin errores**, como parte del [soporte proactivo](/recursos/soporte-it-reactivo-o-proactivo/) de los sistemas.

La continuidad de negocio no es una casilla que se marca una vez. Se revisa a medida que tu empresa crece y sus sistemas cambian. Repásala también antes de [una migración de servidores](/recursos/migrar-servidores-sin-parar-la-produccion/). Y funciona mejor si las copias nacen con la arquitectura de [sistemas y cloud](/sistemas-cloud/), no al final.
