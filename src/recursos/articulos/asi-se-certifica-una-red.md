---
title: "Así se certifica una red: el proceso paso a paso | ADQA"
description: "Cómo se certifica una red paso a paso: inventario de puntos, medición con equipo certificador, comparación con la norma, informe y corrección de lo que falle."
h1: "Así se certifica una red: el proceso paso a paso"
lead: "Del inventario de puntos al informe final: qué se hace en cada fase y cómo afecta al día a día."
keyword: "cómo se certifica una red"
category: redes
etiquetas: ["Certificación", "Cableado"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/redes/certificacion-redes/"
related: ["mi-red-no-ha-pasado-la-certificacion", "certificacion-de-redes", "categorias-de-cableado"]
imagen: "Equipo certificador de cableado conectado a un panel de parcheo, con la pantalla mostrando el resultado de un enlace"
tldr: "Certificar una red sigue cinco pasos: inventario de puntos, medición de cada enlace con un equipo certificador, comparación con los límites de la norma, informe punto por punto y corrección de lo que no cumple. Cada enlace se desconecta unos minutos mientras se mide, así que se trabaja por zonas o fuera de horario. En una oficina mediana, la medición suele resolverse en pocos días."
faq:
  manager:
    - q: "¿Cuánto dura el proceso completo?"
      a: "La fase más larga es la medición, y depende sobre todo del número de puntos y de si hay enlaces de fibra. En una oficina de tamaño medio suele resolverse en pocos días. El informe llega después y, si hay puntos no aptos, su corrección se programa aparte."
    - q: "¿Hace falta que alguien de la empresa esté presente?"
      a: "No es imprescindible, pero ayuda tener una persona de contacto que dé acceso a armarios y zonas restringidas, confirme el inventario de puntos y avise de los puestos que no se pueden desconectar en determinados momentos."
    - q: "¿Qué se recibe al final del proceso?"
      a: "Un informe que recoge, punto por punto, los valores medidos y el veredicto: apto o no apto. Suele acompañarse de un resumen con las conclusiones y las correcciones prioritarias. Es la documentación que se conserva para clientes, auditorías y futuras ampliaciones."
  tecnico:
    - q: "¿En qué se diferencia un equipo certificador de un tester básico?"
      a: "Un tester básico confirma la continuidad y el orden de los pares. Un certificador, calibrado, mide la pérdida de inserción, la diafonía, la pérdida de retorno, la longitud y el retardo en todas las frecuencias que fija la categoría, y emite un veredicto frente a los límites de la norma."
    - q: "¿Se certifican también los latiguillos y los paneles de parcheo?"
      a: "Los paneles, sí: forman parte del enlace permanente, que une el panel de parcheo con la toma del puesto, conectores incluidos. Los latiguillos solo entran si se certifica el canal completo. Conviene dejar acordado el alcance antes de empezar."
    - q: "¿Qué pasa si un punto no cumple por muy poco?"
      a: "Se documenta como no apto igualmente: el veredicto depende de si el valor queda dentro del límite, no de cuánto se aleja de él. Lo que sí aporta el margen es información para decidir qué puntos corregir primero."
---
«Certificar la red» suena a trámite abstracto hasta que se ve en qué consiste. Es una medición punto por punto, con un instrumento específico, que compara cada enlace con los límites de una norma. Saber cómo funciona ayuda a preparar la instalación, a planificar el calendario y a leer el informe cuando llega.

Si todavía no tienes claro qué es una certificación ni cuándo te la pueden pedir, empieza por [certificación de redes: qué es y cuándo se pide](/recursos/certificacion-de-redes/).

## Paso 1: inventario y planificación

Antes de medir nada se elabora la lista de puntos: qué toma va a qué panel, en qué armario, con qué categoría de cable y con qué longitud aproximada. También se acuerda el alcance: solo el enlace permanente, entre el panel y la toma, o el canal completo, latiguillos incluidos.

Con el inventario se planifica el calendario. Mientras se mide, cada enlace queda desconectado unos minutos. Por eso se trabaja por zonas o fuera de horario, y se decide de antemano cuándo se miden los puestos y equipos críticos. La misma lista sirve después para ordenar el informe.

## Paso 2: medición de cada punto

Cada punto se mide con un equipo certificador, no con un simple comprobador de continuidad. El instrumento se configura con la norma y la categoría que fija el proyecto. Después mide la pérdida de inserción, la diafonía entre pares, la pérdida de retorno y la longitud real de cada enlace.

En fibra óptica, la medida que decide el resultado es la pérdida total de cada enlace, que se obtiene con una fuente de luz y un medidor de potencia calibrados. Esta fase es la que separa una certificación de comprobar que «el cable da conexión». La lista completa de parámetros de cobre y de fibra está en la página del servicio de [certificación de redes](/redes/certificacion-redes/).

## Paso 3: comparación con la norma

El propio equipo contrasta cada medición con lo que exige la [categoría del cableado](/recursos/categorias-de-cableado/) del proyecto, por ejemplo Cat 6A. El resultado de cada punto es apto o no apto, según cumpla o no esos márgenes. No depende de la valoración de quien mide.

## Paso 4: informe punto por punto

El informe recoge el resultado de cada punto con sus valores medidos. Es la evidencia que se entrega a un cliente, a la dirección de obra o a un auditor, y la base para la próxima ampliación.

Lo que más suele sorprender a quien recibe su primer informe es lo concreto que es. No dice «la red está bien»: dice qué valores ha dado cada toma y frente a qué límite. Es la diferencia entre «creemos que la red va bien» y «está medido que cumple».

## Paso 5: corrección de lo que no cumple

Si algún punto no pasa, se busca la causa: un conector mal terminado, un radio de curvatura excesivo o un tramo más largo de lo que admite la norma. Se corrige y se vuelve a medir solo ese punto, sin repetir toda la certificación. Las causas más habituales y cómo se resuelven están en [mi red no ha pasado la certificación](/recursos/mi-red-no-ha-pasado-la-certificacion/).

## Qué esperar en cada fase

| Fase | Qué implica | Efecto en la actividad |
|---|---|---|
| Inventario y planificación | Lista de puntos, alcance y calendario | Ninguno |
| Medición | Enlace por enlace, con el equipo certificador | Cada enlace, unos minutos sin servicio |
| Comparación con la norma | Automática, en el propio instrumento | Ninguno |
| Informe | Resultado y valores de cada punto | Ninguno |
| Corrección | Solo en los puntos no aptos | Localizado en esos puntos |

Una guía rápida:

- **Acuerda el alcance antes de empezar**: enlace permanente o canal completo, y qué puntos entran.
- **Reserva las zonas críticas para fuera de horario**: servidores, recepción o producción.
- **Pide el informe punto por punto**, no un resumen genérico.
- **Vuelve a medir lo corregido**: una corrección sin medición posterior no deja constancia de que el punto cumple.
