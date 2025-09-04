package com.example.immobiler.dto;

import com.example.immobiler.entity.Agence;
import com.example.immobiler.entity.Utilisateur;

// DTO qui contient agence + user
public class AgenceRegisterRequest {
    private Agence agence;
    private Utilisateur user;

    // getters et setters

    public AgenceRegisterRequest(Agence agence, Utilisateur user) {
        this.agence = agence;
        this.user = user;
    }

    public Agence getAgence() {
        return agence;
    }

    public void setAgence(Agence agence) {
        this.agence = agence;
    }

    public Utilisateur getUser() {
        return user;
    }

    public void setUser(Utilisateur user) {
        this.user = user;
    }
}
