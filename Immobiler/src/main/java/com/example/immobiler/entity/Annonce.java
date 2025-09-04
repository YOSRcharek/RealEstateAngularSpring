package com.example.immobiler.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

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

    private Integer bedrooms;
    private Integer bathrooms;
    private Integer guestRooms;
    private Boolean garden;
    private Boolean airCondition;
    private Boolean parking;
    private Boolean internet;
    private Boolean pool;

    private String adresse;  // champ spatial



    @Enumerated(EnumType.STRING)
    private Statut statut; // Disponible, Vendu, En location

    @ManyToOne
    @JoinColumn(name = "agence_id")
    private Agence agence;

    private LocalDateTime dateCreation = LocalDateTime.now();

    private LocalDateTime dateModification;

    @PreUpdate
    public void preUpdate() { dateModification = LocalDateTime.now(); }

    @OneToMany(mappedBy = "annonce", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ImageAnnonce> images = new ArrayList<>();

    @OneToMany(mappedBy = "annonce", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("annonce-rating")
    private List<Rating> ratings = new ArrayList<>();


    // Getters / Setters


    public Annonce(Long id, String titre, String description, BigDecimal prix, TypeBien typeBien, Double surface, Integer nbPieces, Integer bedrooms, Integer bathrooms, Integer guestRooms, Boolean garden, Boolean airCondition, Boolean parking, Boolean internet, Boolean pool, String adresse, Statut statut, Agence agence, LocalDateTime dateCreation, LocalDateTime dateModification, List<ImageAnnonce> images, List<Rating> ratings) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.prix = prix;
        this.typeBien = typeBien;
        this.surface = surface;
        this.nbPieces = nbPieces;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.guestRooms = guestRooms;
        this.garden = garden;
        this.airCondition = airCondition;
        this.parking = parking;
        this.internet = internet;
        this.pool = pool;
        this.adresse = adresse;
        this.statut = statut;
        this.agence = agence;
        this.dateCreation = dateCreation;
        this.dateModification = dateModification;
        this.images = images;
        this.ratings = ratings;
    }

    public Annonce() {
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public Integer getGuestRooms() {
        return guestRooms;
    }

    public void setGuestRooms(Integer guestRooms) {
        this.guestRooms = guestRooms;
    }

    public Boolean getGarden() {
        return garden;
    }

    public void setGarden(Boolean garden) {
        this.garden = garden;
    }

    public Boolean getAirCondition() {
        return airCondition;
    }

    public void setAirCondition(Boolean airCondition) {
        this.airCondition = airCondition;
    }

    public Boolean getParking() {
        return parking;
    }

    public void setParking(Boolean parking) {
        this.parking = parking;
    }

    public Boolean getInternet() {
        return internet;
    }

    public void setInternet(Boolean internet) {
        this.internet = internet;
    }

    public Boolean getPool() {
        return pool;
    }

    public void setPool(Boolean pool) {
        this.pool = pool;
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

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse=adresse;
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
