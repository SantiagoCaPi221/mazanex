package com.mazanex.ranking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "scores")
@Data
@NoArgsConstructor
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Validación para que no te pasen un ID nulo
    @NotNull(message = "El user_id es obligatorio")
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // LA SOLUCIÓN: @JsonProperty lee "player_name" del JSON y @NotBlank ataja el nulo
    @JsonProperty("player_name")
    @NotBlank(message = "El player_name no puede estar vacío")
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