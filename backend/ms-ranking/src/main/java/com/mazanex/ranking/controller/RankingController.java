package com.mazanex.ranking.controller;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.service.RankingService;
import com.mazanex.ranking.dto.ScoreRequestDto; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    @Autowired
    private RankingService rankingService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Score>> getScoresByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(rankingService.getScoresByUserId(userId));
    }

    @GetMapping("/{game}")
    public ResponseEntity<List<Score>> getRanking(@PathVariable String game) {
        return ResponseEntity.ok(rankingService.getGameRanking(game));
    }

    @PostMapping("/save-record")
    public ResponseEntity<?> saveRecord(@RequestBody ScoreRequestDto req) {
        return ResponseEntity.ok(rankingService.saveRecord(
            req.getUserId(), req.getPlayerName(), req.getGame(), 
            req.getMode(), req.getHighScore(), req.getScreenshotUrl()
        ));
    }

    @PostMapping("/report/{id}")
    public ResponseEntity<?> report(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        try {
            return ResponseEntity.ok(rankingService.reportScore(id, body.get("reporterId")));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}