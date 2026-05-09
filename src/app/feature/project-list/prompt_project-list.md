# Prompt: Listado de proyectos

Actúa como un desarrollador Senior de Angular. Estoy siguiendo la metodología Spec Driven Development.

## Contexto del sistema

Estoy desarrollando el frontend de una app de gestión de tareas. El backend es una API REST en Java que ya responde en `http://localhost:8080/projects`.

## Tecnologías

- Angular 21
- Standalone Components
- Signals para el estado
- Tailwind CSS v4

# Especificación de la Feature

# SPEC — Referencia: Listado de proyectos

| Campo | Descripción y criterio de calidad |
|---|---|
| **Nombre de la feature** | Listado de proyectos del usuario |
| **Descripción general** | El usuario puede visualizar todos los proyectos cargados en el sistema en una cuadrícula de tarjetas, viendo su nombre, descripción y estado actual. |
| **Endpoints involucrados** | - **GET** /projects<br>- **Response**: Array de `ProjectResponseDTO` { id, name, startDate, endDate, status, description }<br>- **Error**: Manejo de 500 si el servidor está caído. |
| **Restricciones de negocio** | - Las fechas deben formatearse como `DD/MM/YYYY`.<br>- El badge de estado debe cambiar de color según el valor (ej: ACTIVE en verde, PLANNED en azul). |
| **Lineamientos técnicos** | Standalone Components, **Tailwind CSS** para el diseño, **Signals** para el estado de la lista, y `ProjectService` para la comunicación. |
| **Criterios de aceptación** | 1. **Dado** que existen proyectos, **cuando** carga la ruta `/projects`, **entonces** se muestran en tarjetas de Tailwind.<br>2. **Dado** que el servicio falla, **cuando** se intenta recuperar los datos, **entonces** se muestra un mensaje de error amigable.<br>3. **Dado** que no hay proyectos, **cuando** se carga la vista, **entonces** aparece un texto "No hay proyectos disponibles". |
## Tarea

Generá el código para:

1. La interfaz `ProjectResponseDTO`
2. El `ProjectService` usando Signals
3. El `ProjectListComponent` (standalone) con un diseño de tarjetas usando Tailwind v4

## Importante

- No generes código opaco
- Explicá brevemente por qué usaste Signals en lugar de RxJS para que pueda defenderlo en la revisión
- Todo separado en el componente, el servicio y el template
