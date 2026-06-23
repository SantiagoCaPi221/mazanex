package com.mazanex.projects.dto;

public record TaskRequestDto(
    String title,
    String assignee,
    String status
) {}