package com.mazanex.projects.dto;

public record ProjectRequestDto(
    String name,
    String description,
    String status
) {}