---
title: "Certificación de redes y ENS: qué papel tiene | ADQA"
description: "Certificación de redes y ENS: qué pide el esquema sobre la infraestructura, qué aporta el informe del cableado en una auditoría y qué no puede sustituir."
h1: "Certificación de redes y ENS: qué aporta el informe del cableado en una auditoría"
lead: "El ENS no pide certificar el cableado de forma expresa, pero sí conocer y documentar la infraestructura."
keyword: "certificación de redes y ENS"
category: redes
tipo: entender
etiquetas: ["Certificación", "ENS", "Cumplimiento"]
date: 2026-07-03
updated: 2026-11-02
servicio: "/redes/certificacion-redes/"
related: ["certificacion-de-redes", "certificacion-ens-categoria-alta", "red-plana-o-red-segmentada"]
imagen: "Carpeta con el informe de certificación del cableado abierta junto a un armario de red con los paneles de parcheo etiquetados"
tldr: "El Esquema Nacional de Seguridad no exige de forma expresa certificar el cableado. Sí pide conocer, documentar y proteger los sistemas. Ahí el informe de certificación de la red aporta documentación verificable sobre la infraestructura física. Indica qué puntos hay, dónde están y si cumplen su categoría. Complementa el inventario y el esquema de red, pero no sustituye ninguna medida del ENS."
faq:
  manager:
    - q: "¿El ENS obliga a certificar el cableado de la red?"
      a: "No de forma expresa. El Esquema Nacional de Seguridad (ENS) pide conocer, documentar y proteger los sistemas. Eso incluye la red que los conecta. El informe de certificación del cableado es una forma verificable de documentar la infraestructura física. Por eso te resulta útil al preparar una auditoría. Pero no es un requisito independiente."
    - q: "¿Con cuánta antelación conviene certificar la red antes de una auditoría ENS?"
      a: "Con la suficiente para corregir los puntos que no cumplan y volver a medirlos antes de la auditoría. El margen necesario depende del número de puntos y de lo que haya que corregir. Te conviene planificarlo al principio de la preparación, no en las últimas semanas."
    - q: "¿Esto afecta solo a las empresas que trabajan con la administración pública?"
      a: "El ENS es obligatorio para el sector público y para los sistemas con los que las empresas privadas le prestan servicios. Otras empresas lo adoptan como guía de buenas prácticas. La certificación del cableado, en cambio, tiene sentido en cualquier instalación nueva, con ENS o sin él."
  tecnico:
    - q: "¿Qué documentación de la red suele revisarse en una auditoría ENS?"
      a: "Habitualmente, el inventario de equipos y el esquema de la red con su segmentación. También se revisan la descripción de las conexiones con el exterior y las medidas que separan los sistemas según su nivel de seguridad. El informe de certificación del cableado complementa esa documentación con el estado de la infraestructura física."
    - q: "¿La certificación de red cubre también el WiFi?"
      a: "No. La certificación se aplica al cableado de cobre y de fibra. El WiFi se evalúa con otros criterios, como el cifrado, la separación de redes y el control de accesos. Esos criterios complementan la documentación del cableado, pero no la sustituyen."
    - q: "¿Hay que recertificar toda la red si solo se amplía una parte?"
      a: "No. Basta con certificar los puntos nuevos o modificados y actualizar el informe. Hace falta que la certificación del resto esté documentada y que esa parte no se haya tocado."
---
Al preparar una auditoría del Esquema Nacional de Seguridad (ENS), suele surgir una duda: si hay que certificar el cableado. El ENS no lo exige de forma expresa. Aun así, el informe de certificación aporta documentación que la auditoría puede tener en cuenta.

Verás qué relación hay entre la certificación del cableado y el ENS, y qué cubre cada uno. Qué es una [certificación de redes](/recursos/certificacion-de-redes/) y cuándo se pide lo tienes en un artículo aparte.

## Qué pide el ENS sobre la infraestructura

El ENS está regulado por el Real Decreto 311/2022. Se aplica al sector público y a los sistemas con los que las empresas privadas le prestan servicios. Sus medidas no hablan de certificar el cableado. Pero varias afectan a tu red:

- **Inventario.** Saber qué equipos y elementos forman el sistema y dónde están.
- **Arquitectura documentada.** Describir las instalaciones, las redes internas y las conexiones con el exterior.
- **Separación de la red.** Segmentar los flujos de información según su uso y su nivel de seguridad. La [segmentación de la red](/recursos/red-plana-o-red-segmentada/) es la base técnica de esta medida.
- **Protección de las instalaciones.** Locales y armarios acondicionados y con el acceso controlado.

En la práctica, esas medidas piden conocer la infraestructura, documentarla y protegerla. En la auditoría te llegarán como preguntas concretas: dónde está cada armario de comunicaciones o quién puede abrirlo. Cuánto se exige en cada medida depende de la categoría del sistema: BÁSICA, MEDIA o ALTA. Lo que implica la más exigente lo tienes en [certificación ENS categoría ALTA](/recursos/certificacion-ens-categoria-alta/).

<!-- PENDIENTE: validar con el equipo de ciberseguridad la descripción de las medidas del ENS relacionadas con la red (inventario, arquitectura, separación de flujos, protección de instalaciones). -->

## Qué aporta el informe de certificación

- **Evidencia verificable.** Es un informe punto por punto, con los valores medidos y el resultado de cada enlace. Un auditor puede revisarlo y contrastarlo.
- **Identificación de cada punto.** El informe recoge qué toma va a qué panel y a qué armario. Esa correspondencia complementa tu inventario y tu esquema de red.
- **Una base física para la segmentación.** Con cada cable localizado, explicas mejor cómo se separan las redes y dónde está cada sistema.
- **Disponibilidad.** Un cableado que cumple su categoría reduce las incidencias de origen físico. La disponibilidad es una de las dimensiones de seguridad que valora el esquema.

Si el informe ya existe, la parte de infraestructura física se documenta con poco esfuerzo. Si no existe, hay que reconstruir qué cable va a cada sitio en plena preparación de la auditoría. Eso supone recorrer los armarios y seguir los latiguillos uno a uno. Tienes el contenido de ese informe y cómo se obtiene en la página de [certificación de redes](/redes/certificacion-redes/).

## Lo que la certificación no cubre

Certificar el cableado no certifica el cumplimiento del ENS. El esquema abarca también:

- la política de seguridad;
- el control de accesos;
- la continuidad del servicio;
- la gestión de incidentes;
- la mejora continua.

El informe del cableado es una pieza de la documentación de la infraestructura física. El resto de las medidas se acreditan por su cuenta. Cuando el auditor te pregunte quién accede a cada sistema, la respuesta estará en otra documentación.

En las categorías MEDIA y ALTA, la conformidad con el ENS la certifica una entidad acreditada tras una auditoría. En la BÁSICA basta una autoevaluación. Lo que supone esa certificación lo tienes en la página del [certificado ENS](/ciberseguridad/certificado-ens/).

Tampoco cubre el WiFi, que se evalúa con sus propios criterios de seguridad.

<!-- PENDIENTE: confirmar si ADQA da soporte a la parte de infraestructura en auditorías ENS de clientes. El WordPress lo afirmaba en primera persona; se ha retirado del cuerpo. -->

## Cómo decidirlo

| Situación | Papel de la certificación del cableado |
|---|---|
| Preparas una auditoría ENS | Recomendable: documenta la infraestructura física con datos verificables |
| Ya tienes la certificación ENS y amplías o reformas la red | Certificar los puntos nuevos o modificados y actualizar la documentación |
| Un pliego público pide el informe del cableado | Requisito del contrato: hay que entregarlo |
| Trabajas con la administración sin requisitos sobre el cableado | Buena práctica, sobre todo en instalaciones nuevas |
| Empresa sin requisitos normativos | No es obligatoria; útil como garantía de la obra |

Para decidir rápido:

- **Certifica antes de la auditoría**, con margen para corregir los puntos que no cumplan.
- **Reúne la documentación**: informe de certificación, esquema de red e inventario, juntos y fáciles de localizar.
- **Mantenla al día**: cada ampliación, con sus puntos certificados y registrados.
