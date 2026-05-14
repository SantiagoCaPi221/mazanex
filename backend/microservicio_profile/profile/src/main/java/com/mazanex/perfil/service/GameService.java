package com.mazanex.profile.service;

import com.mazanex.profile.model.Score;
import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.ScoreRepository;
import com.mazanex.profile.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private UserRepository userRepository;

    // Obtener los puntajes de un usuario específico (Muro de evidencias)
    public List<Score> getScoresByUserId(Long userId) {
        User user = new User();
        user.setId(userId);
        return scoreRepository.findByUser(user);
    }

    // Obtener el ranking global de un juego (Ordenado por puntaje de mayor a menor)
    public List<Score> getGameRanking(String game) {
        return scoreRepository.findByGameOrderByHighScoreDesc(game);
    }

    // Lógica para guardar un récord (Solo si es mayor al actual)
    public Object saveRecord(Long userId, String game, String mode, Integer highScore, String screenshotUrl) {
        User userRef = new User();
        userRef.setId(userId);

        Optional<Score> existingScore = scoreRepository.findByUserAndGameAndMode(userRef, game, mode);

        if (existingScore.isPresent()) {
            Score s = existingScore.get();
            // LÓGICA: Solo actualizamos si el nuevo puntaje es mayor
            if (highScore > s.getHighScore()) {
                s.setHighScore(highScore);
                s.setScreenshotUrl(screenshotUrl);
                s.getReporters().clear(); // <-- IMPORTANTE: Limpiamos la lista de reportes si hay un nuevo récord
                return scoreRepository.save(s);
            }
            // Devolvemos un mensaje para que el frontend sepa que no hubo récord
            Map<String, String> noRecord = new HashMap<>();
            noRecord.put("status", "NO_RECORD");
            return noRecord;
        }

        // Si no existe un récord previo para ese juego/modo, creamos uno nuevo
        Score newScore = new Score(userRef, game, mode, highScore, screenshotUrl);
        return scoreRepository.save(newScore);
    }

    // Lógica de reportes BLINDADA (recibe el ID de quien reporta)
    public Map<String, Object> reportScore(Long id, Long reporterId) {
        Map<String, Object> response = new HashMap<>();
        
        return scoreRepository.findById(id).map(score -> {
            // 1. Intentamos agregar el reporte (devuelve false si el ID ya existía)
            boolean isNewReport = score.addReport(reporterId);
            
            // 2. Si no es nuevo, bloqueamos el proceso
            if (!isNewReport) {
                response.put("error", "ALREADY_REPORTED");
                return response;
            }
            
            // 3. Verificamos la cantidad total de reportes únicos
            if (score.getReportCount() >= 3) {
                scoreRepository.delete(score);
                response.put("status", "DELETED");
            } else {
                scoreRepository.save(score);
                response.put("status", "REPORTED");
                response.put("count", score.getReportCount());
            }
            return response;
        }).orElseGet(() -> {
            response.put("status", "NOT_FOUND");
            return response;
        });
    }
}
