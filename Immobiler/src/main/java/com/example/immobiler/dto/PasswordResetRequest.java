package com.example.immobiler.dto;

public class PasswordResetRequest {
    private String email; // utilisateur qui a oublié son mot de passe

    public PasswordResetRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

