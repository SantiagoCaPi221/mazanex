package com.mazanex.ranking.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public record Score(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,

    @Column(name = "user_id", nullable = false)
    Long userId,

    @Column(name = "player_name", nullable = false)
    String playerName,

    String game,
    String mode,
    Integer highScore,
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String screenshotUrl,
    
    @JsonIgnore 
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "score_reports", joinColumns = @JoinColumn(name = "score_id"))
    @Column(name = "reporter_id")
    Set<Long> reporters,
    
    Boolean verified,
    LocalDateTime uploadDate
) {
    // Constructor compacto para manejar los valores por defecto y simular el @PrePersist
    public Score {
        if (reporters == null) reporters = new HashSet<>();
        if (verified == null) verified = false;
        if (uploadDate == null) uploadDate = LocalDateTime.now();
    }

    // Constructor de 6 argumentos requerido por tu lógica original
    public Score(Long userId, String playerName, String game, String mode, Integer highScore, String screenshotUrl) {
        this(null, userId, playerName, game, mode, highScore, screenshotUrl, new HashSet<>(), false, LocalDateTime.now());
    }

    // Métodos utilitarios de tu clase original
    public boolean addReport(Long userId) {
        return this.reporters.add(userId); 
    }

    public int getReportCount() {
        return this.reporters.size();
    }
}