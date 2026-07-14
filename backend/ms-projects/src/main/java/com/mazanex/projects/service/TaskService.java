package com.mazanex.projects.service;

import com.mazanex.projects.dto.TaskRequestDto; // <-- No olvides este import
import com.mazanex.projects.factory.TaskFactory;
import com.mazanex.projects.model.Task;
import com.mazanex.projects.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Servicio encargado de crear, listar, actualizar y eliminar tareas de proyectos.
 */
@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Cambiamos 'Task' por 'TaskRequestDto'
    /**
     * Crea una nueva tarea a partir de un DTO y la asocia a un proyecto.
     *
     * @param taskDetails datos de entrada de la tarea
     * @param projectId identificador del proyecto
     * @return tarea creada y persistida
     */
    public Task createTask(TaskRequestDto taskDetails, Long projectId) {
        // Usamos taskDetails.title() en lugar de taskDetails.getTitle()
        Task newTask = TaskFactory.createDefaultTask(taskDetails.title(), projectId);
        
        // Usamos taskDetails.assignee() en lugar de taskDetails.getAssignee()
        newTask.setAssignee(taskDetails.assignee());
        
        return taskRepository.save(newTask);
    }

    /**
     * Recupera todas las tareas asociadas a un proyecto concreto.
     *
     * @param projectId identificador del proyecto
     * @return lista de tareas del proyecto
     */
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    // Cambiamos 'Task' por 'TaskRequestDto'
    /**
     * Actualiza los datos de una tarea existente.
     *
     * @param taskId identificador de la tarea
     * @param taskDetails nuevos valores para la tarea
     * @return tarea actualizada
     */
    public Task updateTask(Long taskId, TaskRequestDto taskDetails) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
            
        // Usamos los métodos del record
        task.setTitle(taskDetails.title());
        task.setStatus(taskDetails.status());
        
        return taskRepository.save(task);
    }

    /**
     * Elimina una tarea por su identificador.
     *
     * @param taskId identificador de la tarea
     */
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}