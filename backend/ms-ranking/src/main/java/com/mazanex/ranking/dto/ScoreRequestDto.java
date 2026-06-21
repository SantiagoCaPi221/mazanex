package com.mazanex.ranking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ScoreRequestDto(
    Long userId,
    
    @JsonProperty("player_name")
    String playerName,
    
    String game,
    String mode,
    Integer highScore,
    String screenshotUrl
) {}