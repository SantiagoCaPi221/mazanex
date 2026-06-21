package com.mazanex.publications.dto;

public record CommentDto(
    Long authorId,
    String authorName,
    String authorAvatarUrl,
    String content
) {}