package com.example.immobiler.controller;

import com.example.immobiler.dto.AgenceRegisterRequest;
import com.example.immobiler.entity.Agence;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.service.AgenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// ------------------ AgenceController ------------------
@RestController
@RequestMapping("/api/agences")
public class AgenceController {

    @Autowired
    private AgenceService agenceService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_AGENCE')")
    public List<Agence> getAll() {
        return agenceService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_AGENCE')")
    public ResponseEntity<Agence> getById(@PathVariable Long id) {
        return agenceService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_AGENCE')")
    public Agence create(@RequestBody Agence agence) {
        return agenceService.save(agence);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_AGENCE')")
    public ResponseEntity<Agence> update(@PathVariable Long id, @RequestBody Agence agence) {
        Optional<Agence> existing = agenceService.getById(id);
        if (existing.isPresent()) {
            agence.setId(id);
            return ResponseEntity.ok(agenceService.save(agence));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_AGENCE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        agenceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/proprietaire/{userId}")
    @PreAuthorize("hasAuthority('READ_AGENCE')")
    public List<Agence> getByProprietaire(@PathVariable Long userId) {
        return agenceService.findByProprietaireId(userId);
    }

    @PostMapping("/register")
// @PreAuthorize("hasAuthority('MANAGE_USERS')") // désactiver pour test
    public Agence registerAgence(@RequestBody AgenceRegisterRequest request) {
        return agenceService.registerAgence(request.getAgence(), request.getUser());
    }

}