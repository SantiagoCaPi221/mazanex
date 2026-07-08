package com.mazanex.projects.repository;

import com.mazanex.projects.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repositorio para acceder a las tareas persistidas por proyecto.
 */
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
}