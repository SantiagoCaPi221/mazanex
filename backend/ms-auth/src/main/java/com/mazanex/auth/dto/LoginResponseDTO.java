package com.mazanex.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer";

    public LoginResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }
}