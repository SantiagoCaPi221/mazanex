package com.mazanex.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserResponseDto(
    @Schema(description = "ID del usuario", example = "1")
    Long id,
    
    @Schema(description = "Nombre del usuario", example = "John Doe")
    String name,
    
    @Schema(description = "Email del usuario", example = "user@mail.cl")
    String email,
    
    // ⚠️ ELIMINADO: String password. 
    // NUNCA devuelvas contraseñas (ni siquiera encriptadas) en el Response DTO.
    
    @Schema(description = "Rol del usuario", example = "USER")
    String role,
    
    @Schema(description = "URL del avatar del usuario", example = "http://example.com/avatar.jpg")
    String avatarUrl,
    
    @Schema(description = "URL del banner del usuario", example = "http://example.com/banner.jpg")
    String bannerUrl,
    
    @Schema(description = "Biografía del usuario", example = "Soy un apasionado de la tecnología.")
    String bio,
    
    @Schema(description = "URL del fondo del usuario", example = "http://example.com/background.jpg")
    String backgroundUrl
) {}