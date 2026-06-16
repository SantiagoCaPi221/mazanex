package com.mazanex.profile.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

public record Follower(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,

    @ManyToOne
    @JoinColumn(name = "follower_id")
    User follower,

    @ManyToOne
    @JoinColumn(name = "followed_id")
    User followed,

    LocalDateTime createdAt
) {
    // Constructor compacto para asegurar que 'createdAt' nunca sea nulo
    public Follower {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Constructor de 2 argumentos para mantener la compatibilidad con tu código actual
    public Follower(User follower, User followed) {
        this(null, follower, followed, LocalDateTime.now());
    }
}