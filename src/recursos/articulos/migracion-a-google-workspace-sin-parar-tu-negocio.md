---
title: "Migración a Google Workspace sin parar tu negocio | ADQA"
description: "Migración a Google Workspace por fases: inventario, grupo piloto, convivencia de sistemas y cambio final del correo, para que tu empresa no deje de trabajar."
h1: "Migrar a Google Workspace sin parar tu negocio: cómo se hace bien"
lead: "Fases, comprobaciones y comunicación: lo que permite cambiar de sistema sin que el correo se detenga."
keyword: "migración a Google Workspace"
category: workspace
etiquetas: ["Google Workspace", "Migración"]
date: 2026-07-03
updated: 2026-11-02
servicio: "/google-workspace/"
related: ["que-es-google-workspace-y-por-que-migrar-tu-empresa", "seguridad-en-google-workspace-que-protege-y-que-configurar", "cuando-tiene-sentido-cambiar-de-microsoft-365-a-google-workspace-o-al-reves"]
imagen: "Responsable de informática revisando en un portátil el avance de una migración de buzones de correo por fases"
tldr: "Una migración a Google Workspace no interrumpe la actividad cuando sigue un orden: inventario de cuentas y datos, preparación del dominio, prueba con un grupo piloto, traslado del resto por bloques con el sistema antiguo aún en marcha y cambio del correo al final, con todo verificado. Así nadie se queda sin correo y cualquier ajuste afecta solo a unas pocas personas."
faq:
  manager:
    - q: "¿Habrá algún momento sin correo durante la migración?"
      a: "No debería. Mientras se trasladan los datos, todo el mundo sigue usando el sistema de siempre. El correo empieza a llegar a Google Workspace solo al final, cuando los buzones ya están copiados y revisados."
    - q: "¿Cuánto dura la migración de una empresa completa?"
      a: "La marcan el número de cuentas y los años de correo y de archivos acumulados. Con el inventario inicial se fija la duración de cada fase, y el calendario se comparte antes de empezar para que cada persona sepa cuándo le toca."
    - q: "¿Los empleados tienen que hacer algo por su cuenta?"
      a: "Muy poco: iniciar sesión con sus nuevas credenciales cuando se les indique y asistir a una formación breve. La copia de los datos y la configuración corren a cargo de quien gestiona la migración."
  tecnico:
    - q: "¿Cómo se migra el correo histórico sin perder adjuntos ni carpetas?"
      a: "Con herramientas de migración que copian los mensajes con sus adjuntos y replican la estructura de carpetas del sistema de origen, que en Gmail pasan a ser etiquetas. No hace falta exportar nada a mano, usuario por usuario."
    - q: "¿En qué momento se cambian los registros MX?"
      a: "Al final, cuando los buzones ya están migrados y verificados. Hasta ese momento el correo sigue entrando por el sistema anterior. Tras el cambio, una sincronización final recoge los mensajes que hayan llegado allí mientras el cambio se propagaba."
    - q: "¿Cómo se valida que el grupo piloto ha ido bien?"
      a: "Comprobando con esas personas que su correo histórico, sus contactos, sus calendarios y los permisos de sus archivos compartidos se ven igual que en el sistema anterior. Solo entonces se pasa al resto de la plantilla."
---
Antes de migrar el correo de una empresa, la pregunta que más se repite es si habrá algún momento sin correo. Con una migración por fases bien planificada, no tiene por qué haberlo: el sistema antiguo sigue en marcha mientras se trasladan los datos, y el cambio definitivo llega al final, con todo comprobado.

Para que sea así, la planificación pesa más que la herramienta. Si todavía estás valorando el paso, empieza por [qué es Google Workspace y qué aporta](/recursos/que-es-google-workspace-y-por-que-migrar-tu-empresa/).

## Cuatro descuidos fáciles de evitar

Cuando una migración se complica, el motivo suele ser un paso que se ha saltado, no la plataforma. Estos son los descuidos más habituales, y cada uno se evita con algo sencillo:

- **Migrar sin inventario.** Si no se sabe cuántas cuentas, alias y listas hay, alguna puede quedarse fuera. Un listado completo antes de empezar lo evita.
- **Retirar el sistema antiguo antes de validar el nuevo.** Con un periodo de convivencia, los ajustes se resuelven casi sin que el equipo lo note.
- **No avisar al equipo.** Aunque la parte técnica vaya bien, el cambio se vive mejor cuando cada persona sabe qué cambia, cuándo y qué tiene que hacer.
- **Subestimar el correo histórico.** Mover años de correo y adjuntos lleva su tiempo. Se planifica con antelación, no el mismo día del cambio.

## Las fases de una migración sin cortes

1. **Inventario y diagnóstico.** Se listan cuentas, alias, listas de distribución, calendarios compartidos y el volumen de correo y de archivos. También los equipos y aplicaciones que envían correo en nombre de la empresa, como el ERP o una impresora que escanea al correo, porque habrá que reconfigurarlos. Es el momento de decidir qué edición necesita cada perfil, con la opción de [combinarlas en el mismo dominio](/google-workspace/licenciamiento-mixto-google-workspace/).
2. **Preparación del entorno.** Se verifica el dominio, se crean los usuarios y los grupos y se dejan listas las [políticas de seguridad de Google Workspace](/recursos/seguridad-en-google-workspace-que-protege-y-que-configurar/) antes de mover ningún dato.
3. **Grupo piloto.** Unas pocas personas pasan primero y trabajan ya con el sistema nuevo. Si su correo, su agenda y sus archivos aparecen completos, se sigue adelante.
4. **Migración por fases.** El resto de la plantilla pasa por bloques, mientras todos siguen trabajando con el sistema anterior. Así, una incidencia puntual afecta a pocas personas y se resuelve con calma.
5. **Cambio del correo.** Con los buzones comprobados, se apuntan los registros MX a Google. Una sincronización final trae los mensajes que todavía hayan entrado en el sistema anterior.
6. **Validación y cierre.** Se confirma que el correo histórico, los contactos, los calendarios y los documentos están accesibles. Solo entonces se retira el sistema anterior.

<!-- PENDIENTE: el WordPress decía que una pyme «suele completar el proceso en cuestión de días». Se ha retirado hasta que ADQA confirme si quiere dar un plazo orientativo («habitualmente…»). -->

## Qué preparar antes del día del cambio

- **Comunicación interna clara.** Qué cambia, cuándo y qué tiene que hacer cada persona. Normalmente, solo iniciar sesión con sus nuevas credenciales.
- **Copia de seguridad del sistema anterior** antes de retirarlo, coherente con la política de [backup y continuidad de negocio](/recursos/backup-y-continuidad-de-negocio/) de la empresa.
- **Plan de vuelta atrás**, por si el piloto muestra algo que no funciona como se esperaba.
- **Formación breve** sobre lo que más cambia en el día a día: dónde está el correo, cómo se comparte un documento sin adjuntarlo y cómo se convoca una reunión.

## Lista de comprobación de una migración planificada

| Qué cuidar | Cómo se resuelve en una migración por fases |
|---|---|
| Que el correo no se interrumpa | Convivencia de los dos sistemas y cambio de los registros MX al final |
| Validar antes de escalar | Grupo piloto con usuarios reales |
| Que el equipo sepa qué cambia | Comunicación programada y formación breve |
| El correo histórico | Volumen calculado en el inventario y copia planificada |
| Poder deshacer un paso | Plan de vuelta atrás definido antes de empezar |
| La duración total | Fases acotadas, con un calendario conocido de antemano |

Si el destino es Microsoft 365, el orden es parecido, pero los accesos a cada carpeta compartida se revisan uno a uno: lo explica [Migración a Microsoft 365 sin perder productividad](/recursos/migracion-a-microsoft-365-sin-perder-productividad/).
