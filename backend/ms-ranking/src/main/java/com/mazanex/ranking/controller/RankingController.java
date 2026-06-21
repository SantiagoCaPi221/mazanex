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

@RestController
@RequestMapping("/api/ranking")
@Tag(name = "1. Ranking y Puntuaciones", description = "Endpoints para gestionar las tablas de clasificación, récords y reportes de los juegos")
public class RankingController {

    private static final Logger log = LoggerFactory.getLogger(RankingController.class);

    @Autowired
    private RankingService rankingService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Obtener récords de un usuario")
    public ResponseEntity<List<Score>> getScoresByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(rankingService.getScoresByUserId(userId));
    }

    @GetMapping("/{game}")
    @Operation(summary = "Obtener ranking global por juego")
    public ResponseEntity<List<Score>> getRanking(@PathVariable String game) {
        return ResponseEntity.ok(rankingService.getGameRanking(game));
    }

    @PostMapping("/save-record")
    @Operation(summary = "Guardar nuevo récord")
    public ResponseEntity<?> saveRecord(@RequestBody ScoreRequestDto req) {
        log.info("DEBUG: Objeto recibido: {}", req);

        // Adaptado para usar los métodos de acceso nativos del Record
        return ResponseEntity.ok(rankingService.saveRecord(
            req.userId(), 
            req.playerName(), 
            req.game(), 
            req.mode(), 
            req.highScore(), 
            req.screenshotUrl()
        ));
    }

    @PostMapping("/report/{id}")
    @Operation(summary = "Reportar puntuación sospechosa")
    public ResponseEntity<?> report(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(rankingService.reportScore(id, body.get("reporterId")));
    }
}