package com.mazanex.projects.dto;

/**
 * DTO usado para recibir los datos necesarios para crear o actualizar una tarea.
 */
public record TaskRequestDto(
    String title,
    String assignee,
    String status
) {}