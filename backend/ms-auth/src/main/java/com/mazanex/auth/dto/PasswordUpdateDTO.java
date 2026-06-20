package com.mazanex.auth.dto; 

public record PasswordUpdateDTO(
    String currentPassword,
    String newPassword
) {}