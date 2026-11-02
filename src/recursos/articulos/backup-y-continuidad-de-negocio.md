---
title: "Backup y continuidad de negocio: qué preguntar | ADQA"
description: "Backup y continuidad de negocio: qué preguntar sobre la frecuencia, la ubicación y la restauración de tus copias, y cómo fijar el RPO y el RTO de cada sistema."
h1: "Backup y continuidad de negocio: qué preguntar para saber si tus copias te cubren"
lead: "Tener copias es el punto de partida. Lo que importa es cuánto se tarda en volver a trabajar con ellas."
keyword: "backup y continuidad de negocio"
category: cloud
etiquetas: ["Backup"]
date: 2026-07-03
updated: 2026-11-02
servicio: "/sistemas-cloud/"
related: ["datacenter-de-proximidad", "soporte-it-reactivo-o-proactivo", "politica-de-seguridad-y-cumplimiento-normativo"]
imagen: "Técnico comprobando una restauración de prueba en un portátil junto a un servidor de copias de seguridad"
tldr: "El backup es la copia de los datos; la continuidad de negocio es el plan para seguir trabajando cuando algo falla. Para saber si una empresa está cubierta hay que revisar cada cuánto se copia, dónde se guarda, cuánto se tarda en restaurar y si las restauraciones se prueban. Cuántos datos se pueden perder (RPO) y cuánto puede estar parado cada sistema (RTO) marcan el diseño de las copias."
faq:
  manager:
    - q: "¿Quién debería encargarse de las copias de seguridad en la empresa?"
      a: "Alguien con la responsabilidad asignada por escrito, sea del equipo interno o de un proveedor. Lo importante es que revise que las copias se completan, programe las restauraciones de prueba y mantenga actualizado el procedimiento de recuperación. Cuando nadie lo tiene asignado, esas tareas tienden a quedarse sin hacer."
    - q: "¿Cómo sé si el backup que tenemos hoy es suficiente?"
      a: "Con cuatro preguntas: cada cuánto se hace la copia, dónde se guarda, cuánto se tarda en restaurar y cuándo se probó una restauración por última vez. Si alguna respuesta no está clara, ese es el primer punto que conviene revisar con quien gestiona los sistemas."
    - q: "¿Hace falta duplicar toda la infraestructura para tener continuidad?"
      a: "No siempre. Depende de qué sistemas son realmente críticos. No todo necesita el mismo nivel de protección: un servidor de producción puede justificar una réplica lista para arrancar, mientras que un archivo histórico se cubre bien con una copia diaria fuera de la oficina."
  tecnico:
    - q: "¿Cada cuánto se debería probar una restauración?"
      a: "Con una periodicidad definida, no solo cuando hay una incidencia. Como referencia, una restauración completa debería comprobarse al menos una vez al año y siempre después de un cambio importante en la infraestructura, además de pruebas parciales más frecuentes de archivos o máquinas concretas."
    - q: "¿Qué RPO y RTO son razonables para una pyme?"
      a: "Varían según el sistema. Un RPO de 24 horas puede ser aceptable para datos poco críticos y quedarse corto para un ERP en producción. Lo correcto es fijarlos sistema por sistema, a partir de cuánto tiempo y cuántos datos se puede permitir perder cada área, y no de forma genérica para toda la empresa."
    - q: "¿Dónde debería guardarse la copia respecto al entorno de producción?"
      a: "En una ubicación física distinta, aislada de la red de producción y con credenciales propias. Así, un mismo incidente, ya sea un fallo eléctrico, una avería o un cifrado de datos, no afecta a la vez a los sistemas originales y a sus copias."
---
Casi todas las empresas tienen algún tipo de copia de seguridad. Menos habitual es haber comprobado cuánto se tardaría en volver a trabajar con ella si hiciera falta. Esa es la diferencia entre tener un backup y tener continuidad de negocio.

La buena noticia es que se puede revisar con unas pocas preguntas, tanto si las copias las gestiona el equipo interno como si las lleva un proveedor.

## Backup y continuidad no son lo mismo

El backup es la copia de los datos. La continuidad de negocio es el plan para seguir operando cuando algo falla: incluye las copias, pero también cuánto se tarda en recuperar cada sistema, en qué orden, quién se encarga de cada paso y cómo se comprueba que todo funciona.

Por eso, más que «¿tenemos backup?», conviene preguntarse «¿cuánto tardaríamos en volver a estar operativos, y con qué datos?».

## Las cuatro preguntas que importan

**¿Con qué frecuencia se hace la copia?** Una copia diaria no es lo mismo que una semanal. Si la operativa genera datos importantes cada hora, la frecuencia de la copia debería reflejarlo.

**¿Dónde se guarda?** Si la copia está en el mismo lugar que los datos originales, un mismo incidente puede afectar a los dos. La referencia habitual es la regla 3-2-1: tres versiones de los datos, el original incluido, en dos tipos de soporte distintos y con una de ellas fuera del edificio, por ejemplo en un [datacenter de proximidad](/recursos/datacenter-de-proximidad/).

**¿Cuánto se tarda en restaurar?** Tener la copia sirve de poco si recuperarla lleva días. Importa tanto el tiempo de restauración como la frecuencia de copia.

**¿Alguien comprueba que la copia funciona?** Que el registro diga «completada» no garantiza que los datos vuelvan. Una copia está verificada cuando se ha restaurado con éxito.

## RPO y RTO: dos cifras para cada sistema

Dos conceptos resumen lo que una empresa necesita de sus copias:

- **RPO (punto de recuperación):** la cantidad de trabajo que se puede perder, medida en tiempo desde la última copia válida. Con una copia al día, en el peor caso se pierde un día de trabajo.
- **RTO (tiempo de recuperación):** cuánto tiempo puede estar parado un sistema antes de volver a funcionar.

No tienen por qué ser iguales para todos los sistemas. El ERP de producción puede necesitar copias cada pocas horas y una recuperación rápida; el archivo de documentación antigua, mucho menos. Fijarlos sistema por sistema evita proteger de más lo secundario y de menos lo crítico.

## Del backup básico a la continuidad real

| Aspecto | Backup básico | Continuidad de negocio |
|---|---|---|
| Ubicación de la copia | A veces en el mismo sitio que el original | Fuera del edificio y aislada de la red de producción |
| Restauración | No siempre probada | Probada de forma periódica |
| Prioridades de recuperación | Sin definir | Definidas según lo crítico de cada sistema |
| Tiempo de recuperación | Desconocido | Conocido y acordado de antemano |
| Responsables | Repartidos o sin definir | Asignados para cada paso de la recuperación |

Una copia aislada de la red también es la base para recuperarse de un incidente de [ciberseguridad](/ciberseguridad/), como un cifrado de datos: los sistemas afectados se reconstruyen a partir de una copia que el incidente no ha alcanzado.

## Cómo ponerlo en marcha

Una lista de comprobación para pasar de tener copias a tener un plan:

- **Inventario de sistemas**, con lo crítico que es cada uno para el negocio.
- **RPO y RTO definidos** para cada sistema, acordados con quien usa cada aplicación.
- **Al menos una copia en otro edificio**, fuera del alcance de la red de trabajo y con credenciales propias.
- **Restauraciones de prueba periódicas**, documentadas y repetidas tras cada cambio relevante en servidores o almacenamiento.
- **Un procedimiento escrito**: qué se recupera primero, quién lo hace y cómo se avisa a los usuarios.
- **Revisión de que cada copia termina sin errores**, como parte del [soporte proactivo](/recursos/soporte-it-reactivo-o-proactivo/) de los sistemas.

La continuidad de negocio no es una casilla que se marca una vez. Se revisa a medida que la empresa crece y sus sistemas cambian, y conviene repasarla también antes de [una migración de servidores](/recursos/migrar-servidores-sin-parar-la-produccion/). Y funciona mejor cuando las copias se diseñan a la vez que el resto de la arquitectura de [sistemas y cloud](/sistemas-cloud/), y no al final.
