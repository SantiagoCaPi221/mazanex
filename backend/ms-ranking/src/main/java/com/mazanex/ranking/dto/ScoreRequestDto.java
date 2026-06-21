package com.mazanex.ranking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data 
public class ScoreRequestDto {
    private Long userId;
    
    @JsonProperty("player_name")
    private String playerName;
    
    private String game; 
    private String mode;
    private Integer highScore;
    private String screenshotUrl;
}