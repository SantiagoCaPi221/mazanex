package com.mazanex.ranking.dto;

public record ScoreRequestDto(
    Long userId,
    String playerName,
    String game,
    String mode,
    Integer highScore,
    String screenshotUrl
) {}