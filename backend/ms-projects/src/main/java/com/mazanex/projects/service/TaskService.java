package com.mazanex.projects.service;

import com.mazanex.projects.dto.TaskRequestDto; // <-- No olvides este import
import com.mazanex.projects.factory.TaskFactory;
import com.mazanex.projects.model.Task;
import com.mazanex.projects.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Cambiamos 'Task' por 'TaskRequestDto'
    public Task createTask(TaskRequestDto taskDetails, Long projectId) {
        // Usamos taskDetails.title() en lugar de taskDetails.getTitle()
        Task newTask = TaskFactory.createDefaultTask(taskDetails.title(), projectId);
        
        // Usamos taskDetails.assignee() en lugar de taskDetails.getAssignee()
        newTask.setAssignee(taskDetails.assignee());
        
        return taskRepository.save(newTask);
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    // Cambiamos 'Task' por 'TaskRequestDto'
    public Task updateTask(Long taskId, TaskRequestDto taskDetails) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
            
        // Usamos los métodos del record
        task.setTitle(taskDetails.title());
        task.setStatus(taskDetails.status());
        
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}