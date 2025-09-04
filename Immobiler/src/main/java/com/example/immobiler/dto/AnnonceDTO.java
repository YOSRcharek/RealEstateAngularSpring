package com.example.immobiler.dto;

import com.example.immobiler.entity.Statut;
import com.example.immobiler.entity.TypeBien;

import java.math.BigDecimal;
import java.util.List;

public class AnnonceDTO {

    private Long id;
    private String titre;
    private String description;
    private BigDecimal prix;
    private TypeBien typeBien;
    private Statut statut;
    private String adresse;
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

    private Long agenceId; // seulement l'id de l'agence

    private List<Long> imageIds; // ids des images existantes

    // GETTERS & SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }

    public TypeBien getTypeBien() { return typeBien; }
    public void setTypeBien(TypeBien typeBien) { this.typeBien = typeBien; }

    public Statut getStatut() { return statut; }
    public void setStatut(Statut statut) { this.statut = statut; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public Double getSurface() { return surface; }
    public void setSurface(Double surface) { this.surface = surface; }

    public Integer getNbPieces() { return nbPieces; }
    public void setNbPieces(Integer nbPieces) { this.nbPieces = nbPieces; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public Integer getGuestRooms() { return guestRooms; }
    public void setGuestRooms(Integer guestRooms) { this.guestRooms = guestRooms; }

    public Boolean getGarden() { return garden; }
    public void setGarden(Boolean garden) { this.garden = garden; }

    public Boolean getAirCondition() { return airCondition; }
    public void setAirCondition(Boolean airCondition) { this.airCondition = airCondition; }

    public Boolean getParking() { return parking; }
    public void setParking(Boolean parking) { this.parking = parking; }

    public Boolean getInternet() { return internet; }
    public void setInternet(Boolean internet) { this.internet = internet; }

    public Boolean getPool() { return pool; }
    public void setPool(Boolean pool) { this.pool = pool; }

    public Long getAgenceId() { return agenceId; }
    public void setAgenceId(Long agenceId) { this.agenceId = agenceId; }

    public List<Long> getImageIds() { return imageIds; }
    public void setImageIds(List<Long> imageIds) { this.imageIds = imageIds; }
}
