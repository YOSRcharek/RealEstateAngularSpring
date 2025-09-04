package com.example.immobiler.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rating")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "annonce_id", nullable = false)
    @JsonBackReference("annonce-rating")
    private Annonce annonce;


    @ManyToOne @JoinColumn(name = "user_id") private Utilisateur user;

    private Integer note; // 1-5

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    private LocalDateTime date = LocalDateTime.now();

    // Getters / Setters

    public Rating(Long id, Annonce annonce, Utilisateur user, Integer note, String commentaire, LocalDateTime date) {
        this.id = id;
        this.annonce = annonce;
        this.user = user;
        this.note = note;
        this.commentaire = commentaire;
        this.date = date;
    }

    public Rating() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Annonce getAnnonce() {
        return annonce;
    }

    public void setAnnonce(Annonce annonce) {
        this.annonce = annonce;
    }

    public Utilisateur getUser() {
        return user;
    }

    public void setUser(Utilisateur user) {
        this.user = user;
    }

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}

