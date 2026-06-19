package com.mazanex.ranking.controller;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.service.RankingService;
import com.mazanex.ranking.dto.ScoreRequestDto; 
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid; // <-- IMPORTANTE
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ranking")
@Tag(name = "1. Ranking y Puntuaciones", description = "Endpoints para gestionar las tablas de clasificación, récords y reportes de los juegos")
public class RankingController {

    @Autowired
    private RankingService rankingService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Obtener récords de un usuario")
    public ResponseEntity<List<Score>> getScoresByUser(
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        return ResponseEntity.ok(rankingService.getScoresByUserId(userId));
    }

    @GetMapping("/{game}")
    @Operation(summary = "Obtener ranking global por juego")
    public ResponseEntity<List<Score>> getRanking(
            @Parameter(description = "Nombre o identificador del juego") @PathVariable String game) {
        return ResponseEntity.ok(rankingService.getGameRanking(game));
    }

    @PostMapping("/save-record")
    @Operation(summary = "Guardar nuevo récord")
    // Se agregó @Valid aquí para validar el DTO antes de pasarlo al servicio
    public ResponseEntity<?> saveRecord(@Valid @RequestBody ScoreRequestDto req) {
        return ResponseEntity.ok(rankingService.saveRecord(
            req.getUserId(), 
            req.getPlayerName(), 
            req.getGame(), 
            req.getMode(), 
            req.getHighScore(), 
            req.getScreenshotUrl()
        ));
    }

    @PostMapping("/report/{id}")
    @Operation(summary = "Reportar puntuación sospechosa")
    public ResponseEntity<?> report(
            @Parameter(description = "ID del récord a reportar") @PathVariable Long id, 
            @RequestBody Map<String, Long> body) {
        try {
            return ResponseEntity.ok(rankingService.reportScore(id, body.get("reporterId")));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}