package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String game;
    private String mode;
    private Integer highScore;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String screenshotUrl;
    
    @JsonIgnore // Oculta quién reportó cuando se envía el JSON al frontend
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "score_reports", joinColumns = @JoinColumn(name = "score_id"))
    @Column(name = "reporter_id")
    private Set<Long> reporters = new HashSet<>();
    
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

    // Método seguro para intentar agregar un reporte
    public boolean addReport(Long userId) {
        // Retorna false si el userId ya existía en el Set
        return this.reporters.add(userId); 
    }

    // Método para obtener el total de reportes únicos
    public int getReportCount() {
        return this.reporters.size();
    }
}
