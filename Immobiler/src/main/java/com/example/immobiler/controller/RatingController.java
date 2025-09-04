package com.example.immobiler.controller;

import com.example.immobiler.entity.Annonce;
import com.example.immobiler.entity.Rating;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.repo.AnnonceRepo;
import com.example.immobiler.repo.RatingRepo;
import com.example.immobiler.repo.UtilisateurRepo;
import com.example.immobiler.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ------------------ RatingController ------------------
@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;
    @Autowired
    private RatingRepo ratingRepo;
    @Autowired
    private AnnonceRepo annonceRepo;
    @Autowired
    private UtilisateurRepo utilisateurRepo;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_RATING')")
    public List<Rating> getAll() {
        return ratingService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_RATING')")
    public ResponseEntity<Rating> getById(@PathVariable Long id) {
        return ratingService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_RATING')")
    public Rating create(@RequestBody Rating rating) {
        // Assure-toi que les objets annonce et user existent et sont attachés
        Annonce annonce = annonceRepo.findById(rating.getAnnonce().getId())
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        rating.setAnnonce(annonce);

        return ratingRepo.save(rating);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_RATING')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ratingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/annonce/{annonceId}")
    @PreAuthorize("permitAll()")
    public List<Rating> getByAnnonce(@PathVariable Long annonceId) {
        return ratingService.findByAnnonceId(annonceId);
    }


}