package com.mazanex.projects.controller;

import com.mazanex.projects.dto.TaskRequestDto; // <-- No olvides este import
import com.mazanex.projects.model.Task;
import com.mazanex.projects.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controlador REST para gestionar tareas asociadas a proyectos.
 */
@RestController
@RequestMapping("/api/projects")
@Tag(name = "Gestión de Tareas", description = "Endpoints para la ejecución y seguimiento de tareas en proyectos")
public class ProjectController {
    
    private final TaskService taskService;

    public ProjectController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Crea una tarea dentro de un proyecto específico.
     *
     * @param projectId identificador del proyecto
     * @param taskDetails datos de la tarea
     * @return tarea creada
     */
    @PostMapping("/{projectId}/tasks")
    @Operation(summary = "Crear nueva tarea", description = "Crea una tarea asociada a un proyecto específico mediante Factory Pattern")
    // Cambiamos @RequestBody Task por TaskRequestDto
    public ResponseEntity<Task> addTask(@PathVariable Long projectId, @RequestBody TaskRequestDto taskDetails) {
        Task createdTask = taskService.createTask(taskDetails, projectId);
        return ResponseEntity.ok(createdTask);
    }

    /**
     * Lista todas las tareas asociadas a un proyecto.
     *
     * @param projectId identificador del proyecto
     * @return listado de tareas o 204 si no hay ninguna
     */
    @GetMapping("/{projectId}/tasks")
    @Operation(summary = "Listar tareas del proyecto", description = "Obtiene todas las tareas asociadas a un proyecto")
    public ResponseEntity<List<Task>> listTasks(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return tasks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tasks);
    }

    /**
     * Actualiza una tarea existente.
     *
     * @param taskId identificador de la tarea
     * @param taskDetails nuevos datos de la tarea
     * @return tarea actualizada
     */
    @PutMapping("/{projectId}/tasks/{taskId}")
    @Operation(summary = "Editar tarea", description = "Actualiza el título o estado de una tarea existente")
    // Cambiamos @RequestBody Task por TaskRequestDto
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody TaskRequestDto taskDetails) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskDetails));
    }

    /**
     * Elimina una tarea del proyecto.
     *
     * @param taskId identificador de la tarea
     * @return respuesta vacía sin contenido
     */
    @DeleteMapping("/{projectId}/tasks/{taskId}")
    @Operation(summary = "Borrar tarea", description = "Elimina una tarea del proyecto")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}