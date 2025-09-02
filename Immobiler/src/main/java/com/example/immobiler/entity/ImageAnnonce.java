package com.example.immobiler.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Base64;

@Entity
@Table(name = "image_annonce")
public class ImageAnnonce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "annonce_id")
    @JsonBackReference  // empêche boucle infinie JSON
    private Annonce annonce;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;


    // Constructeurs
    public ImageAnnonce() {
    }

    public ImageAnnonce(Long id, Annonce annonce, byte[] image) {
        this.id = id;
        this.annonce = annonce;
        this.image = image;
    }

    // Getters / Setters
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

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }



    // Getter optionnel pour renvoyer l'image en Base64 côté frontend
    @Transient
    public String getImageBase64() {
        if (image != null) {
            return Base64.getEncoder().encodeToString(image);
        }
        return null;
    }
}
