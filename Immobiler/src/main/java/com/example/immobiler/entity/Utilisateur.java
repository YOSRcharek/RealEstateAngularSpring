package com.example.immobiler.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;

@Entity
@Table(name = "utilisateur")
public class Utilisateur implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(unique = true)
    private String email;

    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean confirmeEmail = false;

    private String emailToken;

    private LocalDateTime dateCreation = LocalDateTime.now();

    @OneToOne(mappedBy = "proprietaire", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("proprietaire")
    private Agence agence;


    /*@OneToOne(mappedBy = "proprietaire", fetch = FetchType.EAGER)
    @JsonIgnore // ignore lors de la sérialisation JSON
    private Agence agence;*/


    private String resetPasswordToken;
    private LocalDateTime tokenExpiry;

    @Lob
    @Column(name = "photo", columnDefinition = "LONGBLOB") // selon la BDD
    private byte[] photo;

    // Getters / Setters

    public Utilisateur(Long id,byte[] photo, String nom, String email, LocalDateTime tokenExpiry,String resetPasswordToken, String motDePasse, Role role, Boolean confirmeEmail, String emailToken, LocalDateTime dateCreation, Agence agence) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.confirmeEmail = confirmeEmail;
        this.emailToken = emailToken;
        this.dateCreation = dateCreation;
        this.agence=agence;
        this.resetPasswordToken=resetPasswordToken;
        this.tokenExpiry=tokenExpiry;
        this.photo = photo;
    }

    public Utilisateur() {
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getResetPasswordToken() {
        return resetPasswordToken;
    }

    public void setResetPasswordToken(String resetPasswordToken) {
        this.resetPasswordToken = resetPasswordToken;
    }

    public LocalDateTime getTokenExpiry() {
        return tokenExpiry;
    }

    public void setTokenExpiry(LocalDateTime tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }

    public Boolean getConfirmeEmail() {
        return confirmeEmail;
    }

    public Agence getAgence() {
        return agence;
    }

    public void setAgence(Agence agence) {
        this.agence = agence;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean isConfirmeEmail() {
        return confirmeEmail;
    }

    public void setConfirmeEmail(Boolean confirmeEmail) {
        this.confirmeEmail = confirmeEmail;
    }

    public String getEmailToken() {
        return emailToken;
    }

    public void setEmailToken(String emailToken) {
        this.emailToken = emailToken;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }
}

