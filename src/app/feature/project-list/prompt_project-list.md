# Prompt: Implementación de listado de proyectos en Angular

## 1. Rol y tecnología
Actúa como un desarrollador senior de Angular 21. Utiliza standalone components, Signals, Tailwind CSS y sintaxis moderna de control flow (@if, @else if, @else, @for).

## 2. Contexto del sistema
Estoy desarrollando el frontend de una aplicación de gestión de tareas y proyectos. El backend es una API REST desarrollada en Java/Spring Boot que ya está corriendo en http://localhost:8080. La API responde con datos de proyectos en formato JSON.

# SPEC  — Referencia: Listado de proyectos

| Campo | Descripción y criterio de calidad                                                                                                                                                                                                                                                                                                                                                                      |
| :--- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Nombre de la feature** | Listado de proyectos del usuario                                                                                                                                                                                                                                                                                                                                                                       |
| **Descripción general** | El usuario puede visualizar todos los proyectos cargados en el sistema en una cuadrícula de tarjetas, viendo su nombre, descripción y estado actual. Ademas, deber tener 3 botones (Agregar Proyecto, Agregar Tarea, Eliminar Proyecto) para que el usuario tenga la comodidad de trabajar.                                                                                                            |
| **Endpoints involucrados** | **GET** `/projects` <br><br> - **Response:** Array de `ProjectResponseDTO` `{ id, name, startDate, endDate, status, description }` <br> - **Error:** Manejo de 500 si el servidor está caído.                                                                                                                                                                                                          |
| **Restricciones de negocio** | - Las fechas deben formatearse como `DD/MM/YYYY`. <br> - Los proyectos deben mostrarse independientemente del estado en el que se encuentre el proyecto. <br> - El badge de estado debe cambiar de color según el valor (ej: ACTIVE en verde, PLANNED en azul, CLOSED en girs).                                                                                                                        |
| **Lineamientos técnicos** | Standalone Components, **Tailwind CSS** para el diseño, **Signals** para el estado de la lista, y `ProjectService` para la comunicación.                                                                                                                                                                                                                                                               |
| **Criterios de aceptación** | 1. **Dado** que existen proyectos, **cuando** carga la ruta `/projects`, **entonces** se muestran en tarjetas de Tailwind. <br> 2. **Dado** que el servicio falla, **cuando** se intenta recuperar los datos, **entonces** se muestra un mensaje de error amigable. <br> 3. **Dado** que no hay proyectos, **cuando** se carga la vista, **entonces** aparece un texto "No hay proyectos disponibles". |


## 3. Especificación de la feature (SPEC)
Endpoint: GET /projects
Response: Array de ProjectResponseDTO con { id, name, startDate, endDate, status, description }

Requisitos funcionales:
- Mostrar proyectos en cuadrícula de tarjetas responsive
- Cada tarjeta: nombre, descripción, fechas (formato DD/MM/YYYY), badge de estado
- Badge con colores: ACTIVE (verde), PLANNED (azul), CLOSED (gris)
- Tres botones visibles: "Agregar Proyecto", "Agregar Tarea", "Eliminar Proyecto" (solo UI, sin funcionalidad)
- Manejar estados: carga (spinner), error (mensaje amigable), lista vacía ("No hay proyectos disponibles")
- Ruta: /projects

## 4. Restricciones técnicas concretas
- Angular 21
- Standalone components 
- Signals para estado reactivo 
- Tailwind CSS exclusivamente para estilos
- Sintaxis de control flow moderna ( } @else if { sin saltos de línea)
- Proxy de Angular para evitar CORS: /api → http://localhost:8080
- El service debe llamar a /api/projects (no a la URL directa)
- No implementar lógica de negocio en los botones (solo console.log)

## 5. Formato de salida esperado
Generar el código completo y funcional separado en los siguientes archivos, listo para copiar y pegar:

1. src/app/models/project.models.ts
  - Interfaz ProjectResponseDTO

2. src/app/services/project.service.ts
  - Signals: projects, loading, error
  - Método loadProjects()
  - URL: /api/projects

3. src/app/feature/project-list/project-list.component.ts
  - Inyectar service con inject()
  - Vincular Signals del service
  - Métodos: getStatusColor(), formatDate()
  - Métodos placeholder para botones

4. src/app/feature/project-list/project-list.component.html
  - Estructura @if / } @else if / } @else
  - @for para grid de tarjetas
  - Clases Tailwind para todo el diseño

5. proxy.conf.json (raíz del proyecto)
  - Configuración para redirigir /api a http://localhost:8080



