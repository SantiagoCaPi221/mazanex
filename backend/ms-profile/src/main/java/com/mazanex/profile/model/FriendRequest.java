package com.mazanex.profile.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

public record Notification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,

    @ManyToOne
    User targetUser,

    Long senderId,
    String message,
    String type,
    boolean isRead,
    LocalDateTime date
) {
    // Constructor compacto para manejar los valores por defecto
    public Notification {
        if (date == null) {
            date = LocalDateTime.now();
        }
    }

    // Constructor de 3 argumentos requerido por tu lógica
    public Notification(User targetUser, String type, String message) {
        this(null, targetUser, null, message, type, false, LocalDateTime.now());
    }

    // Constructor de 4 argumentos requerido por SocialService
    public Notification(User targetUser, String type, String message, Long senderId) {
        this(null, targetUser, senderId, message, type, false, LocalDateTime.now());
    }
}