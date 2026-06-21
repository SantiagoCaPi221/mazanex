package com.mazanex.projects.service;

import com.mazanex.projects.model.Task;
import com.mazanex.projects.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void createTask_ShouldSaveAndReturnTask() {
        // Arrange
        Long projectId = 100L;
        
        // Creamos el objeto que ahora espera recibir el método
        Task inputTask = new Task();
        inputTask.setTitle("Integrar API K8s");
        inputTask.setAssignee("Santiago");
        
        Task mockTask = new Task();
        mockTask.setTitle("Integrar API K8s");
        mockTask.setAssignee("Santiago");
        mockTask.setProjectId(projectId);

        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);

        // Act - Le pasamos el objeto inputTask en lugar del String
        Task result = taskService.createTask(inputTask, projectId);

        // Assert
        assertNotNull(result);
        assertEquals("Integrar API K8s", result.getTitle());
        assertEquals("Santiago", result.getAssignee());
        assertEquals(100L, result.getProjectId());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void getTasksByProject_ShouldReturnList() {
        // Arrange
        when(taskRepository.findByProjectId(100L)).thenReturn(List.of(new Task(), new Task()));

        // Act
        List<Task> result = taskService.getTasksByProject(100L);

        // Assert
        assertEquals(2, result.size());
        verify(taskRepository).findByProjectId(100L);
    }

    @Test
    void updateTask_ShouldUpdateAndSave_WhenTaskExists() {
        // Arrange
        Task existingTask = new Task();
        existingTask.setId(1L);
        existingTask.setTitle("Diseño inicial");
        existingTask.setStatus("PENDING");

        Task newDetails = new Task();
        newDetails.setTitle("Diseño Finalizado");
        newDetails.setStatus("COMPLETED");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(existingTask);

        // Act
        Task result = taskService.updateTask(1L, newDetails);

        // Assert
        assertEquals("Diseño Finalizado", result.getTitle());
        assertEquals("COMPLETED", result.getStatus());
        verify(taskRepository).save(existingTask);
    }

    @Test
    void updateTask_ShouldThrowException_WhenTaskNotFound() {
        // Arrange
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());
        Task newDetails = new Task();

        // Act & Assert
        // Validamos que se lance tu RuntimeException y no se guarde nada
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> taskService.updateTask(99L, newDetails));

        assertEquals("Tarea no encontrada", exception.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void deleteTask_ShouldCallRepository() {
        // Act
        taskService.deleteTask(1L);

        // Assert
        verify(taskRepository).deleteById(1L);
    }
}