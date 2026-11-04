---
title: "Migración a Google Workspace sin parar tu negocio | ADQA"
description: "Migración a Google Workspace por fases: inventario, grupo piloto, convivencia de sistemas y cambio final del correo, para que tu empresa no deje de trabajar."
h1: "Migrar a Google Workspace sin parar tu negocio: cómo se hace bien"
lead: "Fases, comprobaciones y comunicación: lo que permite cambiar de sistema sin que el correo se detenga."
keyword: "migración a Google Workspace"
category: workspace
tipo: hacer
etiquetas: ["Google Workspace", "Migración"]
date: 2026-07-03
updated: 2026-11-02
servicio: "/google-workspace/"
related: ["que-es-google-workspace-y-por-que-migrar-tu-empresa", "seguridad-en-google-workspace-que-protege-y-que-configurar", "cuando-tiene-sentido-cambiar-de-microsoft-365-a-google-workspace-o-al-reves"]
imagen: "Responsable de informática revisando en un portátil el avance de una migración de buzones de correo por fases"
tldr: "Una migración a Google Workspace no interrumpe la actividad cuando sigue un orden. Primero se hace el inventario de cuentas y datos y se prepara el dominio. Después se prueba con un grupo piloto. Luego se traslada el resto por bloques, con el sistema antiguo aún en marcha. El cambio del correo llega al final, con todo verificado. Así nadie se queda sin correo y cualquier ajuste afecta solo a unas pocas personas."
faq:
  manager:
    - q: "¿Habrá algún momento sin correo durante la migración?"
      a: "No debería. Mientras se trasladan los datos, todo el mundo sigue con el sistema de siempre. El correo empieza a llegar a Google Workspace solo al final. Para entonces, los buzones ya están copiados y revisados."
    - q: "¿Cuánto dura la migración de una empresa completa?"
      a: "La marcan el número de cuentas y los años de correo y de archivos acumulados. Con el inventario inicial se fija la duración de cada fase. El calendario se comparte antes de empezar, para que cada persona de tu equipo sepa cuándo le toca."
    - q: "¿Los empleados tienen que hacer algo por su cuenta?"
      a: "Muy poco. Iniciar sesión con sus nuevas credenciales cuando se les indique y asistir a una formación breve. La copia de los datos y la configuración corren a cargo de quien gestiona la migración."
  tecnico:
    - q: "¿Cómo se migra el correo histórico sin perder adjuntos ni carpetas?"
      a: "Con herramientas de migración que copian los mensajes con sus adjuntos. También replican la estructura de carpetas del sistema de origen. En Gmail, esas carpetas pasan a ser etiquetas. No hace falta exportar nada a mano, usuario por usuario."
    - q: "¿En qué momento se cambian los registros MX?"
      a: "Al final, cuando los buzones ya están migrados y verificados. Los registros MX indican a qué servidor llega el correo de tu dominio. Hasta ese momento, el correo sigue entrando por el sistema anterior. Tras el cambio, una sincronización final recoge lo que haya llegado allí mientras el cambio se propagaba."
    - q: "¿Cómo se valida que el grupo piloto ha ido bien?"
      a: "Revisando con esas personas lo que ven en el sistema nuevo. Su correo histórico, sus contactos, sus calendarios y los permisos de sus archivos compartidos tienen que estar como en el sistema anterior. Solo entonces se pasa al resto de la plantilla."
---
La duda que más se repite antes de migrar el correo es si habrá algún momento sin él. Sobre todo si el día del cambio esperas el presupuesto de un proveedor. Con una migración por fases bien planificada, ese hueco no tiene por qué existir. El sistema antiguo sigue en marcha mientras se trasladan los datos. Y el cambio definitivo llega al final, con todo comprobado.

Para que sea así, la planificación pesa más que la herramienta. Si todavía estás valorando el paso, empieza por [qué es Google Workspace y qué aporta](/recursos/que-es-google-workspace-y-por-que-migrar-tu-empresa/).

## Cuatro descuidos fáciles de evitar

Cuando una migración se complica, el motivo suele ser un paso saltado, no la plataforma. Estos son los descuidos más habituales. Cada uno se evita con algo sencillo:

- **Migrar sin inventario.** Si no sabes cuántas cuentas, alias y listas hay, alguna puede quedarse fuera. Por ejemplo, el alias de facturas que nadie recordaba. Un listado completo antes de empezar lo evita.
- **Retirar el sistema antiguo antes de validar el nuevo.** Con un periodo de convivencia, los ajustes se resuelven casi sin que tu equipo lo note.
- **No avisar al equipo.** Aunque la parte técnica vaya bien, el cambio se vive mejor con información. Cada persona tiene que saber qué cambia, cuándo y qué tiene que hacer.
- **Subestimar el correo histórico.** Mover años de correo y adjuntos lleva su tiempo. Se planifica con antelación, no el mismo día del cambio.

## Las fases de una migración sin cortes

1. **Inventario y diagnóstico.** Se listan cuentas, alias, listas de distribución, calendarios compartidos y el volumen de correo y de archivos. Se listan también los equipos y aplicaciones que envían correo en nombre de la empresa. Puede ser el ERP (el programa de gestión) o una impresora que escanea al correo. Después del cambio, habrá que reconfigurarlos. Es el momento de decidir qué edición necesita cada perfil. Puedes [combinarlas en el mismo dominio](/google-workspace/licenciamiento-mixto-google-workspace/).
2. **Preparación del entorno.** Se verifica tu dominio y se crean los usuarios y los grupos. Antes de mover ningún dato, se dejan listas las [políticas de seguridad de Google Workspace](/recursos/seguridad-en-google-workspace-que-protege-y-que-configurar/).
3. **Grupo piloto.** Unas pocas personas de tu equipo pasan primero y trabajan ya con el sistema nuevo. Si su correo, su agenda y sus archivos aparecen completos, se sigue adelante.
4. **Migración por fases.** El resto de tu plantilla pasa por bloques, mientras todos siguen trabajando con el sistema anterior. Así, una incidencia puntual afecta a pocas personas y se resuelve con calma.
5. **Cambio del correo.** Con los buzones comprobados, se apuntan los registros MX a Google. Una sincronización final trae los mensajes que todavía hayan entrado en el sistema anterior.
6. **Validación y cierre.** Se confirma que el correo histórico, los contactos, los calendarios y los documentos están accesibles. Solo entonces se retira el sistema anterior.

<!-- PENDIENTE: el WordPress decía que una pyme «suele completar el proceso en cuestión de días». Se ha retirado hasta que ADQA confirme si quiere dar un plazo orientativo («habitualmente…»). -->

## Qué preparar antes del día del cambio

El día del cambio, alguien abre el portátil y no sabe con qué contraseña entrar. Eso se evita con cuatro cosas preparadas de antemano:

- **Comunicación interna clara.** Qué cambia, cuándo y qué tiene que hacer cada persona. Normalmente, solo iniciar sesión con sus nuevas credenciales.
- **Copia de seguridad del sistema anterior** antes de retirarlo. Hazla dentro de tu política de [backup y continuidad de negocio](/recursos/backup-y-continuidad-de-negocio/).
- **Plan de vuelta atrás**, por si el piloto muestra algo que no funciona como se esperaba.
- **Formación breve** sobre lo que más cambia en el día a día. Por ejemplo, dónde está el correo, cómo se comparte un documento sin adjuntarlo y cómo se convoca una reunión.

## Lista de comprobación de una migración planificada

¿Tienes que explicar el plan a dirección sin entrar en detalles? Esta tabla lo resume.

| Qué cuidar | Cómo se resuelve en una migración por fases |
|---|---|
| Que el correo no se interrumpa | Convivencia de los dos sistemas y cambio de los registros MX al final |
| Validar antes de escalar | Grupo piloto con usuarios reales |
| Que el equipo sepa qué cambia | Comunicación programada y formación breve |
| El correo histórico | Volumen calculado en el inventario y copia planificada |
| Poder deshacer un paso | Plan de vuelta atrás definido antes de empezar |
| La duración total | Fases acotadas, con un calendario conocido de antemano |

Si el destino es Microsoft 365, el orden es parecido. La diferencia es que los accesos a cada carpeta compartida se revisan uno a uno. Lo explica [Migración a Microsoft 365 sin perder productividad](/recursos/migracion-a-microsoft-365-sin-perder-productividad/).
