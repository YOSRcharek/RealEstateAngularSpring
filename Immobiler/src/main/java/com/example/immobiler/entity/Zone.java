package com.example.immobiler.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "zone")
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Enumerated(EnumType.STRING)
    private TypeZone type; // Gouvernorat / Délégation / Localité

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Zone parent;

    // Getters / Setters

    public Zone(Long id, String nom, TypeZone type, Zone parent) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.parent = parent;
    }
    public Zone() {
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

    public TypeZone getType() {
        return type;
    }

    public void setType(TypeZone type) {
        this.type = type;
    }

    public Zone getParent() {
        return parent;
    }

    public void setParent(Zone parent) {
        this.parent = parent;
    }
}
