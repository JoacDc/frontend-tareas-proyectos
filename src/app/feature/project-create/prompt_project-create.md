# Contexto de Desarrollo: Feature Project Creation

Actúa como un desarrollador Senior de Angular especializado en Angular 21, Standalone Components, Signals, Reactive Forms y Tailwind CSS v4.

Estoy siguiendo la metodología Spec Driven Development (SDD).

## Contexto del Sistema

Estoy desarrollando el frontend de una aplicación de gestión de tareas.

Backend disponible en:

```text
http://localhost:8080/projects
```

La implementación debe respetar estrictamente la especificación funcional contenida en `spec.md`. Si existe alguna contradicción entre el código generado y la SPEC, debe prevalecer la SPEC.

## Tecnologías

* Angular 21
* Standalone Components
* Signals
* Reactive Forms
* RxJS
* Tailwind CSS v4
* TypeScript

## Especificación Funcional

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

## Tarea

Implementar la funcionalidad completa de creación de proyectos.

Generar:

1. `ProjectRequestDTO`
2. `ProjectService`
3. `ProjectCreateComponent`
4. Template HTML
5. Validadores personalizados
6. Manejo de errores HTTP
7. Cálculo automático del estado

## Reglas funcionales

### Campos

**Nombre**

* Obligatorio.

**Fecha de inicio**

* Obligatoria.
* No puede ser anterior a la fecha actual.

**Fecha de fin**

* Obligatoria.
* No puede ser anterior a la fecha actual.
* No puede ser menor que la fecha de inicio.

**Descripción**

* Opcional.

**Estado**

* Solo lectura.
* No editable por el usuario.
* Calculado automáticamente.
* Debe enviarse al backend.

### Cálculo del estado

**PLANNED**

```text
startDate > hoy
```

**ACTIVE**

```text
hoy >= startDate && hoy <= endDate
```

**CLOSED**

```text
hoy > endDate
```

El estado debe recalcularse automáticamente cuando cambien las fechas.

### Manejo de fechas

Los inputs tipo date devuelven valores en formato:

```text
YYYY-MM-DD
```

No utilizar:

```ts
new Date('YYYY-MM-DD')
```

Utilizar una función auxiliar para parsear fechas localmente.

Normalizar todas las comparaciones mediante:

```ts
date.setHours(0, 0, 0, 0);
```

para evitar errores por zona horaria, horas, minutos o segundos.

### Validaciones

Mostrar mensajes específicos para:

```text
El nombre es requerido
La fecha de inicio es requerida
La fecha de fin es requerida
La fecha de inicio no puede ser anterior a hoy
La fecha de fin no puede ser anterior a hoy
La fecha de fin debe ser igual o posterior a la fecha de inicio
La fecha de inicio no puede ser posterior a la fecha de fin
```

Los campos inválidos deben mostrarse con borde rojo.

### Manejo de errores

**HTTP 400**

* Mostrar mensaje devuelto por el backend.
* Mantener formulario abierto.
* Mantener datos ingresados.

**HTTP 500**

* Mostrar: "Error del servidor. Intente nuevamente más tarde".
* Mantener formulario abierto.
* Mantener datos ingresados.

### Creación exitosa

Cuando el backend responda `201`:

* Mostrar "Proyecto creado correctamente".
* Limpiar formulario.
* Mantener formulario abierto.
* No redirigir automáticamente.
* Reiniciar estado visual del formulario.

### Cancelación

Al presionar Cancelar:

* Limpiar formulario.
* Limpiar mensajes.
* Navegar al listado de proyectos.

## Requisitos de entrega

Separar claramente:

* ProjectRequestDTO
* ProjectService
* project-create.component.ts
* project-create.component.html

## Calidad esperada

* Angular 21.
* Signals para estado visual.
* Reactive Forms.
* Tipado estricto.
* Código limpio.
* Sin warnings de TypeScript.
* Sin errores de Angular.
* Sin errores en consola.

## Explicación

Explicar brevemente las decisiones técnicas utilizadas:

* Signals
* Reactive Forms
* Validadores personalizados
* Manejo de fechas
* RxJS
* Manejo de errores
* Tailwind CSS
* Cálculo automático del estado
