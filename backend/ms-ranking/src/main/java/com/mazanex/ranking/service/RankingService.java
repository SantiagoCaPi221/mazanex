package com.mazanex.ranking.service;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

/**
 * Servicio de negocio para almacenar récords y gestionar reportes de puntuaciones.
 */
@Service
public class RankingService {

    @Autowired
    private ScoreRepository scoreRepository;

    /**
     * Recupera todas las puntuaciones registradas por un usuario.
     *
     * @param userId identificador del usuario
     * @return lista de scores del usuario
     */
    public List<Score> getScoresByUserId(Long userId) {
        return scoreRepository.findByUserId(userId);
    }

    /**
     * Obtiene el ranking de un juego ordenado por puntuación descendente.
     *
     * @param game nombre del juego
     * @return lista de puntuaciones ordenada
     */
    public List<Score> getGameRanking(String game) {
        return scoreRepository.findByGameOrderByHighScoreDesc(game);
    }

    /**
     * Guarda un nuevo récord o actualiza uno existente si la nueva puntuación es mayor.
     *
     * @param userId identificador del usuario
     * @param playerName nombre del jugador
     * @param game juego al que pertenece la puntuación
     * @param mode modo de juego
     * @param highScore puntuación conseguida
     * @param screenshotUrl URL de la captura asociada
     * @return récord guardado o resultado de no actualizar
     */
    public Object saveRecord(Long userId, String playerName, String game, String mode, Integer highScore, String screenshotUrl) {

            // Se eliminó la validación (if playerName == null)
            if (playerName == null || playerName.trim().isEmpty()) {
            throw new IllegalArgumentException("El playerName no puede ser nulo o vacío");
        }

            Optional<Score> existingScore = scoreRepository.findByUserIdAndGameAndMode(userId, game, mode);

            if (existingScore.isPresent()) {
                Score s = existingScore.get();
                if (highScore > s.getHighScore()) {
                    s.setHighScore(highScore);
                    s.setScreenshotUrl(screenshotUrl);
                    
                    // Si el nombre viene nulo, reemplazará el nombre anterior por null
                    s.setPlayerName(playerName); 
                    
                    s.getReporters().clear(); 
                    return scoreRepository.save(s);
                }
                return Map.of("status", "NO_RECORD");
            }

            // Se creará y guardará con playerName = null
            Score newScore = new Score(userId, playerName, game, mode, highScore, screenshotUrl);
            return scoreRepository.save(newScore);
        }

    // LÓGICA PURA: Cero HTTP aquí.
    /**
     * Reporta una puntuación como sospechosa y la elimina si supera los reportes permitidos.
     *
     * @param id identificador de la puntuación
     * @param reporterId identificador del usuario que reporta
     * @return mapa con el estado del reporte
     */
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