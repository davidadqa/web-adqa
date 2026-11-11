---
title: "Seguridad en Microsoft 365: qué configurar | ADQA"
description: "Seguridad en Microsoft 365: qué protege de serie y qué conviene configurar en tu empresa, de la verificación en dos pasos al acceso condicional e Intune."
h1: "Seguridad en Microsoft 365: qué protege de serie y qué queda en manos de la empresa"
lead: "Microsoft se ocupa de la plataforma. Cómo se configura y se usa en tu empresa es lo que la convierte en protección real."
keyword: "seguridad en Microsoft 365"
category: workspace
tipo: entender
etiquetas: ["Microsoft 365", "Seguridad"]
date: 2026-07-04
updated: 2026-11-02
servicio: "/microsoft-365/"
related: ["seguridad-y-cumplimiento", "seguridad-en-google-workspace-que-protege-y-que-configurar", "que-incluye-microsoft-365-para-empresas"]
imagen: "Responsable de informática revisando en un portátil las directivas de acceso condicional de Microsoft Entra ID"
tldr: "Microsoft 365 incluye de serie el filtrado de spam y phishing en el correo. También cifra los datos en tránsito y en reposo, y la infraestructura la mantiene Microsoft. La protección efectiva depende de la configuración de cada empresa. Las claves son la verificación en dos pasos para todos en Microsoft Entra ID y el acceso condicional. También cuentan la gestión de dispositivos con Intune, pocos administradores y límites al uso compartido externo."
faq:
  manager:
    - q: "¿Microsoft 365 es seguro tal como viene configurado?"
      a: "Ofrece una base sólida: filtrado del correo, cifrado e infraestructura mantenida por Microsoft. Pero varias protecciones importantes hay que configurarlas según las necesidades de tu empresa. Por ejemplo, el acceso condicional, la gestión de dispositivos o los límites al uso compartido."
    - q: "¿Se pueden borrar los datos de la empresa de un portátil o un móvil perdido?"
      a: "Sí, si el dispositivo está gestionado con Intune. Desde la consola puedes bloquear o borrar a distancia la información corporativa. Por eso conviene configurar la gestión de dispositivos antes de entregar los equipos, no cuando ya hace falta."
    - q: "¿Cómo sabemos si nuestra configuración de Microsoft 365 está bien planteada?"
      a: "Revisando los puntos que más influyen. Mira quién tiene la verificación en dos pasos y cuántas cuentas son de administrador. Comprueba qué directivas de acceso condicional hay y qué equipos están gestionados. Y repasa cómo se comparte con personas de fuera y qué aplicaciones tienen acceso. Repite la revisión cuando tu empresa crezca o cambie de forma de trabajar."
  tecnico:
    - q: "¿Qué diferencia hay entre la verificación en dos pasos y el acceso condicional?"
      a: "La verificación en dos pasos pide un segundo factor al iniciar sesión. El acceso condicional de Microsoft Entra ID decide qué exigir según el contexto. Por ejemplo, desde un portátil gestionado puede permitir el acceso sin más. Desde un dispositivo desconocido o una ubicación inusual, en cambio, puede pedir una verificación adicional o bloquear el acceso."
    - q: "¿Cuántas cuentas de administrador global conviene tener?"
      a: "Las mínimas imprescindibles, pero más de una, para no depender de una sola persona. Conviene que sean cuentas separadas de las de uso diario y con la verificación reforzada. El resto de tareas se reparte en roles más acotados, como el de administración de usuarios o de Exchange."
    - q: "¿Se pueden proteger los datos de la empresa en móviles personales?"
      a: "Sí. Intune aplica directivas de protección a las aplicaciones de Microsoft 365 del móvil, sin gestionar el dispositivo completo. Puede exigir un PIN o impedir que se copien datos a aplicaciones personales. Si la persona deja la empresa, se borran solo los datos corporativos."
---
Microsoft dedica muchos recursos a la seguridad de su infraestructura, y tu empresa se beneficia de ello. Pero conviene separar dos cosas desde el principio.

La seguridad de la plataforma depende de Microsoft. La de tu tenant (el espacio de tu empresa en Microsoft 365) es otra historia. Depende de cómo se configura y se usa, y eso lo decides tú o quien te lo gestiona. La primera viene de serie. La segunda es la que marca la diferencia en el día a día.

## Lo que Microsoft 365 protege de serie

- **Filtrado del correo.** Exchange Online detiene de forma automática buena parte del spam, el phishing y el malware antes de que llegue a tu bandeja. Esa factura falsa de un proveedor desconocido, muchas veces, ni siquiera llega.
- **Cifrado de los datos.** La información se cifra mientras viaja y mientras está guardada en los servidores de Microsoft. Ese nivel básico no necesita configuración adicional.
- **Infraestructura y actualizaciones.** El mantenimiento de los centros de datos y las actualizaciones del servicio corren a cargo de Microsoft.
- **Certificaciones de la infraestructura.** Microsoft mantiene certificaciones de seguridad y cumplimiento de su plataforma. Son una buena base, pero no cubren la configuración de tu empresa. Lo verás en [Seguridad y cumplimiento](/recursos/seguridad-y-cumplimiento/).

## Lo que depende de la configuración de tu empresa

### Identidades, en Microsoft Entra ID

- **Verificación en dos pasos para todos.** Los tenants recientes suelen tener activados los valores de seguridad predeterminados, que la exigen. En tenants más antiguos, o si se han desactivado, compruébalo. Microsoft ya la exige para entrar en sus centros de administración, pero no al resto de usuarios. Sin ella, una contraseña filtrada basta para entrar en una cuenta.
- **Acceso condicional.** Permite exigir condiciones para iniciar sesión, como un dispositivo gestionado o una ubicación conocida. Supón que alguien prueba la contraseña de tu administrativa desde otro país. Con una directiva bien puesta, no entra aunque la acierte. Está disponible en Business Premium y en los planes Enterprise. Pero las directivas hay que diseñarlas para cada empresa.
- **Pocas cuentas de administrador.** Las cuentas con el rol de administrador global deberían ser las mínimas. Conviene, además, separarlas de las de uso diario.

### Dispositivos, con Intune

- **Políticas para portátiles y móviles de empresa.** Cifrado, bloqueo de pantalla y borrado a distancia si un equipo se pierde. Si alguien se deja el portátil en el tren, borras desde la consola los datos de la empresa.
- **Protección de los datos en móviles personales.** Se aplica solo a las aplicaciones de Microsoft 365, sin gestionar el teléfono entero.

Qué planes incluyen estas herramientas lo tienes en [Qué incluye Microsoft 365 para empresas](/recursos/que-incluye-microsoft-365-para-empresas/).

### Datos y correo

- **Uso compartido externo.** OneDrive, SharePoint y Teams permiten compartir con personas de fuera e invitar a usuarios externos. Decide hasta dónde y déjalo configurado para toda la organización.
- **Protección frente a amenazas.** Todos los planes filtran el correo malicioso. Business Premium añade Microsoft Defender: comprueba los enlaces en el momento del clic, analiza los adjuntos y protege los equipos.
- **Autenticación del correo del dominio** (SPF, DKIM y DMARC). Son registros de tu dominio que demuestran que un correo sale de verdad de tu empresa. Así nadie puede hacerse pasar por ti con facilidad.
- **Aplicaciones de terceros.** Revisa qué aplicaciones tienen permisos sobre las cuentas y quién puede autorizar nuevas.

## Errores de configuración habituales

Abre la lista de administradores globales. Si no reconoces todos los nombres, ya sabes por dónde empezar. Estos son los fallos que más se repiten:

- Verificación en dos pasos activada solo para algunos usuarios.
- Demasiadas cuentas con el rol de administrador global.
- Ninguna directiva de acceso condicional: se entra desde cualquier dispositivo o ubicación, sin condiciones.
- Portátiles y móviles sin gestionar, sin posibilidad de borrado a distancia.
- Enlaces para compartir abiertos a cualquier persona como opción por defecto.
- Aplicaciones de terceros con acceso a las cuentas corporativas que nadie revisa.

La mayoría de estos fallos se corrige desde los centros de administración de Microsoft 365 y de Entra ID. Muchos, además, se arreglan con cambios que tu equipo apenas nota.

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

La papelera de Microsoft 365 guarda lo eliminado solo durante un tiempo. Si hoy necesitas una carpeta que alguien borró hace meses, puede que ya no esté ahí. Pasado ese plazo, recuperar un buzón o una carpeta exige una copia propia. Esa copia cubre el correo, OneDrive, SharePoint y Teams, y va dentro del plan de [backup y continuidad de negocio](/recursos/backup-y-continuidad-de-negocio/) de tu empresa.

Para Google Workspace, los ajustes equivalentes los tienes en [Seguridad en Google Workspace](/recursos/seguridad-en-google-workspace-que-protege-y-que-configurar/).
