package com.mazanex.ranking.controller;

import com.mazanex.ranking.model.Score;
import com.mazanex.ranking.service.RankingService;
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

    // Endpoint: GET /api/ranking/SNAKE
    @GetMapping("/{game}")
    public ResponseEntity<List<Score>> getRanking(@PathVariable String game) {
        return ResponseEntity.ok(rankingService.getRankingByGame(game));
    }

    // Endpoint: GET /api/ranking/user/1
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Score>> getUserScores(@PathVariable Long userId) {
        return ResponseEntity.ok(rankingService.getScoresByUser(userId));
    }

    // Endpoint: POST /api/ranking
    @PostMapping
    public ResponseEntity<Score> submitScore(@RequestBody Score score) {
        return ResponseEntity.ok(rankingService.saveScore(score));
    }

    // Endpoint: POST /api/ranking/5/report?reporterId=10
    @PostMapping("/{scoreId}/report")
    public ResponseEntity<Map<String, Object>> reportScore(
            @PathVariable Long scoreId,
            @RequestParam Long reporterId) {
        return ResponseEntity.ok(rankingService.reportScore(scoreId, reporterId));
    }
}