package com.example.immobiler.dto;

public class PasswordResetForm {
    private String token;       // token envoyé par email
    private String newPassword; // nouveau mot de passe
    // getter & setter

    public PasswordResetForm(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
