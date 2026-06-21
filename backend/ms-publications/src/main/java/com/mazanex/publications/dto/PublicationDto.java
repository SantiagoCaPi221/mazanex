package com.mazanex.publications.dto;

public record PublicationDto(
    Long authorId,
    String authorName,
    String authorAvatarUrl,
    String content,
    String mediaUrl
) {}