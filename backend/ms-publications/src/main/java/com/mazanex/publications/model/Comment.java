package com.mazanex.publications.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Borra el Long publicationId y pon esto:

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publication_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference // 👈 ¡ESTO EVITA EL LOOP INFINITO EN EL JSON!
    private Publication publication;

    @Column(nullable = false)
    private Long authorId;

    @Column(nullable = false)
    private String authorName;

    private String authorAvatarUrl;

    @Column(nullable = false, length = 1000)
    private String content;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }
}