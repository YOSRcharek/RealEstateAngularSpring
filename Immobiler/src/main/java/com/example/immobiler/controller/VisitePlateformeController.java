package com.example.immobiler.controller;

import com.example.immobiler.entity.VisitePlateforme;
import com.example.immobiler.service.AgenceService;
import com.example.immobiler.service.AnnonceService;
import com.example.immobiler.service.UtilisateurService;
import com.example.immobiler.service.VisitePlateformeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// ------------------ VisitePlateformeController ------------------
@RestController
@RequestMapping("/api/visites")
public class VisitePlateformeController {

    @Autowired
    private VisitePlateformeService visiteService;
    @Autowired
    private UtilisateurService utilisateurService;
    @Autowired
    private AnnonceService annonceService;
    @Autowired
    private AgenceService agenceService;
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


    @GetMapping("/AllStats")
    @PreAuthorize("hasAuthority('VIEW_STATS')")
    public Map<String, Long> getAllStats() {
        Map<String, Long> stats = new HashMap<>();

        // Utilisateurs
        stats.put("total_users", utilisateurService.countAll());
        stats.put("subscribers", utilisateurService.countSubscribers());

        // Agences
        stats.put("total_agences", agenceService.countAll());

        // Annonces
        stats.put("total_annonces", annonceService.countAll());
        stats.put("annonces_last_week", annonceService.countAnnoncesLastWeek());

        // Visites
        stats.put("total_visites", visiteService.countAll());
        stats.put("visites_last_week", visiteService.countVisitesLastWeek());

        stats.put("nombre_visites_total", visiteService.countAll());
        stats.put("nombre_visites_semaine", visiteService.countVisitesThisWeek());
        stats.put("nombre_annonces_semaine", annonceService.countAnnoncesLastWeek());
        return stats;
    }
}