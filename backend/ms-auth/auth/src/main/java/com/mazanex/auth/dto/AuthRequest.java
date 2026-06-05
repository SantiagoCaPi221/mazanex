package com.mazanex.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @NotBlank(message = "Debe indicar usuario o correo")
    private String usernameOrEmail;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    public AuthRequest() {}

    public String getUsernameOrEmail() { return usernameOrEmail; }
    public void setUsernameOrEmail(String usernameOrEmail) { this.usernameOrEmail = usernameOrEmail; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
