package com.mazanex.projects.controller;

import com.mazanex.projects.model.Task;
import com.mazanex.projects.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Gestión de Tareas", description = "Endpoints para la ejecución y seguimiento de tareas en proyectos")
public class ProjectController {
    
    private final TaskService taskService;

    public ProjectController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/{projectId}/tasks")
    @Operation(summary = "Crear nueva tarea", description = "Crea una tarea asociada a un proyecto específico mediante Factory Pattern")
    public ResponseEntity<Task> addTask(@PathVariable Long projectId, @RequestBody Task taskDetails) {
        // Ahora pasamos el objeto completo al servicio
        Task createdTask = taskService.createTask(taskDetails, projectId);
        return ResponseEntity.ok(createdTask);
    }

    @GetMapping("/{projectId}/tasks")
    @Operation(summary = "Listar tareas del proyecto", description = "Obtiene todas las tareas asociadas a un proyecto")
    public ResponseEntity<List<Task>> listTasks(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return tasks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tasks);
    }
    @PutMapping("/{projectId}/tasks/{taskId}")
    @Operation(summary = "Editar tarea", description = "Actualiza el título o estado de una tarea existente")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskDetails));
    }

    @DeleteMapping("/{projectId}/tasks/{taskId}")
    @Operation(summary = "Borrar tarea", description = "Elimina una tarea del proyecto")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}