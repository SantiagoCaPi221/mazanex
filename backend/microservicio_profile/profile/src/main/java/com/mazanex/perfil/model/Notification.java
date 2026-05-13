package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor // <--- Esto es lo que "realmente funciona" para Hibernate
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "target_user_id") // Asegura el nombre de la columna en la DB
    private User targetUser;

    private String message;
    private String type; 
    private Long senderId; 
    
    private boolean isRead = false;
    private LocalDateTime date = LocalDateTime.now();

    // Constructor que usamos en el SocialService
    public Notification(User targetUser, String type, String message, Long senderId) {
        this.targetUser = targetUser;
        this.type = type;
        this.message = message;
        this.senderId = senderId;
        this.isRead = false;
        this.date = LocalDateTime.now();
    }
}
