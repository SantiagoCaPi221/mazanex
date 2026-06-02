package com.mazanex.ranking.repository;

import com.mazanex.ranking.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    
    // Trae el ranking de un juego en específico, ordenado de mayor a menor puntaje
    List<Score> findByGameOrderByHighScoreDesc(String game);
    
    // Trae los puntajes de un usuario en específico (útil para su perfil)
    List<Score> findByUserIdOrderByHighScoreDesc(Long userId);
    
}