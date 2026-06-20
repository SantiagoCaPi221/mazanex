package com.mazanex.ranking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data // <-- ESTA ANOTACIÓN GENERA getGame()
public class ScoreRequestDto {
    private Long userId;
    
    @JsonProperty("player_name")
    private String playerName;
    
    private String game; // <-- El método se genera basado en este nombre
    private String mode;
    private Integer highScore;
    private String screenshotUrl;
}