package com.mazanex.auth.dto;

import com.mazanex.auth.model.User;

public record AuthResponse(String token, String tokenType, User user) {
    public AuthResponse(String token, User user) {
        this(token, "Bearer", user);
    }
}