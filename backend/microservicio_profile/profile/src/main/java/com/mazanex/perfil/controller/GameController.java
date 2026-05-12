package com.mazanex.profile.controller;

import com.mazanex.profile.model.Score;
import com.mazanex.profile.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile/games")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Score>> getScoresByUser(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.getScoresByUserId(id));
    }

    @GetMapping("/ranking/{game}")
    public ResponseEntity<List<Score>> getRanking(@PathVariable String game) {
        return ResponseEntity.ok(gameService.getGameRanking(game));
    }

    @PostMapping("/save-record")
    public ResponseEntity<?> saveRecord(@RequestBody ScoreRequest req) {
        return ResponseEntity.ok(gameService.saveRecord(
            req.getUserId(), req.getGame(), req.getMode(), req.getHighScore(), req.getScreenshotUrl()
        ));
    }

    @PostMapping("/report/{id}")
    public ResponseEntity<Map<String, Object>> report(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.reportScore(id));
    }

    // DTO interno para recibir el JSON de guardado
    public static class ScoreRequest {
        private Long userId;
        private String game;
        private String mode;
        private Integer highScore;
        private String screenshotUrl;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getGame() { return game; }
        public void setGame(String game) { this.game = game; }
        public String getMode() { return mode; }
        public void setMode(String mode) { this.mode = mode; }
        public Integer getHighScore() { return highScore; }
        public void setHighScore(Integer highScore) { this.highScore = highScore; }
        public String getScreenshotUrl() { return screenshotUrl; }
        public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
    }
}