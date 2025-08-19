package com.example.immobiler.controller;

import com.example.immobiler.entity.Rating;
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
        return ratingService.save(rating);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_RATING')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ratingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/annonce/{annonceId}")
    @PreAuthorize("hasAuthority('READ_RATING')")
    public List<Rating> getByAnnonce(@PathVariable Long annonceId) {
        return ratingService.findByAnnonceId(annonceId);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('READ_RATING')")
    public List<Rating> getByUser(@PathVariable Long userId) {
        return ratingService.findByUserId(userId);
    }
}