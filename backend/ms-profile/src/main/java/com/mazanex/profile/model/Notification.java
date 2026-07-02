package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor 
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User targetUser;

    // NUEVO: Campo necesario para saber quién originó la notificación
    private Long senderId;

    private String message;
    private String type; 
    private boolean isRead = false;
    private LocalDateTime date = LocalDateTime.now();

    // Constructor de 3 argumentos
    public Notification(User targetUser, String type, String message) {
        this.targetUser = targetUser;
        this.type = type;
        this.message = message;
        this.isRead = false;
        this.date = LocalDateTime.now();
    }

    // NUEVO: Constructor de 4 argumentos requerido por SocialService
    public Notification(User targetUser, String type, String message, Long senderId) {
        this.targetUser = targetUser;
        this.type = type;
        this.message = message;
        this.senderId = senderId;
        this.isRead = false;
        this.date = LocalDateTime.now();
    }
}
