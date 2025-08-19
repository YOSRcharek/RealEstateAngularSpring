package com.example.immobiler.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "image_annonce")
public class ImageAnnonce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "annonce_id")
    private Annonce annonce;

    private String url;

    private Integer ordre;

    // Getters / Setters

    public ImageAnnonce(Long id, Annonce annonce, String url, Integer ordre) {
        this.id = id;
        this.annonce = annonce;
        this.url = url;
        this.ordre = ordre;
    }

    public ImageAnnonce() {
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }
}

