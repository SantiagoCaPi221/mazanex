package com.mazanex.ranking.service;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    public Object saveRecord(Long userId, String playerName, String game, String mode, Integer highScore, String screenshotUrl) {
        Optional<Score> existingScore = scoreRepository.findByUserIdAndGameAndMode(userId, game, mode);

        if (existingScore.isPresent()) {
            Score s = existingScore.get();
            if (highScore > s.getHighScore()) {
                s.setHighScore(highScore);
                s.setScreenshotUrl(screenshotUrl);
                s.setPlayerName(playerName);
                s.getReporters().clear(); 
                return scoreRepository.save(s);
            }
            return Map.of("status", "NO_RECORD");
        }

        Score newScore = new Score(userId, playerName, game, mode, highScore, screenshotUrl);
        return scoreRepository.save(newScore);
    }

    // LÓGICA PURA: Cero HTTP aquí.
    public Map<String, Object> reportScore(Long id, Long reporterId) {
        Score score = scoreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("NOT_FOUND"));

        boolean isNewReport = score.addReport(reporterId);
        
        // REGLA DE NEGOCIO: No se puede reportar dos veces
        if (!isNewReport) {
            // Detenemos el código y lanzamos una excepción
            throw new IllegalStateException("ALREADY_REPORTED");
        }
        
        Map<String, Object> response = new HashMap<>();
        
        // REGLA DE NEGOCIO: 3 strikes y se elimina
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