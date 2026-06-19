package com.mazanex.ranking.service;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
public class RankingService {

    @Autowired
    private ScoreRepository scoreRepository;

    public List<Score> getScoresByUserId(Long userId) {
        return scoreRepository.findByUserId(userId);
    }

    public List<Score> getGameRanking(String game) {
        return scoreRepository.findByGameOrderByHighScoreDesc(game);
    }

    @Transactional // Agregamos transaccionalidad para asegurar consistencia
    public Object saveRecord(Long userId, String playerName, String game, String mode, Integer highScore, String screenshotUrl) {
        Optional<Score> existingScore = scoreRepository.findByUserIdAndGameAndMode(userId, game, mode);

        if (existingScore.isPresent()) {
            Score s = existingScore.get();
            
            // SOLUCIÓN CLAVE: Parchamos de inmediato el playerName si venía nulo en la BD 
            // por culpa de las pruebas viejas. Así evitamos que Hibernate llore al salir del método.
            if (s.getPlayerName() == null || !s.getPlayerName().equals(playerName)) {
                s.setPlayerName(playerName);
            }

            if (highScore > s.getHighScore()) {
                s.setHighScore(highScore);
                s.setScreenshotUrl(screenshotUrl);
                s.getReporters().clear(); 
                return scoreRepository.save(s);
            }
            
            // Si no superó el récord, guardamos igual para persistir el parche del playerName
            scoreRepository.save(s); 
            return Map.of("status", "NO_RECORD");
        }

        // Si es completamente nuevo, se crea limpio
        Score newScore = new Score(userId, playerName, game, mode, highScore, screenshotUrl);
        return scoreRepository.save(newScore);
    }

    @Transactional
    public Map<String, Object> reportScore(Long id, Long reporterId) {
        Score score = scoreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("NOT_FOUND"));

        boolean isNewReport = score.addReport(reporterId);
        
        if (!isNewReport) {
            throw new IllegalStateException("ALREADY_REPORTED");
        }
        
        Map<String, Object> response = new HashMap<>();
        
        if (score.getReportCount() >= 3) {
            scoreRepository.delete(score);
            response.put("status", "DELETED");
        } else {
            scoreRepository.save(score);
            response.put("status", "REPORTED");
            response.put("count", score.getReportCount());
        }
        
        return response;
    }
}