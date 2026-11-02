---
title: "Seguridad en Google Workspace: qué configurar | ADQA"
description: "Seguridad en Google Workspace: qué protege desde el primer día y qué conviene ajustar en la consola, de la verificación en dos pasos a los móviles y Drive."
h1: "Seguridad en Google Workspace: qué protege por defecto y qué hay que configurar"
lead: "Lo que ya viene activado, lo que conviene ajustar en la consola y los descuidos más habituales."
keyword: "seguridad en Google Workspace"
category: workspace
etiquetas: ["Google Workspace", "Seguridad"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/google-workspace/"
related: ["google-workspace-para-equipos-remotos-e-hibridos", "seguridad-y-cumplimiento", "seguridad-en-microsoft-365"]
imagen: "Consola de administración de Google Workspace en un portátil, con la verificación en dos pasos activada para toda la organización"
tldr: "La seguridad de Google Workspace tiene dos partes. De serie, Gmail filtra spam, phishing y malware, los datos viajan y se guardan cifrados y Google mantiene la infraestructura. Lo demás depende de cada empresa: exigir la verificación en dos pasos, gestionar los dispositivos, limitar qué se comparte fuera y revisar con regularidad los permisos y las aplicaciones conectadas."
faq:
  manager:
    - q: "¿Google Workspace es seguro para una empresa sin departamento de informática propio?"
      a: "Sí, siempre que alguien configure bien la verificación en dos pasos, los permisos y las políticas de uso compartido. La plataforma da las herramientas, pero activarlas no es automático: conviene que lo haga alguien que conozca la consola de administración."
    - q: "¿Se puede retirar la información de la empresa de un móvil extraviado?"
      a: "Sí. Con la gestión de dispositivos móviles configurada, se puede impedir que ese móvil siga accediendo a los datos de la empresa y borrar a distancia la cuenta corporativa, sin esperar a que la persona lo devuelva."
    - q: "¿Cómo sabemos si nuestra cuenta de Google Workspace está bien configurada?"
      a: "Con una revisión de la configuración. Los primeros puntos que conviene mirar son la verificación en dos pasos, quién tiene permisos de administrador, las políticas de dispositivos y las aplicaciones conectadas a las cuentas."
  tecnico:
    - q: "¿Cómo se obliga a usar la verificación en dos pasos en toda la organización?"
      a: "Desde la consola de administración, activando la verificación obligatoria por unidad organizativa y dando un periodo de gracia para que cada usuario la configure antes de que se exija."
    - q: "¿Se puede limitar con quién se comparten los documentos de Drive?"
      a: "Sí, con políticas de uso compartido a nivel de organización o de unidad organizativa. Lo habitual es restringir por defecto el uso compartido fuera del dominio y permitirlo como excepción, por ejemplo con dominios de confianza."
    - q: "¿Cómo se controla qué aplicaciones externas acceden a Gmail o a Drive?"
      a: "En la consola, el control de acceso de aplicaciones muestra cuáles han recibido permisos mediante OAuth y a qué datos llegan. Desde ahí se revocan las que ya no se usan y se decide cuáles pueden conectarse en adelante."
---
Google Workspace trae protecciones sólidas de serie. Otra parte de la seguridad se decide en la consola de administración: quién entra, desde qué dispositivos y qué se comparte con quién. Las dos se complementan.

Por eso, más que preguntarse si Google Workspace es seguro, conviene comprobar si está bien configurado para tu empresa.

## Lo que Google Workspace protege desde el primer día

- **Filtrado de spam, phishing y malware.** Gmail aparta la mayor parte del correo malicioso antes de que el usuario lo vea, con un filtrado que Google actualiza de forma continua.
- **Cifrado en tránsito y en reposo.** Los correos y los archivos viajan cifrados y se guardan cifrados en los centros de datos de Google. Para este nivel no hay que activar nada.
- **Infraestructura mantenida por Google.** Los centros de datos, las actualizaciones y los parches de la plataforma corren a cargo de Google, no de la empresa.

Esta parte no requiere ninguna acción. La siguiente, sí.

## Lo que se ajusta desde la consola de administración

- **Verificación en dos pasos obligatoria.** Con ella, una contraseña filtrada ya no basta para entrar en una cuenta. Conviene exigirla a toda la organización, no dejarla a elección de cada persona.
- **Gestión de dispositivos móviles.** Permite exigir bloqueo de pantalla y cifrado, y borrar los datos de la empresa de un móvil perdido.
- **Control del uso compartido externo.** Es fácil compartir un documento con «cualquier persona con el enlace» sin pensar en el alcance. Una política de organización puede limitarlo por defecto y dejarlo como excepción.
- **Revisión de permisos y aplicaciones conectadas.** Las aplicaciones de terceros con acceso al correo o a Drive pueden acumular permisos que nadie revisa después de instalarlas.
- **Contraseñas y sesiones.** Exigir contraseñas robustas y cerrar las sesiones inactivas acota la exposición si un equipo se pierde o se comparte.

Estos ajustes pesan todavía más cuando el equipo trabaja fuera de la oficina, como se explica en [Google Workspace para equipos remotos e híbridos](/recursos/google-workspace-para-equipos-remotos-e-hibridos/).

## Errores de configuración habituales

- Dejar la verificación en dos pasos como opcional.
- Tener más cuentas con permisos de administrador de las necesarias.
- Permitir por defecto compartir documentos con cualquiera que tenga el enlace.
- Tardar en dar de baja las cuentas de quien deja la empresa.
- No revisar qué aplicaciones de terceros tienen acceso al correo o a Drive.

Todos se corrigen desde la consola, y apenas cambian la forma de trabajar del equipo.

## De la configuración inicial a la recomendada

| Aspecto | Configuración de serie | Configuración recomendada para una empresa |
|---|---|---|
| Verificación en dos pasos | Opcional para cada usuario | Obligatoria para toda la organización |
| Compartir documentos fuera | Permitido de forma amplia | Restringido por defecto, con excepciones definidas |
| Dispositivos móviles | Gestión básica, sin requisitos propios de la empresa | Bloqueo, cifrado y borrado a distancia exigidos |
| Aplicaciones conectadas | Sin revisión periódica | Revisión periódica de los accesos de terceros |
| Bajas de personal | Sin un procedimiento definido | Procedimiento definido, aplicado el día de la salida |
| Contraseñas y sesiones | Requisitos básicos | Contraseñas robustas y cierre de sesiones inactivas |

<!-- PENDIENTE: validar en la consola de Google el estado por defecto actual de la gestión de dispositivos móviles (el WordPress decía «Sin políticas activas»). Se ha redactado de forma prudente. -->

## Más allá de la suite

La protección de Google Workspace llega hasta el correo y los documentos. Los equipos desde los que se trabaja, la red y las copias de seguridad necesitan su propio plan, dentro de una estrategia de [ciberseguridad](/ciberseguridad/) coherente con el resto de sistemas de la empresa.

Si hay requisitos normativos concretos, [Seguridad y cumplimiento](/recursos/seguridad-y-cumplimiento/) repasa qué ofrece cada plataforma. Para quien también gestiona Microsoft 365, los ajustes de esa suite están en [Seguridad en Microsoft 365](/recursos/seguridad-en-microsoft-365/).
