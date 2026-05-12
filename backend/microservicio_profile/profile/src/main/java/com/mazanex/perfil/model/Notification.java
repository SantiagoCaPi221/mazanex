package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User targetUser;

    private String message;
    private String type; 
    private Long senderId; 
    private boolean isRead = false;
    private LocalDateTime date = LocalDateTime.now();

    public Notification(User targetUser, String type, String message, Long senderId) {
        this.targetUser = targetUser;
        this.type = type;
        this.message = message;
        this.senderId = senderId;
    }
}