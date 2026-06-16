package com.mazanex.publications.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

public record Comment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,

    @Column(name = "publication_id", insertable = false, updatable = false)
    Long publicationId,

    @Column(nullable = false)
    Long authorId,

    @Column(nullable = false)
    String authorName,

    String authorAvatarUrl,

    @Column(nullable = false, length = 1000)
    String content,

    LocalDateTime createdAt
) {
    // Reemplazo de @PrePersist: si la fecha viene nula, se asigna la actual al instanciar
    public Comment {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}