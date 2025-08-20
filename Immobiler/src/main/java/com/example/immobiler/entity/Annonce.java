package com.example.immobiler.entity;

import jakarta.persistence.*;
import org.springframework.data.geo.Point;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "annonce")
public class Annonce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal prix;

    @Enumerated(EnumType.STRING)
    private TypeBien typeBien; // Maison, Appartement, Terrain, Autre

    private Double surface;

    private Integer nbPieces;

    @Column(columnDefinition = "POINT")
    private Point localisation;

    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @Enumerated(EnumType.STRING)
    private Statut statut; // Disponible, Vendu, En location

    @ManyToOne
    @JoinColumn(name = "agence_id")
    private Agence agence;

    private LocalDateTime dateCreation = LocalDateTime.now();

    private LocalDateTime dateModification;

    @PreUpdate
    public void preUpdate() { dateModification = LocalDateTime.now(); }

    @OneToMany(mappedBy = "annonce", cascade = CascadeType.ALL)
    private List<ImageAnnonce> images = new ArrayList<>();

    @OneToMany(mappedBy = "annonce", cascade = CascadeType.ALL)
    private List<Rating> ratings = new ArrayList<>();

    // Getters / Setters

    public Annonce(Long id, String titre, String description, BigDecimal prix, TypeBien typeBien, Double surface, Integer nbPieces, Point localisation, Zone zone, Statut statut, Agence agence, LocalDateTime dateCreation, LocalDateTime dateModification, List<ImageAnnonce> images, List<Rating> ratings) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.prix = prix;
        this.typeBien = typeBien;
        this.surface = surface;
        this.nbPieces = nbPieces;
        this.localisation = localisation;
        this.zone = zone;
        this.statut = statut;
        this.agence = agence;
        this.dateCreation = dateCreation;
        this.dateModification = dateModification;
        this.images = images;
        this.ratings = ratings;
    }

    public Annonce() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public TypeBien getTypeBien() {
        return typeBien;
    }

    public void setTypeBien(TypeBien typeBien) {
        this.typeBien = typeBien;
    }

    public Double getSurface() {
        return surface;
    }

    public void setSurface(Double surface) {
        this.surface = surface;
    }

    public Integer getNbPieces() {
        return nbPieces;
    }

    public void setNbPieces(Integer nbPieces) {
        this.nbPieces = nbPieces;
    }

    public Point getLocalisation() {
        return localisation;
    }

    public void setLocalisation(Point localisation) {
        this.localisation = localisation;
    }

    public Zone getZone() {
        return zone;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }

    public Agence getAgence() {
        return agence;
    }

    public void setAgence(Agence agence) {
        this.agence = agence;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateModification() {
        return dateModification;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    public List<ImageAnnonce> getImages() {
        return images;
    }

    public void setImages(List<ImageAnnonce> images) {
        this.images = images;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }
}
