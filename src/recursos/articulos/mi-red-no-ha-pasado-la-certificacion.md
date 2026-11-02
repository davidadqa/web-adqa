---
title: "Mi red no ha pasado la certificación: qué hacer | ADQA"
description: "Qué significa que tu red no pase la certificación, cuáles son las causas más habituales de un punto no apto y cómo se corrigen sin repetir toda la medición."
h1: "Mi red no ha pasado la certificación: qué significa y qué hacer"
lead: "Un punto no apto casi nunca obliga a rehacer la red. Suele ser algo concreto, localizado y con solución."
keyword: "red no pasa la certificación"
category: redes
etiquetas: ["Certificación", "Cableado"]
date: 2026-07-05
updated: 2026-11-02
servicio: "/redes/certificacion-redes/"
related: ["asi-se-certifica-una-red", "categorias-de-cableado", "certificacion-de-redes"]
imagen: "Técnico rehaciendo el conector de una toma de red en un panel de parcheo, con el informe de certificación al lado"
tldr: "Un punto «no apto» en una certificación indica que ese enlace concreto no cumple los márgenes de su categoría, no que toda la red esté mal. Las causas más frecuentes son conectores mal terminados, tramos más largos de lo que admite la norma, cables doblados en exceso o algún componente de categoría inferior. Normalmente basta con corregir ese punto y volver a medirlo, sin repetir toda la certificación."
faq:
  manager:
    - q: "¿Un punto no apto significa que la red está mal instalada?"
      a: "No necesariamente. Un fallo en un solo enlace ocurre también en instalaciones bien hechas en conjunto. Lo que más informa es el patrón: un fallo aislado apunta a un error en ese punto, y muchos fallos parecidos, al material o a la forma de instalar."
    - q: "¿Quién asume el coste de corregir los puntos no aptos?"
      a: "Depende de la situación. Si la instalación es reciente y está en garantía, lo habitual es que la corrija quien la instaló. Si es una red antigua, la corrección forma parte de su mantenimiento. Conviene aclararlo antes de empezar la certificación."
    - q: "¿Cuánto se tarda en corregir un punto no apto?"
      a: "Habitualmente poco, porque se actúa sobre un enlace concreto. Rehacer un conector es una intervención breve; sustituir un tramo de cable lleva más tiempo, según lo accesible que sea el recorrido."
  tecnico:
    - q: "¿Se puede saber la causa solo con el informe de certificación?"
      a: "Casi siempre, sí. El informe señala el parámetro que no cumple, y muchos equipos certificadores indican además a qué distancia del extremo está el problema. Con esos dos datos, la causa queda muy acotada."
    - q: "¿Hay que volver a certificar toda la red después de corregir un punto?"
      a: "No. Basta con volver a medir el punto corregido y actualizar el informe. El resto de la certificación sigue siendo válida si esa parte de la instalación no se ha tocado."
    - q: "¿Qué se hace si el punto no apto está empotrado y es difícil de sustituir?"
      a: "Se valora si se puede corregir la parte accesible, como la toma o la conexión en el panel, o si hace falta un recorrido alternativo. En instalaciones complejas se decide caso por caso, según el acceso físico disponible."
---
Recibir un informe con puntos marcados como «no apto» genera dudas comprensibles. Conviene aclarar algo desde el principio: que un punto no pase la certificación no significa que la red esté rota ni que haya que rehacer la instalación. Casi siempre es algo mucho más concreto, y tiene solución.

Si es tu primera certificación, [así se certifica una red](/recursos/asi-se-certifica-una-red/) explica cómo se llega a ese informe.

## Qué significa un punto no apto

Cada punto se compara con los valores que admite la norma para su categoría. «No apto» quiere decir que al menos un parámetro queda fuera: la pérdida de inserción, la diafonía entre pares, la pérdida de retorno o la longitud. Puede que hoy ese punto dé conexión sin problemas, pero no hay garantía de que rinda según su categoría cuando se le exija más.

El informe dice qué parámetro ha fallado y, en muchos casos, en qué zona del enlace está el problema. Con eso, la causa suele quedar acotada antes de abrir ninguna caja.

## Causas más habituales

- **Conector mal terminado.** Es la causa más frecuente. Un conector o una toma mal montados degradan el enlace aunque el cable sea correcto.
- **Longitud por encima del límite.** Cada enlace tiene una distancia máxima; superarla, aunque sea por poco, puede dejar el punto fuera de norma.
- **Radio de curvatura excesivo.** Un cable doblado o pinzado durante el tendido puede alterar los pares sin que se vea desde fuera.
- **Interferencias.** Un recorrido demasiado cerca de líneas eléctricas o de otras fuentes de ruido puede afectar al enlace.
- **Un componente de categoría inferior.** Si un conector, una toma o un panel es de una categoría más baja que la del proyecto, el enlace no puede rendir por encima de esa pieza. Las diferencias entre categorías se explican en [categorías de cableado](/recursos/categorias-de-cableado/).

## Qué hacer, paso a paso

1. **Leer el parámetro que falla.** Orienta directamente hacia la causa probable.
2. **Corregir ese punto.** Rehacer el conector, sustituir o acortar el tramo, o rectificar el recorrido.
3. **Volver a medir solo ese punto.** No hace falta repetir la certificación entera.
4. **Actualizar el informe.** La documentación final debe reflejar la corrección, para que la evidencia quede completa.

La corrección la puede hacer el instalador original o el equipo que ha certificado. Lo importante es que después el punto se vuelva a medir con el equipo certificador, como en cualquier [certificación de redes](/redes/certificacion-redes/).

Lo más habitual es que los puntos no aptos sean excepciones dentro de una instalación correcta, y que se resuelvan rehaciendo un conector o corrigiendo un tramo. Cuando los fallos se repiten en muchos puntos y en varios parámetros, en cambio, conviene revisar el material y el método de instalación antes de corregirlos uno a uno.

## Cómo actuar según la causa

| Causa detectada | Solución habitual | Qué se vuelve a medir |
|---|---|---|
| Conector mal terminado | Rehacer el conector o la toma | Ese punto |
| Longitud excesiva | Replantear el recorrido o dividir el tramo | Ese punto |
| Radio de curvatura excesivo | Corregir o sustituir el tramo afectado | Ese punto |
| Interferencias | Separar el cableado de la fuente de ruido | Los puntos del mismo recorrido |
| Componente de categoría inferior | Sustituirlo por uno de la categoría correcta | Todos los enlaces con ese componente |

Una guía rápida:

- **Trata un punto no apto como una tarea concreta**: se localiza, se corrige y se vuelve a medir.
- **Corrige antes de cerrar el proyecto**, sobre todo si el contrato o una auditoría piden la certificación.
- **No des por buena una corrección sin volver a medir**: sin la nueva medición, el informe no refleja que el punto cumple.
