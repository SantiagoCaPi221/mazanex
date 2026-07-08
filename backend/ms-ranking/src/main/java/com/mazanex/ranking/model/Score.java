package com.mazanex.ranking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa una puntuación registrada por un usuario en un juego.
 */
@Entity
@Table(name = "scores")
@Data
@NoArgsConstructor
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // MICROSERVICIO: Guardamos referencias directas en lugar de la clase User
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "player_name", nullable = false)
    private String playerName;

    private String game;
    private String mode;
    private Integer highScore;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String screenshotUrl;
    
    @JsonIgnore 
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "score_reports", joinColumns = @JoinColumn(name = "score_id"))
    @Column(name = "reporter_id")
    private Set<Long> reporters = new HashSet<>();
    
    private Boolean verified = false;
    private LocalDateTime uploadDate;

    @PrePersist
    protected void onCreate() { this.uploadDate = LocalDateTime.now(); }

    public Score(Long userId, String playerName, String game, String mode, Integer highScore, String screenshotUrl) {
        this.userId = userId;
        this.playerName = playerName;
        this.game = game;
        this.mode = mode;
        this.highScore = highScore;
        this.screenshotUrl = screenshotUrl;
    }

    public boolean addReport(Long userId) {
        return this.reporters.add(userId); 
    }

    public int getReportCount() {
        return this.reporters.size();
    }
}