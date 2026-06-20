package com.mazanex.projects.service;

import com.mazanex.projects.model.Task;
import com.mazanex.projects.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void shouldCreateTask() {
        Task task = new Task();
        task.setTitle("Test Task");
        
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        
        Task created = taskService.createTask("Test Task", 1L);
        
        assertNotNull(created);
    }
}