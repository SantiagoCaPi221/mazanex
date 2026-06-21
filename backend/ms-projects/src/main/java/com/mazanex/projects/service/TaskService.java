package com.mazanex.projects.service;

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

    public Task createTask(String title, Long projectId) {
        // Uso del Factory Pattern para cumplir con el requerimiento del caso semestral
        Task newTask = TaskFactory.createDefaultTask(title, projectId);
        return taskRepository.save(newTask);
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    public Task updateTask(Long taskId, Task taskDetails) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        task.setTitle(taskDetails.getTitle());
        task.setStatus(taskDetails.getStatus());
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}