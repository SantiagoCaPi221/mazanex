<<<<<<<< HEAD:backend/ms-auth/auth/src/main/java/com/mazanex/auth/dto/PasswordUpdateDTO.java
package com.mazanex.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

========
package com.mazanex.auth.dto; 
>>>>>>>> eaa8509f8b3f85c062d83367511221f2b791106a:backend/ms-auth/src/main/java/com/mazanex/auth/dto/PasswordUpdateDTO.java
public class PasswordUpdateDTO {
    @NotBlank(message = "La contraseña actual es obligatoria")
    private String currentPassword;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 6, message = "La nueva contraseña debe tener al menos 6 caracteres")
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