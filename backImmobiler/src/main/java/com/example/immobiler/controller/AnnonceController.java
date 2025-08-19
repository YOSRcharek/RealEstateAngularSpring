package com.example.immobiler.controller;

import com.example.immobiler.entity.Annonce;
import com.example.immobiler.service.AnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// ------------------ AnnonceController ------------------
@RestController
@RequestMapping("/api/annonces")
public class AnnonceController {

    @Autowired
    private AnnonceService annonceService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ANNONCE')")
    public List<Annonce> getAll() {
        return annonceService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_ANNONCE')")
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

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ANNONCE')")
    public ResponseEntity<Annonce> update(@PathVariable Long id, @RequestBody Annonce annonce) {
        Optional<Annonce> existing = annonceService.getById(id);
        if (existing.isPresent()) {
            annonce.setId(id);
            return ResponseEntity.ok(annonceService.save(annonce));
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

    @GetMapping("/zone/{zoneId}")
    @PreAuthorize("hasAuthority('READ_ANNONCE')")
    public List<Annonce> getByZone(@PathVariable Long zoneId) {
        return annonceService.findByZoneId(zoneId);
    }

    @GetMapping("/agence/{agenceId}")
    @PreAuthorize("hasAuthority('READ_ANNONCE')")
    public List<Annonce> getByAgence(@PathVariable Long agenceId) {
        return annonceService.findByAgenceId(agenceId);
    }
}