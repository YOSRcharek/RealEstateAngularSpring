package com.example.immobiler.controller;

import com.example.immobiler.dto.AnnonceDTO;
import com.example.immobiler.entity.Agence;
import com.example.immobiler.entity.Annonce;
import com.example.immobiler.entity.ImageAnnonce;
import com.example.immobiler.service.AgenceService;
import com.example.immobiler.service.AnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

// ------------------ AnnonceController ------------------
@RestController
@RequestMapping("/api/annonces")
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;
    @Autowired
    private AgenceService agenceService ;
    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Annonce> getAll() {
        return annonceService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Annonce> getById(@PathVariable Long id) {
        return annonceService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ANNONCE')")
    public Annonce create(@RequestBody Annonce annonce) {
        return annonceService.save(annonce);
    }

    @PostMapping(value ="/withImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('CREATE_ANNONCE')")
    public Annonce createWithImage(
            @RequestPart("annonce") Annonce annonce,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        if (images != null) {
            for (MultipartFile file : images) {
                try {
                    ImageAnnonce img = new ImageAnnonce();
                    img.setImage(file.getBytes());
                    img.setAnnonce(annonce);
                    annonce.getImages().add(img);
                } catch (IOException e) {
                    throw new RuntimeException("Erreur lecture image", e);
                }
            }
        }
        return annonceService.save(annonce);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ANNONCE')")
    public ResponseEntity<Annonce> update(@PathVariable Long id, @RequestBody Annonce annonce) {
        Optional<Annonce> existing = annonceService.getById(id);
        if (existing.isPresent()) {
            Annonce existingAnnonce = existing.get();

            // ⚡ Conserver les images existantes
            annonce.setImages(existingAnnonce.getImages());

            annonce.setId(id);
            return ResponseEntity.ok(annonceService.save(annonce));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/updateDash/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ANNONCE')")
    public ResponseEntity<AnnonceDTO> update(@PathVariable Long id, @RequestBody AnnonceDTO dto) {
        Optional<Annonce> existing = annonceService.getById(id);
        if (existing.isPresent()) {
            Annonce annonce = existing.get();

            // ⚡ Mettre à jour les champs depuis le DTO
            annonce.setTitre(dto.getTitre());
            annonce.setDescription(dto.getDescription());
            annonce.setPrix(dto.getPrix());
            annonce.setTypeBien(dto.getTypeBien());
            annonce.setStatut(dto.getStatut());
            annonce.setAdresse(dto.getAdresse());
            annonce.setSurface(dto.getSurface());
            annonce.setNbPieces(dto.getNbPieces());
            annonce.setBedrooms(dto.getBedrooms());
            annonce.setBathrooms(dto.getBathrooms());
            annonce.setGuestRooms(dto.getGuestRooms());
            annonce.setGarden(dto.getGarden());
            annonce.setAirCondition(dto.getAirCondition());
            annonce.setParking(dto.getParking());
            annonce.setInternet(dto.getInternet());
            annonce.setPool(dto.getPool());

            // ⚡ Mettre l'agence
            if (dto.getAgenceId() != null) {
                Agence agence = agenceService.getById(dto.getAgenceId())
                        .orElse(null);
                annonce.setAgence(agence);
            }

            // ⚡ Les images restent inchangées si besoin
            // annonce.setImages(existingAnnonce.getImages());

            Annonce saved = annonceService.save(annonce);

            // ⚡ Convertir en DTO pour la réponse
            AnnonceDTO responseDto = new AnnonceDTO();
            responseDto.setId(saved.getId());
            responseDto.setTitre(saved.getTitre());
            responseDto.setDescription(saved.getDescription());
            responseDto.setPrix(saved.getPrix());
            responseDto.setTypeBien(saved.getTypeBien());
            responseDto.setStatut(saved.getStatut());
            responseDto.setAdresse(saved.getAdresse());
            responseDto.setSurface(saved.getSurface());
            responseDto.setNbPieces(saved.getNbPieces());
            responseDto.setBedrooms(saved.getBedrooms());
            responseDto.setBathrooms(saved.getBathrooms());
            responseDto.setGuestRooms(saved.getGuestRooms());
            responseDto.setGarden(saved.getGarden());
            responseDto.setAirCondition(saved.getAirCondition());
            responseDto.setParking(saved.getParking());
            responseDto.setInternet(saved.getInternet());
            responseDto.setPool(saved.getPool());
            responseDto.setAgenceId(saved.getAgence() != null ? saved.getAgence().getId() : null);

            return ResponseEntity.ok(responseDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_ANNONCE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        annonceService.delete(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/agence/{agenceId}")
    @PreAuthorize("hasAuthority('READ_ANNONCE')")
    public List<Annonce> getByAgence(@PathVariable Long agenceId) {
        return annonceService.findByAgenceId(agenceId);
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public List<Annonce> search(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String adresse,
            @RequestParam(required = false) String titre,   // <-- ajout
            @RequestParam(required = false) Boolean garden,
            @RequestParam(required = false) Boolean airCondition,
            @RequestParam(required = false) Boolean parking,
            @RequestParam(required = false) Boolean internet,
            @RequestParam(required = false) Boolean pool,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minSurface,
            @RequestParam(required = false) Integer maxSurface
    ) {
        return annonceService.searchAnnonces(
                type, statut, adresse, titre,   // <-- propagation
                garden, airCondition, parking, internet, pool,
                minPrice, maxPrice,
                minSurface, maxSurface
        );
    }


}