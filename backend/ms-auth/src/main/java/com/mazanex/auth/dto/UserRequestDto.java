package com.mazanex.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO utilizado para recibir las credenciales de acceso del usuario.
 */
public record UserRequestDto(
    @Schema(description = "Email o nombre de usuario para login", example = "user@mail.cl")
    String email,
    @Schema(description = "Contraseña del usuario", example = "password123")
    String password
) {

}
