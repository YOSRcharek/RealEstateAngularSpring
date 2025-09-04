package com.example.immobiler.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "agence")
public class Agence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String adresse;


    private String emailPerso;

    private int telephone; // préférable à int



    @OneToOne
    @JoinColumn(name = "proprietaire")
     private Utilisateur proprietaire;


    private LocalDateTime dateCreation = LocalDateTime.now();

    // Getters / Setters


    public Agence(Long id,String adresse, String nom, String emailPerso, int telephone, Utilisateur proprietaire, LocalDateTime dateCreation) {
        this.id = id;
        this.nom = nom;
        this.emailPerso = emailPerso;
        this.telephone = telephone;
        this.proprietaire = proprietaire;
        this.dateCreation = dateCreation;
        this.adresse=adresse;
    }

    public Agence() {
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getEmailPerso() {
        return emailPerso;
    }

    public void setEmailPerso(String emailPerso) {
        this.emailPerso = emailPerso;
    }

    public int getTelephone() {
        return telephone;
    }

    public void setTelephone(int telephone) {
        this.telephone = telephone;
    }

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


    public Utilisateur getProprietaire() {
        return proprietaire;
    }

    public void setProprietaire(Utilisateur proprietaire) {
        this.proprietaire = proprietaire;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}
