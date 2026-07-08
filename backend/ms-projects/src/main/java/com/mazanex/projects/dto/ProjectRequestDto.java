package com.mazanex.projects.dto;

/**
 * DTO usado para recibir los datos necesarios para crear o actualizar un proyecto.
 */
public record ProjectRequestDto(
    String name,
    String description,
    String status
) {}