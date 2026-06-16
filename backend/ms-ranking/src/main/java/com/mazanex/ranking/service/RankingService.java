package com.mazanex.ranking.service;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;
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
            
            // CORREGIDO: Cambiado de s.getHighScore() a s.highScore()
            if (highScore > s.highScore()) {
                
                // CORREGIDO: Como no hay setters, creamos un nuevo Record clonando los datos
                // pasándole las variables actualizadas y un nuevo HashSet vacío para limpiar los reportes.
                Score updatedScore = new Score(
                    s.id(),
                    s.userId(),
                    playerName,       // Nuevo player name
                    s.game(),
                    s.mode(),
                    highScore,        // Nuevo record
                    screenshotUrl,    // Nueva foto
                    new HashSet<>(),  // Reemplaza el s.getReporters().clear()
                    s.verified(),
                    s.uploadDate()
                );
                
                return scoreRepository.save(updatedScore);
            }
            return Map.of("status", "NO_RECORD");
        }

        // El constructor de 6 argumentos que le creamos al record sigue funcionando impecable aquí
        Score newScore = new Score(userId, playerName, game, mode, highScore, screenshotUrl);
        return scoreRepository.save(newScore);
    }

    public Map<String, Object> reportScore(Long id, Long reporterId) {
        Score score = scoreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("NOT_FOUND"));

        // Esto funciona porque aunque el record es de solo lectura, 
        // el Set interno permite que le agregues elementos con el método que creamos.
        boolean isNewReport = score.addReport(reporterId);
        
        if (!isNewReport) {
            throw new IllegalStateException("ALREADY_REPORTED");
        }
        
        Map<String, Object> response = new HashMap<>();
        
        // CORREGIDO: score.getReportCount() funciona porque es el método manual del record
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