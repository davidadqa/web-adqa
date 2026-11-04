---
title: "Así se certifica una red: el proceso paso a paso | ADQA"
description: "Cómo se certifica una red paso a paso: inventario de puntos, medición con equipo certificador, comparación con la norma, informe y corrección de lo que falle."
h1: "Así se certifica una red: el proceso paso a paso"
lead: "Del inventario de puntos al informe final: qué se hace en cada fase y cómo te afecta."
keyword: "cómo se certifica una red"
category: redes
tipo: hacer
etiquetas: ["Certificación", "Cableado"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/redes/certificacion-redes/"
related: ["mi-red-no-ha-pasado-la-certificacion", "certificacion-de-redes", "categorias-de-cableado"]
imagen: "Equipo certificador de cableado conectado a un panel de parcheo, con la pantalla mostrando el resultado de un enlace"
tldr: "Certificar una red sigue cinco pasos. Se inventarían los puntos y se mide cada enlace con un equipo certificador. Cada medida se compara con los límites de la norma y queda en un informe punto por punto. Después se corrige lo que no cumple. Cada enlace se desconecta unos minutos al medirlo, así que se trabaja por zonas o fuera de horario. En una oficina mediana, la medición suele resolverse en pocos días."
faq:
  manager:
    - q: "¿Cuánto dura el proceso completo?"
      a: "La fase más larga es la medición. Depende sobre todo del número de puntos y de si hay enlaces de fibra. Si tu oficina es de tamaño medio, suele resolverse en pocos días. El informe llega después. Si hay puntos no aptos, su corrección se programa aparte."
    - q: "¿Hace falta que alguien de la empresa esté presente?"
      a: "No es imprescindible, pero ayuda que tengas una persona de contacto. Es quien da acceso a armarios y zonas restringidas y confirma el inventario de puntos. También avisa de los puestos que no se pueden desconectar en determinados momentos."
    - q: "¿Qué se recibe al final del proceso?"
      a: "Un informe que recoge, punto por punto, los valores medidos y el veredicto: apto o no apto. Suele ir acompañado de un resumen con las conclusiones y las correcciones prioritarias. Es la documentación que conservas para clientes, auditorías y futuras ampliaciones."
  tecnico:
    - q: "¿En qué se diferencia un equipo certificador de un tester básico?"
      a: "Un tester básico confirma la continuidad y el orden de los pares. Un certificador calibrado va más allá. Mide la pérdida de inserción, la diafonía, la pérdida de retorno, la longitud y el retardo. Lo hace en todas las frecuencias que fija la categoría. Y emite un veredicto frente a los límites de la norma."
    - q: "¿Se certifican también los latiguillos y los paneles de parcheo?"
      a: "Los paneles, sí. Forman parte del enlace permanente, conectores incluidos. Ese enlace une el panel de parcheo con la toma del puesto. Los latiguillos solo entran si se certifica el canal completo. Te conviene dejar acordado el alcance antes de empezar."
    - q: "¿Qué pasa si un punto no cumple por muy poco?"
      a: "Se documenta como no apto igualmente. El veredicto depende de si el valor queda dentro del límite, no de cuánto se aleja de él. Lo que sí te da el margen es información para decidir qué puntos corregir primero."
---
«Certificar la red» suena a trámite abstracto hasta que ves en qué consiste. Es una medición punto por punto, con un instrumento específico. Compara cada enlace con los límites de una norma. Saber cómo funciona te ayuda a preparar la instalación, planificar el calendario y leer el informe.

¿Todavía no tienes claro qué es una certificación ni cuándo te la pueden pedir? Empieza por [certificación de redes: qué es y cuándo se pide](/recursos/certificacion-de-redes/).

## Paso 1: inventario y planificación

Antes de medir nada se hace la lista de puntos. De cada uno se apunta:

- qué toma va a qué panel;
- en qué armario está ese panel;
- con qué categoría de cable;
- con qué longitud aproximada.

También se acuerda contigo el alcance. Puede ser solo el enlace permanente, entre el panel y la toma, o el canal completo, latiguillos incluidos.

Con el inventario se planifica el calendario. Mientras se mide, cada enlace queda desconectado unos minutos. Por eso se trabaja por zonas o fuera de horario. Y se decide de antemano cuándo se miden los puestos y equipos críticos. Si tu equipo de administración cierra la facturación a final de mes, sus puestos se miden otro día. La misma lista sirve después para ordenar el informe.

## Paso 2: medición de cada punto

Cada punto se mide con un equipo certificador, no con un simple comprobador de continuidad. El instrumento se configura con la norma y la categoría que fija el proyecto. Ese día verás una unidad del certificador en el panel del armario y otra en la toma. Entre las dos miden:

- la pérdida de inserción, es decir, cuánta señal se pierde por el camino;
- la diafonía entre pares, que es cuánto se interfieren unos con otros;
- la pérdida de retorno, que indica cuánta señal rebota hacia el origen;
- la longitud real de cada enlace.

En fibra óptica, lo que decide el resultado es la pérdida total de cada enlace. Se mide con una fuente de luz y un medidor de potencia calibrados. Esta fase es la que separa una certificación de comprobar que «el cable da conexión». Tienes todos los parámetros de cobre y fibra en la página de [certificación de redes](/redes/certificacion-redes/).

## Paso 3: comparación con la norma

El propio equipo contrasta cada medición con lo que exige la [categoría del cableado](/recursos/categorias-de-cableado/) del proyecto, por ejemplo Cat 6A. El resultado de cada punto es apto o no apto, según cumpla o no esos márgenes. El valor está dentro del límite o no lo está. No depende de la valoración de quien mide. El veredicto aparece en la pantalla en cuanto termina la prueba de cada toma.

## Paso 4: informe punto por punto

El informe recoge el resultado de cada punto con sus valores medidos. Es la evidencia que entregas a un cliente, a la dirección de obra o a un auditor. También te sirve de base para la próxima ampliación.

Lo que más suele sorprender del primer informe es lo concreto que es. No dice «la red está bien». Buscas la toma de tu mesa y ahí está, con sus valores y su límite. Es la diferencia entre «creemos que la red va bien» y «está medido que cumple».

## Paso 5: corrección de lo que no cumple

Si algún punto no pasa, se busca la causa. Puede ser un conector mal terminado, un radio de curvatura excesivo o un tramo más largo de lo que admite la norma. El técnico rehace lo que falla y vuelve a conectar el certificador en esa toma. Solo se mide de nuevo ese punto, sin repetir toda la certificación. Tienes las causas más habituales y cómo se resuelven en [mi red no ha pasado la certificación](/recursos/mi-red-no-ha-pasado-la-certificacion/).

## Qué esperar en cada fase

| Fase | Qué implica | Efecto en la actividad |
|---|---|---|
| Inventario y planificación | Lista de puntos, alcance y calendario | Ninguno |
| Medición | Enlace por enlace, con el equipo certificador | Cada enlace, unos minutos sin servicio |
| Comparación con la norma | Automática, en el propio instrumento | Ninguno |
| Informe | Resultado y valores de cada punto | Ninguno |
| Corrección | Solo en los puntos no aptos | Localizado en esos puntos |

Para decidir rápido:

- **Acuerda el alcance antes de empezar**: enlace permanente o canal completo, y qué puntos entran.
- **Reserva las zonas críticas para fuera de horario**: servidores, recepción o producción.
- **Pide el informe punto por punto**, no un resumen genérico.
- **Vuelve a medir lo corregido**. Sin una nueva medición, no queda constancia de que el punto cumple.
