package com.example.immobiler.controller;

import com.example.immobiler.entity.VisitePlateforme;
import com.example.immobiler.service.VisitePlateformeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ------------------ VisitePlateformeController ------------------
@RestController
@RequestMapping("/api/visites")
public class VisitePlateformeController {

    @Autowired
    private VisitePlateformeService visiteService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_VISITE')")
    public List<VisitePlateforme> getAll() {
        return visiteService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_VISITE')")
    public ResponseEntity<VisitePlateforme> getById(@PathVariable Long id) {
        return visiteService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_VISITE')")
    public VisitePlateforme create(@RequestBody VisitePlateforme visite) {
        return visiteService.save(visite);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_VISITE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        visiteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('READ_VISITE')")
    public List<VisitePlateforme> getByUser(@PathVariable Long userId) {
        return visiteService.findByUserId(userId);
    }
}