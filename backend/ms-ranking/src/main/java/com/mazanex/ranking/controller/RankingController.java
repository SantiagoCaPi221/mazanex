package com.mazanex.ranking.controller;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.service.RankingService;
import com.mazanex.ranking.dto.ScoreRequestDto; 
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestionar puntuaciones, rankings y reportes de partidas.
 */
@RestController
@RequestMapping("/api/ranking")
@Tag(name = "1. Ranking y Puntuaciones", description = "Endpoints para gestionar las tablas de clasificación, récords y reportes de los juegos")
public class RankingController {

    private static final Logger log = LoggerFactory.getLogger(RankingController.class);

    @Autowired
    private RankingService rankingService;

    /**
     * Obtiene los récords asociados a un usuario concreto.
     *
     * @param userId identificador del usuario
     * @return listado de puntuaciones del usuario
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Obtener récords de un usuario")
    public ResponseEntity<List<Score>> getScoresByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(rankingService.getScoresByUserId(userId));
    }

    /**
     * Obtiene el ranking global para un juego concreto.
     *
     * @param game nombre del juego
     * @return listado ordenado de puntuaciones del juego
     */
    @GetMapping("/{game}")
    @Operation(summary = "Obtener ranking global por juego")
    public ResponseEntity<List<Score>> getRanking(@PathVariable String game) {
        return ResponseEntity.ok(rankingService.getGameRanking(game));
    }

    /**
     * Guarda o actualiza un récord de un usuario para un juego y modo específicos.
     *
     * @param req datos del nuevo récord
     * @return resultado de la operación
     */
    @PostMapping("/save-record")
@Operation(summary = "Guardar nuevo récord")
public ResponseEntity<?> saveRecord(@RequestBody ScoreRequestDto req) {
    log.info("DEBUG: Objeto recibido: {}", req);

    return ResponseEntity.ok(rankingService.saveRecord(
        req.userId(),          // Acceso al record
        req.playerName(),      // Acceso al record
        req.game(),            // Acceso al record
        req.mode(),            // Acceso al record
        req.highScore(),       // Acceso al record
        req.screenshotUrl()    // Acceso al record
    ));
}

    /**
     * Reporta una puntuación como sospechosa para revisión.
     *
     * @param id identificador de la puntuación
     * @param body cuerpo con el identificador del reportador
     * @return resultado del reporte
     */
    @PostMapping("/report/{id}")
    @Operation(summary = "Reportar puntuación sospechosa")
    public ResponseEntity<?> report(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(rankingService.reportScore(id, body.get("reporterId")));
    }
}