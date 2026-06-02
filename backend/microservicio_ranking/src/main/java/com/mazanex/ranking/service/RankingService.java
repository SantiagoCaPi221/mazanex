package com.mazanex.ranking.service;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RankingService {

    @Autowired
    private ScoreRepository scoreRepository;

    public List<Score> getRankingByGame(String game) {
        return scoreRepository.findByGameOrderByHighScoreDesc(game);
    }

    public List<Score> getScoresByUser(Long userId) {
        return scoreRepository.findByUserIdOrderByHighScoreDesc(userId);
    }

    public Score saveScore(Score score) {
        return scoreRepository.save(score);
    }

    public Map<String, Object> reportScore(Long scoreId, Long reporterId) {
        Map<String, Object> response = new HashMap<>();

        // 1. Buscar el récord
        Score score = scoreRepository.findById(scoreId).orElse(null);
        if (score == null) {
            response.put("error", "SCORE_NOT_FOUND");
            return response;
        }

        // 2. Intentar agregar el reporte usando TU método
        boolean isNewReport = score.addReport(reporterId);
        
        if (!isNewReport) {
            response.put("error", "ALREADY_REPORTED");
            return response;
        }

        // 3. Revisar si alcanzó los 3 reportes
        if (score.getReportCount() >= 3) {
            scoreRepository.delete(score); // ¡Se borra de la BD!
            response.put("status", "DELETED");
        } else {
            scoreRepository.save(score); // Guardamos el nuevo set de reportes
            response.put("status", "REPORTED");
            response.put("count", score.getReportCount());
        }

        return response;
    }
}