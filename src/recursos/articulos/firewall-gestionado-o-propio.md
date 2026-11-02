---
title: "Firewall gestionado o propio: cómo elegir | ADQA"
description: "Firewall gestionado o propio: qué exige mantenerlo con tu equipo, qué aporta delegarlo en un especialista y cómo decidir según tus recursos técnicos."
h1: "Firewall gestionado o propio: qué modelo encaja con tu empresa"
lead: "Qué trabajo pide un firewall cuando ya está instalado, qué cambia si lo gestiona un especialista y cómo decidir."
keyword: "firewall gestionado o propio"
category: ciberseguridad
etiquetas: ["Firewall", "Gestión de la seguridad"]
date: 2026-07-02
updated: 2026-11-02
servicio: "/ciberseguridad/"
related: ["ciberseguridad-gestionada-o-equipo-interno", "red-plana-o-red-segmentada", "ciberseguridad-sin-departamento-it-propio"]
imagen: "Firewall montado en un rack de comunicaciones mientras un técnico revisa sus reglas en un portátil"
tldr: "Un firewall propio da control total sobre la configuración. A cambio, pide dedicación técnica constante para actualizarlo y revisar sus reglas. Un firewall gestionado traslada ese trabajo a un especialista. Es quien lo actualiza, supervisa su actividad y ajusta las reglas con la empresa. La elección no depende del aparato en sí. Depende de si el equipo interno tiene tiempo asignado y conocimiento actualizado para sostenerlo."
faq:
  manager:
    - q: "¿Es menos seguro un firewall que gestiona alguien de fuera de la empresa?"
      a: "No por sí mismo. Lo que protege es que el firewall esté al día y bien atendido. Alguien tiene que revisar sus reglas y sus alertas con regularidad. En un firewall gestionado, ese trabajo forma parte del servicio. En uno propio, depende de que alguien de tu equipo tenga tiempo para hacerlo."
    - q: "¿Hay que cambiar el firewall si cambiamos de operador de internet?"
      a: "Normalmente no hace falta cambiar el equipo. Lo que sí hay que revisar es su configuración: direcciones, enlaces y accesos remotos. En un servicio gestionado, esa adaptación suele correr a cargo del especialista. También coordina el cambio con el nuevo operador."
    - q: "¿Cuánto se tarda en poner en marcha un firewall gestionado?"
      a: "El plazo depende del tamaño de la red y del número de sedes. También de los accesos remotos que haya que mantener. Lo que más tiempo lleva suele ser el diagnóstico inicial y definir las reglas contigo. Instalar el equipo es la parte más rápida."
  tecnico:
    - q: "¿Quién define las reglas en un firewall gestionado: nosotros o el proveedor?"
      a: "Las dos partes. El proveedor propone la configuración según las buenas prácticas y el diagnóstico de la red. Los accesos propios del negocio se acuerdan con tu equipo técnico o con la dirección."
    - q: "¿Se mantiene la visibilidad sobre los registros si el firewall es gestionado?"
      a: "Debería mantenerse. Un servicio gestionado suele incluir informes periódicos y acceso a la información de los registros. Así sabes qué se ha bloqueado, qué se ha permitido y por qué."
    - q: "¿Cómo se coordina el firewall con la VPN y los accesos remotos?"
      a: "Las reglas del firewall y la política de VPN y accesos remotos se revisan juntas. Los accesos desde fuera llevan autenticación multifactor. Así una regla abierta en un punto no deja sin efecto una restricción definida en otro."
---
Comprar un firewall es la parte sencilla. Lo que de verdad protege tu red viene después. Hay que configurarlo bien y actualizarlo cuando el fabricante publica mejoras. Y hay que revisar sus reglas cada vez que tu empresa cambia. Tener el aparato en el rack no es lo mismo que estar protegido.

Por eso, más que el modelo, importa quién se va a ocupar de él el resto del año. ¿Tu propio equipo técnico o un especialista que lo gestione?

## Qué trabajo pide un firewall después de instalarlo

Un firewall decide qué tráfico entra y sale de tu red, y entre qué zonas puede circular. Sus reglas describen cómo trabaja tu empresa en un momento concreto. Dicen qué servicios publica, quién se conecta desde fuera y qué sedes se comunican entre sí.

Imagina que abres una segunda oficina y la gente de allí necesita entrar en el servidor de aquí. Las reglas de ayer no contemplan ese camino. Cuando la empresa cambia, las reglas también deberían cambiar.

A eso se suman las actualizaciones del propio equipo y de sus servicios de seguridad. Luego están los registros. En ellos ves qué bloquea el firewall, qué deja pasar y qué alertas genera. Es un trabajo pequeño pero constante. Lo importante es que tenga un responsable claro.

## Lo que exige un firewall propio

Llevarlo con tu propio equipo tiene sentido cuando hay capacidad real para sostenerlo:

- **Conocimiento técnico actualizado.** Alguien tiene que entender el equipo, sus reglas y sus registros, no solo el día de la instalación.
- **Actualizaciones al día.** El fabricante publica versiones y firmas nuevas con frecuencia. Cuando llega el aviso, aplicarlas forma parte del trabajo.
- **Revisión periódica de reglas.** Un acceso remoto nuevo, un servicio cloud o una sede más piden un ajuste de las reglas.
- **Tiempo para mirar los registros.** Sin esa revisión, el firewall bloquea, pero nadie sabe qué ni por qué.

El riesgo habitual no es tener un firewall propio. Es tenerlo desatendido: instalado una vez y olvidado mientras la red evoluciona a su alrededor. Las reglas temporales que nadie retira son el ejemplo más típico. Piensa en la regla que se abrió para que el técnico del programa de gestión entrara una tarde. Si nadie la cierra, sigue ahí meses después. Una revisión periódica de reglas la encuentra y la retira.

## Lo que aporta un firewall gestionado

Con un [firewall gestionado](/ciberseguridad/), un especialista se ocupa del mantenimiento del día a día:

- **Actualización planificada** frente a amenazas nuevas. No depende de que alguien de tu equipo se acuerde de hacerla.
- **Supervisión de la actividad y de las alertas**, en el horario que se acuerde en el servicio.
- **Reglas revisadas con cada cambio de la red**: accesos remotos, sedes nuevas o la [segmentación por zonas](/recursos/red-plana-o-red-segmentada/).
- **Informes periódicos** sobre lo que el firewall ha bloqueado y por qué.

<!-- PENDIENTE: confirmar con ADQA si la supervisión del firewall gestionado cubre también horas fuera de la jornada laboral y en qué modalidad. Mientras tanto, el texto habla de «el horario que se acuerde». -->

Gestionado no significa perder el control. Qué accesos necesita tu negocio lo decides tú. El especialista aporta el criterio técnico y el mantenimiento. Si mañana estrenas un programa de fichajes que necesita salir a internet, lo pides. La regla se abre con tu visto bueno.

## Qué revisar en tu firewall, sea cual sea el modelo

Cinco preguntas rápidas para saber en qué punto está el tuyo:

- ¿Cuándo se actualizó el firmware por última vez?
- ¿Quedan reglas temporales o de proveedores antiguos que siguen abiertas?
- ¿Los accesos remotos exigen doble verificación?
- ¿Quién recibe las alertas y qué hace con ellas?
- ¿Hay una copia de la configuración guardada fuera del equipo?

Puedes hacérselas tal cual a quien lleve hoy la informática de tu empresa. Si alguna respuesta es «no lo sé», por ahí conviene empezar.

## Cómo decidirlo

| Criterio | Firewall propio | Firewall gestionado |
|---|---|---|
| Dedicación técnica interna | Alta y constante | Baja: decisiones y validaciones |
| Actualizaciones | Dependen del equipo interno | Las aplica el especialista de forma planificada |
| Revisión de reglas | Según la disponibilidad del equipo | Periódica y con cada cambio de la red |
| Coste | Compra del equipo más horas internas | Cuota periódica por el servicio, más fácil de prever |
| Visibilidad | Depende de que alguien revise los registros | Informes periódicos |
| Control de las decisiones | Total, dentro de la empresa | Compartido: el negocio decide y el especialista ejecuta |

Una guía rápida:

- **Firewall propio** si tu equipo técnico tiene tiempo asignado y conocimiento actualizado para sostenerlo.
- **Firewall gestionado** si prefieres que un especialista lleve la actualización y la supervisión, sin gastar horas internas.
- **Modelo combinado** si tu equipo quiere decidir las reglas, pero delegar el mantenimiento diario.

¿La duda va más allá del firewall? Lee [ciberseguridad gestionada o equipo interno](/recursos/ciberseguridad-gestionada-o-equipo-interno/). Es la misma decisión, aplicada a toda la protección de tu empresa.
