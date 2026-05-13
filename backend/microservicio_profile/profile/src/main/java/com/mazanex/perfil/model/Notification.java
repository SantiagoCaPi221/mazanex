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

    private String message;
    private String type; 
    private boolean isRead = false;
    private LocalDateTime date = LocalDateTime.now();

    public Notification(User targetUser, String type, String message) {
        this.targetUser = targetUser;
        this.type = type;
        this.message = message;
        this.isRead = false;
        this.date = LocalDateTime.now();
    }
}
