# SPEC — Referencia: Creación de proyecto del usuario

| Campo | Descripción y criterios de calidad |
| :--- | :--- |
| **Nombre de la feature** | Creación de proyecto |
| **Descripción General** | El usuario, mediante un botón agregar proyecto, puede crear un proyecto completando un formulario con los datos: nombre, fecha de inicio, fecha de fin y descripción. El estado del proyecto se calcula automáticamente en función de las fechas ingresadas y se muestra en modo solo lectura. |
| **Endpoint Involucrados** | **POST** `/projects` <br><br> **Request:** `ProjectRequestDTO` `{ name, startDate, endDate, status, description }` <br><br> **Errores:** manejo 400 si la solicitud es incorrecta. <br> Manejo 500 si el servidor está caído. |
| **Restricciones de negocios** | - La fecha de inicio y la fecha de fin son obligatorias. <br> - El nombre es obligatorio. <br> - La descripción es opcional. <br> - La fecha de inicio no puede ser anterior a la fecha actual. <br> - La fecha de fin no puede ser anterior a la fecha actual. <br> - La fecha de fin no puede ser menor a la fecha de inicio. <br> - La fecha de inicio no puede ser mayor a la fecha de fin. <br> - El estado es calculado automáticamente y no puede ser modificado por el usuario. |
| **Lineamientos técnicos** | Standalone Components, **Tailwind CSS** para el diseño, **Signals** para el estado visual del formulario y `ProjectService` para la comunicación. Reactive Forms para el formulario de creación. Validadores personalizados síncronos para validación de fechas. |
| **Criterios de aceptación** | **1) Creación exitosa del proyecto** <br><br> Dado que el usuario está en la pantalla de creación de proyectos <br><br> Cuando completa el formulario con todos los campos obligatorios: <br><br> - Nombre (ej: nombre del proyecto) <br> - Fecha de inicio (ej: 2026-06-15) <br> - Fecha de fin (ej: 2026-06-20) <br> - Descripción (Opcional) <br><br> Y presiona el botón “Guardar Proyecto” <br><br> Entonces el sistema calcula automáticamente el estado del proyecto según las fechas ingresadas. <br><br> Y el sistema envía una petición POST `/projects` con la estructura: <br><br> ```json { "name": "Nuevo Proyecto", "startDate": "2026-06-15", "endDate": "2026-06-20", "status": "PLANNED", "description": "Descripción opcional" } ``` <br><br> Y el backend debe responder con código `201` <br> Y se debe mostrar un mensaje de éxito ("Proyecto creado correctamente") <br> Y el formulario debe limpiarse automáticamente <br> Y el formulario debe permanecer abierto para permitir una nueva creación. <br><br><br> **2) Validación de campos obligatorios** <br><br> Dado que el usuario está en el formulario de creación de proyectos <br><br> Cuando intenta enviar el formulario sin completar uno o más de los siguientes campos obligatorios: <br><br> - Nombre (vacío) <br> - Fecha de inicio (vacía) <br> - Fecha de fin (vacía) <br><br> Entonces el sistema NO debe enviar la petición al backend <br><br> Y debe mostrar mensajes de error específicos debajo de cada campo: <br><br> - "El nombre es requerido" <br> - "La fecha de inicio es requerida" <br> - "La fecha de fin es requerida" <br><br> Y los campos inválidos deben marcarse visualmente (borde rojo) <br><br> Y el botón "Guardar" debe permanecer habilitado para corregir errores. <br><br><br> **3) Validación de reglas de fechas** <br><br> Dado que el usuario está completando el formulario <br><br> Cuando selecciona una fecha de inicio anterior a la fecha actual <br><br> Entonces debe mostrarse el mensaje: <br><br> - "La fecha de inicio no puede ser anterior a hoy" <br><br> Cuando selecciona una fecha de fin anterior a la fecha actual <br><br> Entonces debe mostrarse el mensaje: <br><br> - "La fecha de fin no puede ser anterior a hoy" <br><br> Cuando la fecha de fin es menor que la fecha de inicio <br><br> Entonces debe mostrarse el mensaje: <br><br> - "La fecha de fin debe ser igual o posterior a la fecha de inicio" <br><br> Cuando la fecha de inicio es mayor que la fecha de fin <br><br> Entonces debe mostrarse el mensaje: <br><br> - "La fecha de inicio no puede ser posterior a la fecha de fin" <br><br> Y el formulario debe permanecer inválido hasta corregir los datos. <br><br><br> **4) Cálculo automático del estado** <br><br> Dado que el usuario completa las fechas del proyecto <br><br> Cuando la fecha de inicio es posterior a la fecha actual <br><br> Entonces el estado debe calcularse automáticamente como: <br><br> - `PLANNED` <br><br> Cuando la fecha actual se encuentra entre la fecha de inicio y la fecha de fin (inclusive) <br><br> Entonces el estado debe calcularse automáticamente como: <br><br> - `ACTIVE` <br><br> Cuando la fecha actual es posterior a la fecha de fin <br><br> Entonces el estado debe calcularse automáticamente como: <br><br> - `CLOSED` <br><br><br> **5) Manejo de errores** <br><br> **Escenario A – Error 400 (Solicitud incorrecta)** <br><br> Dado que el usuario completa el formulario correctamente <br><br> Cuando el backend responde con un error 400 <br><br> Entonces el frontend debe mostrar el mensaje de error proveniente del backend <br><br> Y el formulario debe permanecer abierto con los datos ingresados <br><br> Y el botón "Guardar" debe habilitarse nuevamente <br><br> **Escenario B – Error 500 (Servidor caído)** <br><br> Dado que el usuario completa el formulario correctamente <br><br> Cuando el backend responde con un error 500 (servidor no disponible) <br><br> Entonces el frontend debe mostrar un mensaje genérico: "Error del servidor. Intente nuevamente más tarde" <br><br> Y el formulario debe permanecer abierto <br><br> Y los datos ingresados deben conservarse. <br><br><br> **6) Cancelación** <br><br> Dado que el usuario está en el formulario de creación de proyectos <br><br> Cuando presiona el botón "Cancelar" <br><br> Entonces el formulario debe limpiarse <br><br> Y el usuario debe ser redirigido al listado de proyectos. |

---

## Checklist de Validación

- ✅ El nombre es obligatorio.
- ✅ La fecha de inicio es obligatoria.
- ✅ La fecha de fin es obligatoria.
- ✅ La descripción es opcional.
- ✅ La fecha de inicio no puede ser anterior a hoy.
- ✅ La fecha de fin no puede ser anterior a hoy.
- ✅ La fecha de fin no puede ser menor que la fecha de inicio.
- ✅ La fecha de inicio no puede ser mayor que la fecha de fin.
- ✅ El estado se calcula automáticamente.
- ✅ Si Inicio > Hoy → PLANNED.
- ✅ Si Hoy está entre Inicio y Fin → ACTIVE.
- ✅ Si Hoy > Fin → CLOSED.
- ✅ Se evita el problema de zona horaria al parsear fechas.
- ✅ El formulario muestra mensajes de error debajo de cada campo.
- ✅ Los campos inválidos muestran borde rojo.
- ✅ El formulario no se envía si existen errores.
- ✅ El backend recibe únicamente valores válidos del enum (`PLANNED`, `ACTIVE`, `CLOSED`).
- ✅ Error 400 muestra mensaje del backend.
- ✅ Error 500 muestra mensaje genérico.
- ✅ Crear proyecto muestra mensaje de éxito.
- ✅ Crear proyecto limpia el formulario.
- ✅ El formulario permanece abierto luego de crear.
- ✅ Cancelar limpia el formulario.
- ✅ Cancelar redirige al listado.
- ✅ No existen errores en consola.
