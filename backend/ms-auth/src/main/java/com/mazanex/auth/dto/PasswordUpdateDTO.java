package com.mazanex.auth.dto; 

/**
 * DTO utilizado para solicitar el cambio de contraseña de un usuario.
 */
public class PasswordUpdateDTO {
    private String currentPassword;
    private String newPassword;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}