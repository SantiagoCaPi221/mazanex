package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "scores")
@Data
@NoArgsConstructor
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String game;
    private String mode;
    private Integer highScore;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String screenshotUrl;
    
    private Integer reports = 0;
    private Boolean verified = false;
    private LocalDateTime uploadDate;

    @PrePersist
    protected void onCreate() { this.uploadDate = LocalDateTime.now(); }

    public Score(User user, String game, String mode, Integer highScore, String screenshotUrl) {
        this.user = user;
        this.game = game;
        this.mode = mode;
        this.highScore = highScore;
        this.screenshotUrl = screenshotUrl;
    }
}