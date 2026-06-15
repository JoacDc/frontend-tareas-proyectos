# Contexto de Desarrollo: Feature Task Creation

Actúa como un desarrollador **Senior de Angular**. Estoy siguiendo la metodología **Spec Driven Development**.

## Contexto del Sistema
Estoy desarrollando el frontend de una app de gestión de tareas. El backend es una API REST en Java.

La implementación debe respetar estrictamente la especificación funcional contenida en `spec.md`. Si existe alguna contradicción entre el código generado y la SPEC, debe prevalecer la SPEC.

## Tecnologías
*   **Framework:** Angular 21
*   **Arquitectura:** Standalone Components
*   **Gestión de Estado:** Signals
*   **Estilos:** Tailwind CSS v4
*   **Formularios:** Reactive Forms

---

# SPEC — Referencia: Creación de tarea asociada a un proyecto

| Campo | Descripción y criterios de calidad |
| :--- | :--- |
| **Nombre de la feature** | Creación de tarea asociada a un proyecto |
| **Descripción General** | El usuario, mediante un botón "Agregar tarea", puede crear una tarea completando un formulario con los datos: título, horas estimadas, responsable, estado, fecha de creación y fecha de finalización. Luego de completar el formulario, debe seleccionar el proyecto al cual se asociará la tarea. Finalmente, el sistema crea la tarea asociada al proyecto seleccionado. |
| **Endpoint Involucrados** | **POST** `/projects/{projectId}/tasks` <br><br> **Request:** `TaskRequestDTO` `{ title, estimatedHours, assignee, status, finishedAt, createdAt }` <br><br> **Response:** `TaskResponseDTO` `{ id, title, project, estimatedHours, assignee, status, createdAt, finishedAt }` <br><br> **Errores:** manejo 400 si la solicitud es incorrecta. <br> Manejo 500 si el servidor está caído. |
| **Restricciones de negocios** | - El título es obligatorio. <br> - Las horas estimadas son obligatorias y deben ser mayores a 0. <br> - El responsable es obligatorio. <br> - El estado es obligatorio. <br> - La fecha de creación es obligatoria. <br> - La fecha de finalización es obligatoria. <br> - La fecha de finalización no puede ser anterior a la fecha de creación. <br> - Debe seleccionarse obligatoriamente un proyecto antes de guardar la tarea. |
| **Lineamientos técnicos** | Standalone Components, **Tailwind CSS** para el diseño, **Signals** para el estado visual del modal, `TaskService` para la comunicación HTTP, **Reactive Forms** para el formulario de creación y **RxJS** para el manejo de respuestas asincrónicas. |
| **Criterios de aceptación** | **1) Apertura del formulario de creación de tarea** <br><br> Dado que el usuario está en el listado de proyectos <br><br> Cuando presiona el botón "Agregar tarea" <br><br> Entonces debe abrirse un modal centrado en pantalla <br> Y debe mostrarse el formulario de creación de tarea con los campos: <br><br> - Título <br> - Horas estimadas <br> - Responsable <br> - Estado <br> - Fecha de creación <br> - Fecha de finalización <br><br> Y el fondo debe oscurecerse visualmente <br><br><br> **2) Validación de campos obligatorios** <br><br> Dado que el usuario está en el formulario de creación de tarea <br><br> Cuando intenta continuar sin completar uno o más campos obligatorios <br><br> Entonces el sistema NO debe avanzar a la selección de proyecto <br><br> Y debe mostrar mensajes de error específicos debajo de cada campo: <br><br> - "El título es obligatorio" <br> - "Las horas estimadas son obligatorias" <br> - "El responsable es obligatorio" <br> - "El estado es obligatorio" <br> - "La fecha de creación es obligatoria" <br> - "La fecha de finalización es obligatoria" <br><br> Y los campos inválidos deben marcarse visualmente con borde rojo <br><br><br> **3) Selección de proyecto** <br><br> Dado que el usuario completó correctamente el formulario <br><br> Cuando presiona el botón "Continuar" <br><br> Entonces el sistema debe mostrar una lista de proyectos disponibles <br> Y el usuario debe poder seleccionar un proyecto <br> Y el proyecto seleccionado debe resaltarse visualmente <br> Y el botón "Guardar tarea" debe permanecer deshabilitado hasta que exista un proyecto seleccionado <br><br><br> **4) Creación exitosa de la tarea** <br><br> Dado que el usuario completó correctamente el formulario <br> Y seleccionó un proyecto válido <br><br> Cuando presiona el botón "Guardar tarea" <br><br> Entonces el sistema debe enviar una petición POST a: `/projects/{projectId}/tasks` <br> Y debe mostrar un mensaje de éxito <br> Y debe cerrar el modal <br> Y debe refrescar la lista de tareas <br><br><br> **5) Manejo de errores** <br><br> **Escenario A – Error 400 (Solicitud incorrecta)** <br><br> Dado que el usuario completa el formulario correctamente <br> Y selecciona un proyecto válido <br><br> Cuando el backend responde con un error 400 <br><br> Entonces el frontend debe mostrar el mensaje de error proveniente del backend <br> Y la tarea NO debe agregarse a la lista <br> Y el modal debe permanecer abierto con los datos ingresados <br> Y el botón "Guardar" debe habilitarse nuevamente <br><br> **Escenario B – Error 500 (Servidor caído)** <br><br> Dado que el usuario completa el formulario correctamente <br> Y selecciona un proyecto válido <br><br> Cuando el backend responde con un error 500 <br><br> Entonces el frontend debe mostrar un mensaje genérico: "Error del servidor. Intente nuevamente más tarde" <br> Y la tarea NO debe agregarse a la lista <br> Y el modal debe permanecer abierto con los datos ingresados <br><br><br> **6) Cancelación** <br><br> Dado que el usuario está en el formulario de creación de tarea <br><br> Cuando presiona el botón "Cancelar" <br><br> Entonces el modal debe cerrarse <br> Y el formulario debe limpiarse <br> Y el usuario debe regresar al listado de proyectos |

---

## Tarea: Generación de Código

Generar el código estructurado y separado para los siguientes elementos:

1. **Interfaz `TaskRequestDTO` y `TaskResponseDTO`**
2. **Servicio `TaskService`** con el método `createTask()`
3. **Componente `AddTaskModalComponent` (Standalone)**
4. **Template HTML** con Tailwind CSS v4
5. **Validadores personalizados** para fechas
6. **Manejo de errores HTTP** (400 y 500)
7. **Flujo de 2 pasos** (formulario → selección de proyecto)

### Requisitos de Entrega:
- **Código separado:** Separar claramente la lógica del servicio, el código TypeScript del componente y el template HTML.
- **Explicación detallada:** Incluir explicación técnica de cada herramienta, patrón o característica de Angular 21 / Tailwind v4 utilizada.

---

## Reglas Funcionales

### Campos del Formulario

| Campo | Obligatorio | Validación adicional |
|-------|-------------|---------------------|
| Título | ✅ Sí | - |
| Horas estimadas | ✅ Sí | Mayor a 0 |
| Responsable | ✅ Sí | - |
| Estado | ✅ Sí | TODO, IN_PROGRESS, DONE |
| Fecha de creación | ✅ Sí | - |
| Fecha de finalización | ✅ Sí | No puede ser anterior a fecha de creación |
| Proyecto | ✅ Sí | Seleccionar de lista |

### Validación de Fechas en `AddTaskModalComponent`

- Los inputs tipo `date` devuelven valores en formato `YYYY-MM-DD`
- No utilizar `new Date('YYYY-MM-DD')` directamente
- Utilizar una función auxiliar para parsear fechas localmente
- Normalizar todas las comparaciones mediante `date.setHours(0, 0, 0, 0)` para evitar errores por zona horaria

### Validaciones Específicas

Mostrar mensajes específicos para:

```text
El título es obligatorio
Las horas estimadas son obligatorias
Las horas estimadas deben ser mayores a 0
El responsable es obligatorio
El estado es obligatorio
La fecha de creación es obligatoria
La fecha de finalización es obligatoria
La fecha de finalización no puede ser anterior a la fecha de creación
Debe seleccionar un proyecto antes de guardar la tarea
