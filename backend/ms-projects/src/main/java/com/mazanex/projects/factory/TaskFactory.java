package com.mazanex.projects.factory;

import com.mazanex.projects.model.Task;

/**
 * Fábrica encargada de crear tareas con valores por defecto para el flujo de proyectos.
 */
public class TaskFactory {
    public static Task createDefaultTask(String title, Long projectId) {
        Task task = new Task();
        task.setTitle(title);
        task.setProjectId(projectId);
        task.setStatus("TODO");
        return task;
    }
}