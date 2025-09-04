package com.example.immobiler.dto;

public class UtilisateurUpdateDTO {
    private Long id;
    private String nom;
    private String email;
    private byte[] photo;

    private AgenceUpdateDTO agence; // seulement les champs nécessaires

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public AgenceUpdateDTO getAgence() {
        return agence;
    }

    public void setAgence(AgenceUpdateDTO agence) {
        this.agence = agence;
    }
}

