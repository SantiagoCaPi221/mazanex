package com.mazanex.ranking.dto;

import lombok.Data;

@Data 
public class ScoreRequestDto {
    private Long userId;
    private String playerName;
    private String game;
    private String mode;
    private Integer highScore;
    private String screenshotUrl;
}