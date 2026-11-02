---
title: "Seguridad en Microsoft 365: qué configurar | ADQA"
description: "Seguridad en Microsoft 365: qué protege de serie y qué conviene configurar en tu empresa, de la verificación en dos pasos al acceso condicional e Intune."
h1: "Seguridad en Microsoft 365: qué protege de serie y qué queda en manos de la empresa"
lead: "Microsoft se ocupa de la plataforma. Cómo se configura y se usa en tu empresa es lo que la convierte en protección real."
keyword: "seguridad en Microsoft 365"
category: workspace
etiquetas: ["Microsoft 365", "Seguridad"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/microsoft-365/"
related: ["seguridad-y-cumplimiento", "seguridad-en-google-workspace-que-protege-y-que-configurar", "que-incluye-microsoft-365-para-empresas"]
imagen: "Responsable de informática revisando en un portátil las directivas de acceso condicional de Microsoft Entra ID"
tldr: "Microsoft 365 incluye de serie filtrado de spam y phishing en el correo, cifrado de los datos en tránsito y en reposo, e infraestructura mantenida por Microsoft. La protección efectiva depende de la configuración de cada empresa: verificación en dos pasos para todos en Microsoft Entra ID, acceso condicional, gestión de dispositivos con Intune, pocas cuentas de administrador y límites al uso compartido externo."
faq:
  manager:
    - q: "¿Microsoft 365 es seguro tal como viene configurado?"
      a: "Ofrece una base sólida: filtrado del correo, cifrado e infraestructura mantenida por Microsoft. Pero varias protecciones importantes, como el acceso condicional, la gestión de dispositivos o los límites al uso compartido, hay que configurarlas según las necesidades de cada empresa."
    - q: "¿Se pueden borrar los datos de la empresa de un portátil o un móvil perdido?"
      a: "Sí, si el dispositivo está gestionado con Intune. Desde la consola se puede bloquear o borrar a distancia la información corporativa. Por eso conviene configurar la gestión de dispositivos antes de entregar los equipos, no cuando ya hace falta."
    - q: "¿Cómo sabemos si nuestra configuración de Microsoft 365 está bien planteada?"
      a: "Revisando los puntos que más influyen: quién tiene la verificación en dos pasos, cuántas cuentas son de administrador, qué directivas de acceso condicional hay, qué equipos están gestionados, cómo se comparte con personas de fuera y qué aplicaciones tienen acceso. Conviene repetir la revisión cuando la empresa crece o cambia de forma de trabajar."
  tecnico:
    - q: "¿Qué diferencia hay entre la verificación en dos pasos y el acceso condicional?"
      a: "La verificación en dos pasos pide un segundo factor al iniciar sesión. El acceso condicional de Microsoft Entra ID decide qué exigir según el contexto: por ejemplo, permitir el acceso sin más desde un portátil gestionado y pedir una verificación adicional, o bloquearlo, desde un dispositivo desconocido o una ubicación inusual."
    - q: "¿Cuántas cuentas de administrador global conviene tener?"
      a: "Las mínimas imprescindibles. Conviene que haya más de una, para no depender de una sola persona, que sean cuentas separadas de las de uso diario y que tengan la verificación reforzada. El resto de tareas se reparten con roles más acotados, como el de administración de usuarios o de Exchange."
    - q: "¿Se pueden proteger los datos de la empresa en móviles personales?"
      a: "Sí. Intune permite aplicar directivas de protección a las aplicaciones de Microsoft 365 del móvil, como exigir un PIN o impedir copiar datos a aplicaciones personales, sin gestionar el dispositivo completo. Si la persona deja la empresa, se borran solo los datos corporativos."
---
Microsoft dedica muchos recursos a la seguridad de su infraestructura, y cualquier empresa que usa Microsoft 365 se beneficia de ello. Pero conviene separar dos cosas desde el principio. La seguridad de la plataforma depende de Microsoft. La de cómo se configura y se usa depende de la empresa, o de quien la gestiona.

La primera viene de serie. La segunda es la que marca la diferencia en el día a día.

## Lo que Microsoft 365 protege de serie

- **Filtrado del correo.** Exchange Online detiene de forma automática buena parte del spam, el phishing y el malware antes de que llegue a la bandeja de entrada.
- **Cifrado de los datos.** La información se cifra mientras viaja y mientras está almacenada en los servidores de Microsoft, sin configuración adicional para ese nivel básico.
- **Infraestructura y actualizaciones.** El mantenimiento de los centros de datos y las actualizaciones del servicio corren a cargo de Microsoft.
- **Certificaciones de la infraestructura.** Microsoft mantiene certificaciones de seguridad y cumplimiento de su plataforma. Son una buena base, pero no cubren la configuración de cada empresa, como se explica en [Seguridad y cumplimiento](/recursos/seguridad-y-cumplimiento/).

## Lo que depende de la configuración de tu empresa

### Identidades, en Microsoft Entra ID

- **Verificación en dos pasos para todos.** Los tenants recientes suelen tener activados los valores de seguridad predeterminados, que la exigen. En tenants más antiguos, o si se han desactivado, hay que comprobarlo: sin ella, una contraseña filtrada basta para entrar en una cuenta.
- **Acceso condicional.** Permite exigir condiciones para iniciar sesión, como un dispositivo gestionado o una ubicación conocida. Está disponible en Business Premium y en los planes Enterprise, pero las directivas hay que diseñarlas para cada empresa.
- **Pocas cuentas de administrador.** Las cuentas con el rol de administrador global deberían ser las mínimas y estar separadas de las de uso diario.

### Dispositivos, con Intune

- **Políticas para portátiles y móviles de empresa.** Cifrado, bloqueo de pantalla y borrado a distancia si un equipo se pierde.
- **Protección de los datos en móviles personales.** Se aplica solo a las aplicaciones de Microsoft 365, sin gestionar el teléfono entero.

Qué planes incluyen estas herramientas se repasa en [Qué incluye Microsoft 365 para empresas](/recursos/que-incluye-microsoft-365-para-empresas/).

### Datos y correo

- **Uso compartido externo.** OneDrive, SharePoint y Teams permiten compartir con personas de fuera e invitar a usuarios externos. Conviene decidir hasta dónde y dejarlo configurado a nivel de organización.
- **Protección frente a amenazas.** Microsoft Defender, incluido en Business Premium, revisa los adjuntos y los enlaces del correo y protege los equipos.
- **Autenticación del correo del dominio** (SPF, DKIM y DMARC), para que nadie pueda enviar correos haciéndose pasar por la empresa con facilidad.
- **Aplicaciones de terceros.** Revisar qué aplicaciones tienen permisos sobre las cuentas y quién puede autorizar nuevas.

## Errores de configuración habituales

- Verificación en dos pasos activada solo para algunos usuarios.
- Demasiadas cuentas con el rol de administrador global.
- Ninguna directiva de acceso condicional, de modo que se puede iniciar sesión desde cualquier dispositivo o ubicación sin condiciones.
- Portátiles y móviles sin gestionar, sin posibilidad de borrado a distancia.
- Enlaces para compartir abiertos a cualquier persona como opción por defecto.
- Aplicaciones de terceros con acceso a las cuentas corporativas que nadie revisa.

La buena noticia es que la mayoría se corrigen desde los centros de administración de Microsoft 365 y de Entra ID, y muchos con cambios que el equipo apenas nota.

## Punto de partida y configuración recomendada

| Aspecto | Sin revisar | Recomendado para una empresa |
|---|---|---|
| Verificación en dos pasos | Depende de la antigüedad del tenant y de sus ajustes | Obligatoria para toda la organización |
| Acceso condicional | Sin directivas adaptadas a la empresa | Directivas según dispositivo, ubicación y riesgo |
| Administradores globales | A menudo más de los necesarios | Los mínimos, con cuentas separadas |
| Portátiles y móviles | Sin políticas | Cifrado, bloqueo y borrado a distancia con Intune |
| Uso compartido externo | Abierto también a personas de fuera | Limitado según la política de la empresa |
| Aplicaciones conectadas | Sin revisión | Revisión periódica y autorización controlada |

## Más allá de la configuración

La papelera de Microsoft 365 guarda lo eliminado solo durante un tiempo. Para recuperar un buzón o una carpeta pasado ese plazo hace falta una copia propia del correo, OneDrive, SharePoint y Teams, dentro del plan de [backup y continuidad de negocio](/recursos/backup-y-continuidad-de-negocio/) de la empresa.

Para Google Workspace, los ajustes equivalentes se explican en [Seguridad en Google Workspace](/recursos/seguridad-en-google-workspace-que-protege-y-que-configurar/).
