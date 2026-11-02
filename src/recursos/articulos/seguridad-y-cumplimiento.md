---
title: "RGPD y ENS en Google Workspace y Microsoft 365 | ADQA"
description: "RGPD y ENS en Google Workspace y Microsoft 365: qué cubre el proveedor, qué le toca a tu empresa y qué herramientas de retención y registro ofrece cada suite."
h1: "Seguridad y cumplimiento: RGPD y ENS en Google Workspace y Microsoft 365"
lead: "El proveedor certifica su infraestructura. Demostrar cómo se tratan los datos sigue siendo tarea de cada empresa."
keyword: "RGPD y ENS en Google Workspace y Microsoft 365"
category: workspace
etiquetas: ["Cumplimiento", "Google Workspace", "Microsoft 365"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/google-workspace/google-workspace-vs-microsoft-365/"
related: ["politica-de-seguridad-y-cumplimiento-normativo", "seguridad-en-microsoft-365", "seguridad-en-google-workspace-que-protege-y-que-configurar"]
imagen: "Responsable de cumplimiento revisando en un portátil las políticas de retención y el registro de actividad de la suite de su empresa"
tldr: "Google Workspace y Microsoft 365 pueden usarse cumpliendo el RGPD y el Esquema Nacional de Seguridad, pero cada proveedor responde solo de su infraestructura. La empresa sigue siendo responsable de sus datos: aceptar las condiciones de tratamiento, saber dónde se almacenan, fijar cuánto tiempo se conservan, controlar quién accede y poder demostrarlo con registros. Las dos suites ofrecen herramientas para ello, con más alcance en los planes superiores."
faq:
  manager:
    - q: "¿Google Workspace y Microsoft 365 cumplen el RGPD?"
      a: "Las dos ofrecen condiciones de tratamiento de datos, información sobre dónde se almacenan y herramientas para conservarlos y localizarlos. Con eso, una empresa puede cumplir el RGPD usando cualquiera de ellas. Pero el cumplimiento también depende de cómo la empresa configura la suite y de sus propios procedimientos."
    - q: "Si el proveedor tiene la certificación ENS, ¿nuestra empresa ya cumple el ENS?"
      a: "No por sí solo. La certificación del proveedor cubre su infraestructura y los servicios incluidos en su alcance. Si tu empresa presta servicios a la administración en un sistema sujeto al ENS, la configuración de la suite y tus procedimientos forman parte de ese sistema y también se evalúan."
    - q: "¿Qué suite pone más fácil cumplir requisitos normativos exigentes?"
      a: "Las dos tienen herramientas para conservar, buscar y proteger la información. Microsoft 365 las agrupa en Microsoft Purview, con más funciones de clasificación de documentos en los planes superiores. Google Workspace ofrece Vault y la prevención de fugas en determinadas ediciones. Lo que suele decidir es el plan contratado y su configuración, más que la suite."
  tecnico:
    - q: "¿Cómo se sabe en qué región se almacenan los datos de la suite?"
      a: "Las dos suites lo indican en su documentación y en la consola de administración. En Microsoft 365, la ubicación está ligada al país del tenant; en Google Workspace, algunas ediciones permiten fijar una región de datos. Conviene comprobarlo y dejarlo documentado en el registro de actividades de tratamiento."
    - q: "¿Cómo se atiende una solicitud de acceso o de supresión de datos de una persona?"
      a: "Con las herramientas de búsqueda de cada suite, Google Vault o la búsqueda de contenido de Microsoft Purview, se localiza lo que hay sobre esa persona en el correo y en los archivos. Después se exporta o se elimina según la solicitud, y se deja constancia de lo que se ha hecho."
    - q: "¿Qué registros de actividad conviene conservar para el ENS?"
      a: "Los más útiles para demostrar la trazabilidad son los inicios de sesión, los cambios de configuración y de permisos de administración, y los accesos y el uso compartido de los documentos. Cuánto tiempo los guarda cada suite depende del plan: conviene comprobar si cubre lo que fija la política de seguridad y, si no, exportarlos a otro sistema."
---
Cuando entran en juego el RGPD o el Esquema Nacional de Seguridad, la pregunta sobre la suite cambia. Ya no basta con saber si es segura: hay que poder demostrar cómo se protegen y se gestionan los datos. Google Workspace y Microsoft 365 permiten hacerlo, cada una con sus herramientas, pero ninguna lo hace por sí sola.

La configuración de seguridad de cada suite se explica en [Seguridad en Microsoft 365](/recursos/seguridad-en-microsoft-365/) y en [Seguridad en Google Workspace](/recursos/seguridad-en-google-workspace-que-protege-y-que-configurar/). Este artículo trata de lo que añade la normativa.

## Qué cubre el proveedor y qué cubre tu empresa

El cumplimiento en una suite cloud es una responsabilidad compartida, con un reparto bastante claro.

- **El proveedor** responde de la seguridad de sus centros de datos, del cifrado de la plataforma, de la disponibilidad del servicio y de las certificaciones de su infraestructura.
- **La empresa** responde de qué datos guarda, quién accede a ellos, cuánto tiempo se conservan, cómo se atienden los derechos de las personas y cómo se actúa ante un incidente.

Las certificaciones del proveedor son un buen punto de partida: acreditan que su infraestructura cumple determinados estándares. No certifican el uso que cada empresa hace de la suite.

## RGPD: lo que la empresa debe tener resuelto

- **Condiciones de tratamiento de datos.** Google y Microsoft actúan como encargados del tratamiento de los datos que la empresa guarda en la suite. Los dos publican sus condiciones. Conviene revisarlas, aceptarlas si la consola de administración lo solicita y conservarlas junto al registro de actividades de tratamiento.
- **Ubicación de los datos.** Saber en qué región se almacenan y si hay transferencias fuera del Espacio Económico Europeo. Las dos suites lo informan y, según el plan o la edición, ofrecen opciones para fijar la región.
- **Conservación y supresión.** El RGPD pide no guardar los datos más tiempo del necesario. Las políticas de retención permiten conservar lo que hay que conservar y eliminar el resto de forma ordenada.
- **Derechos de las personas.** Responder a una solicitud de acceso o de supresión exige localizar todo lo que hay sobre alguien en buzones y archivos.
- **Brechas de seguridad.** Si afectan a datos personales, el RGPD pide notificarlas a la autoridad de control sin dilación y, si es posible, en 72 horas como máximo desde que se conocen. No hace falta notificarlas cuando es improbable que supongan un riesgo para las personas. Los registros de actividad de la suite ayudan a reconstruir qué ha pasado.

Todo esto se apoya en la política de seguridad de la empresa. Por dónde empezarla se explica en [Política de seguridad y cumplimiento normativo](/recursos/politica-de-seguridad-y-cumplimiento-normativo/).

## ENS: cuando la suite entra en el alcance

El Esquema Nacional de Seguridad, regulado por el Real Decreto 311/2022, obliga al sector público. También alcanza a los sistemas de las empresas privadas que le dan servicio o le aportan soluciones tecnológicas. Clasifica los sistemas en tres categorías, BÁSICA, MEDIA y ALTA, según el impacto que tendría un incidente sobre la información y los servicios.

Si el correo y los documentos que se usan para ese servicio están en Google Workspace o en Microsoft 365, la suite forma parte del sistema. Los proveedores suelen informar de qué servicios tienen certificados conforme al ENS y en qué categoría. Conviene comprobar que esa certificación cubre los servicios que se van a usar.

<!-- PENDIENTE: confirmar con la documentación vigente de Google y de Microsoft qué servicios de cada suite están certificados conforme al ENS y en qué categoría antes de citarlo de forma concreta. -->

La certificación del proveedor cubre su parte. La de la empresa se evalúa sobre su configuración y sus procedimientos. Varias medidas del ENS se traducen en ajustes concretos de la suite:

- **Control de acceso:** autenticación reforzada con verificación en dos pasos y permisos ajustados a cada puesto.
- **Trazabilidad:** registros de actividad conservados el tiempo que fija la política de la empresa.
- **Protección de la información:** cifrado, etiquetado de documentos y límites al uso compartido externo.
- **Continuidad:** copias de seguridad propias, independientes de la papelera de la suite.

Qué implica la categoría ALTA y cuándo la necesita una empresa privada se explica en [Certificación ENS categoría ALTA](/recursos/certificacion-ens-categoria-alta/).

## Qué herramientas ofrece cada suite

| Necesidad | Google Workspace | Microsoft 365 |
|---|---|---|
| Conservar correo y archivos el tiempo fijado | Google Vault, en las ediciones que lo incluyen | Directivas de retención de Microsoft Purview, según el plan |
| Localizar los datos de una persona | Búsquedas y exportaciones de Vault | Búsqueda de contenido y eDiscovery de Purview |
| Registrar la actividad | Registros de auditoría de la consola de administración | Registro de auditoría de Purview |
| Evitar fugas de información | Reglas de prevención de pérdida de datos, en ediciones superiores | Prevención de pérdida de datos y etiquetas de confidencialidad, según el plan |
| Ubicación de los datos | Regiones de datos, en determinadas ediciones | Ligada al país del tenant, con opciones adicionales que se contratan aparte |
| Control de acceso | Verificación en dos pasos y, en determinadas ediciones, acceso contextual | Verificación en dos pasos y, según el plan, acceso condicional de Microsoft Entra ID |

Las funciones de cada plan o edición las fija cada proveedor y cambian con el tiempo. Conviene confirmarlas en su documentación antes de contratar o renovar.

## Cómo decidirlo

| Situación de la empresa | Qué pesa más | Qué revisar en cada suite |
|---|---|---|
| Trata datos personales de clientes y empleados | Condiciones de tratamiento, ubicación y conservación | Lo mismo en las dos: cualquiera sirve si se configura bien |
| Presta servicios a la administración en sistemas del ENS | Autenticación reforzada, trazabilidad y evidencias | Alcance de la certificación ENS del proveedor y registros que incluye el plan |
| Debe conservar correo y documentos durante años | Retención y búsqueda | Google Vault en las ediciones superiores; Microsoft Purview según el plan |
| Necesita clasificar y proteger documentos confidenciales | Etiquetado y prevención de fugas | Etiquetas de confidencialidad de Purview, según el plan; prevención de fugas de Google Workspace, en ediciones superiores |
| Ya trabaja con una suite y quiere cumplir mejor | Plan y configuración actuales | Revisar ambos antes de plantear un cambio de suite |

Una guía rápida:

- **La suite rara vez decide el cumplimiento por sí sola.** Lo deciden el plan contratado, la configuración y los procedimientos de la empresa.
- **Si los requisitos son exigentes**, como retenciones largas, auditorías frecuentes o documentos confidenciales que hay que etiquetar, compara los planes superiores de las dos suites.
- **Si ya trabajas con una**, revisa primero si su plan cubre lo que pide la normativa. Un cambio de suite se justifica por un [motivo de fondo](/recursos/cuando-tiene-sentido-cambiar-de-microsoft-365-a-google-workspace-o-al-reves/), no como atajo para cumplir.
