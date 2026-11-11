---
title: "Seguridad en Google Workspace: qué configurar | ADQA"
description: "Seguridad en Google Workspace: qué protege desde el primer día y qué conviene ajustar en la consola, de la verificación en dos pasos a los móviles y Drive."
h1: "Seguridad en Google Workspace: qué protege por defecto y qué hay que configurar"
lead: "Lo que ya viene activado, lo que conviene ajustar en la consola y los descuidos más habituales."
keyword: "seguridad en Google Workspace"
category: workspace
tipo: entender
etiquetas: ["Google Workspace", "Seguridad"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/google-workspace/"
related: ["google-workspace-para-equipos-remotos-e-hibridos", "seguridad-y-cumplimiento", "seguridad-en-microsoft-365"]
imagen: "Consola de administración de Google Workspace en un portátil, con la verificación en dos pasos activada para toda la organización"
tldr: "La seguridad de Google Workspace tiene dos partes. De serie, Gmail filtra spam, phishing y malware. Los datos viajan y se guardan cifrados, y Google mantiene la infraestructura. Lo demás depende de cada empresa. Le toca exigir la verificación en dos pasos, gestionar los dispositivos y limitar qué se comparte fuera. También tiene que revisar con regularidad los permisos y las aplicaciones conectadas."
faq:
  manager:
    - q: "¿Google Workspace es seguro para una empresa sin departamento de informática propio?"
      a: "Sí, siempre que alguien configure bien la verificación en dos pasos, los permisos y las políticas de uso compartido. La plataforma da las herramientas, pero no se activan solas. Conviene que lo haga alguien que conozca la consola de administración."
    - q: "¿Se puede retirar la información de la empresa de un móvil extraviado?"
      a: "Sí, si tienes configurada la gestión de dispositivos móviles. Desde la consola impides que ese móvil siga accediendo a los datos de la empresa. También puedes borrar a distancia la cuenta corporativa. No hace falta esperar a que la persona lo devuelva."
    - q: "¿Cómo sabemos si nuestra cuenta de Google Workspace está bien configurada?"
      a: "Con una revisión de la configuración. Lo primero es mirar la verificación en dos pasos y quién tiene permisos de administrador. Después, las políticas de dispositivos y las aplicaciones conectadas a las cuentas."
  tecnico:
    - q: "¿Cómo se obliga a usar la verificación en dos pasos en toda la organización?"
      a: "Desde la consola de administración. Se activa la verificación obligatoria por unidad organizativa, es decir, por departamento o grupo de cuentas. Antes de exigirla, se da un periodo de gracia para que cada usuario la configure."
    - q: "¿Se puede limitar con quién se comparten los documentos de Drive?"
      a: "Sí, con políticas de uso compartido para toda la organización o por unidad organizativa. Lo habitual es restringir por defecto el uso compartido fuera del dominio y permitirlo como excepción, por ejemplo con dominios de confianza."
    - q: "¿Cómo se controla qué aplicaciones externas acceden a Gmail o a Drive?"
      a: "En la consola está el control de acceso de aplicaciones. Muestra cuáles han recibido permisos mediante OAuth y a qué datos llegan. OAuth es el sistema que da acceso a una aplicación sin entregarle tu contraseña. Desde la consola se revocan las que ya no se usan y se decide cuáles pueden conectarse en adelante."
---
Google Workspace viene con varias protecciones activadas de serie. Otra parte de la seguridad la decides tú, en la consola de administración. Ahí se fija quién entra, desde qué dispositivos y qué se comparte con quién. Las dos se complementan.

Por eso, más que preguntarte si Google Workspace es seguro, comprueba si está bien configurado para tu empresa.

## Lo que Google Workspace protege desde el primer día

- **Filtrado de spam, phishing y malware.** Gmail aparta la mayor parte del correo malicioso antes de que lo veas. El aviso falso de tu banco con un enlace trampa suele quedarse por el camino. Google actualiza ese filtrado de forma continua.
- **Cifrado en tránsito y en reposo.** Los correos y los archivos viajan cifrados y se guardan cifrados en los centros de datos de Google. Para este nivel no tienes que activar nada.
- **Infraestructura mantenida por Google.** Google se ocupa de los centros de datos, las actualizaciones y los parches de la plataforma. No le toca a tu empresa.

Esta parte no te pide ninguna acción. La siguiente, sí.

## Lo que se ajusta desde la consola de administración

- **Verificación en dos pasos obligatoria.** Con ella, una contraseña filtrada ya no basta. Si alguien consigue la tuya, le falta el segundo paso y se queda en la puerta. Conviene exigirla a toda la organización, no dejarla a elección de cada persona.
- **Gestión de dispositivos móviles.** Puedes exigir bloqueo de pantalla y cifrado. Y si alguien se deja el móvil en un taxi, borras a distancia los datos de la empresa.
- **Control del uso compartido externo.** Es fácil compartir una hoja con «cualquier persona con el enlace» sin pensar en el alcance. Ese enlace se puede reenviar a quien sea. Una política de organización lo limita por defecto y lo deja como excepción.
- **Revisión de permisos y aplicaciones conectadas.** Las aplicaciones de terceros con acceso al correo o a Drive pueden acumular permisos que nadie revisa después. Por ejemplo, la aplicación de encuestas que alguien conectó un día a su cuenta.
- **Contraseñas y sesiones.** Exigir contraseñas robustas y cerrar las sesiones inactivas reduce el riesgo, sobre todo si un equipo se pierde o se comparte.

Estos ajustes pesan todavía más cuando tu equipo trabaja fuera de la oficina. Lo explica [Google Workspace para equipos remotos e híbridos](/recursos/google-workspace-para-equipos-remotos-e-hibridos/).

## Errores de configuración habituales

Suelen ser descuidos pequeños. Alguien recibió permisos de administrador para un ajuste puntual y todavía los conserva. Estos son los más comunes:

- Dejar la verificación en dos pasos como opcional.
- Tener más cuentas con permisos de administrador de las necesarias.
- Permitir por defecto compartir documentos con cualquiera que tenga el enlace.
- Tardar en dar de baja las cuentas de quien deja la empresa.
- No revisar qué aplicaciones de terceros tienen acceso al correo o a Drive.

Todos se corrigen desde la consola y apenas cambian la forma de trabajar de tu equipo.

## De la configuración inicial a la recomendada

| Aspecto | Configuración de serie | Configuración recomendada para una empresa |
|---|---|---|
| Verificación en dos pasos | Obligatoria para los administradores; opcional para el resto | Obligatoria para toda la organización |
| Compartir documentos fuera | Permitido de forma amplia | Restringido por defecto, con excepciones definidas |
| Dispositivos móviles | Gestión básica, sin requisitos propios de la empresa | Bloqueo, cifrado y borrado a distancia exigidos |
| Aplicaciones conectadas | Sin revisión periódica | Revisión periódica de los accesos de terceros |
| Bajas de personal | Sin un procedimiento definido | Procedimiento definido, aplicado el día de la salida |
| Contraseñas y sesiones | Requisitos básicos | Contraseñas robustas y cierre de sesiones inactivas |

<!-- PENDIENTE: validar en la consola de Google el estado por defecto actual de la gestión de dispositivos móviles (el WordPress decía «Sin políticas activas»). Se ha redactado de forma prudente. -->

## Más allá de la suite

La protección de Google Workspace llega hasta el correo y los documentos. Si abres Gmail desde un portátil sin actualizar, ese portátil queda fuera de su alcance. Los equipos, la red y las copias de seguridad necesitan su propio plan. Ese plan encaja en una estrategia de [ciberseguridad](/ciberseguridad/) coherente con el resto de sistemas de la empresa.

Si tienes requisitos normativos concretos, [Seguridad y cumplimiento](/recursos/seguridad-y-cumplimiento/) repasa qué ofrece cada plataforma. Si también gestionas Microsoft 365, los ajustes de esa suite están en [Seguridad en Microsoft 365](/recursos/seguridad-en-microsoft-365/).
