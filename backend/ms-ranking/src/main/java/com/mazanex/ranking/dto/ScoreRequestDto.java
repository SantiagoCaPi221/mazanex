package com.mazanex.ranking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data 
public class ScoreRequestDto {

    @NotNull(message = "El user_id es obligatorio")
    @JsonProperty("user_id")
    private Long userId;

    @NotBlank(message = "El player_name no puede estar vacío")
    @JsonProperty("player_name") 
    private String playerName;

    @NotBlank(message = "El juego es obligatorio")
    private String game;

    @NotBlank(message = "El modo de juego es obligatorio")
    private String mode;

    @NotNull(message = "El highScore es obligatorio")
    @JsonProperty("high_score")
    private Integer highScore;

    @JsonProperty("screenshot_url")
    private String screenshotUrl;
}