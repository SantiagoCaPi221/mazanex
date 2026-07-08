package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidad que representa la relación de seguimiento entre dos usuarios.
 */
@Entity
@Table(name = "followers")
@Data
@NoArgsConstructor
public class Follower {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower;

    @ManyToOne
    @JoinColumn(name = "followed_id")
    private User followed;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Follower(User follower, User followed) {
        this.follower = follower;
        this.followed = followed;
    }
}