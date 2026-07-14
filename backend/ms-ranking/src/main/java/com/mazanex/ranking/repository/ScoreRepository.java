package com.mazanex.ranking.repository;

import com.mazanex.ranking.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para consultar y persistir puntuaciones de ranking.
 */
@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    // Cambiamos findByUser por findByUserId
    List<Score> findByUserId(Long userId);
    
    // Cambiamos findByUserAndGameAndMode por findByUserIdAndGameAndMode
    Optional<Score> findByUserIdAndGameAndMode(Long userId, String game, String mode);
    
    List<Score> findByGameOrderByHighScoreDesc(String game);
}