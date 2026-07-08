package com.mazanex.ranking.dto;

/**
 * DTO utilizado para recibir un nuevo récord de puntuación desde el cliente.
 */
public record ScoreRequestDto(
    Long userId,
    String playerName,
    String game,
    String mode,
    Integer highScore,
    String screenshotUrl
) {}