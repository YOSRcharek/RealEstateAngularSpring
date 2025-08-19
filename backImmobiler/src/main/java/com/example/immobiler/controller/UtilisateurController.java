package com.example.immobiler.controller;

import com.example.immobiler.dto.JwtResponse;
import com.example.immobiler.dto.LoginRequest;
import com.example.immobiler.entity.Role;
import com.example.immobiler.entity.Utilisateur;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private VisitePlateformeService visiteService;

    @Autowired
    private AnnonceService annonceService;

    // ---------------- CRUD ----------------
    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public List<Utilisateur> getAll() {
        return utilisateurService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Utilisateur> getById(@PathVariable Long id) {
        return utilisateurService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        utilisateurService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------- Sign Up ----------------
    @PostMapping("/register")
    @PreAuthorize("permitAll()") // n'importe qui peut créer un compte
    public Utilisateur register(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.register(utilisateur); // génère token email
    }

    @GetMapping("/confirm-email")
    @PreAuthorize("permitAll()") // confirmation accessible publiquement
    public ResponseEntity<String> confirmEmail(@RequestParam String token) {
        Optional<Utilisateur> user = utilisateurService.findByToken(token);
        if (user.isPresent()) {
            Utilisateur u = user.get();
            u.setConfirmeEmail(true);
            utilisateurService.save(u);
            return ResponseEntity.ok("Email confirmé avec succès !");
        }
        return ResponseEntity.badRequest().body("Token invalide");
    }

    // ---------------- Sign In ----------------
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = utilisateurService.authenticate(request.getEmail(), request.getPassword());
        if (token != null) {
            return ResponseEntity.ok(new JwtResponse(token));
        }
        return ResponseEntity.status(401).body("Email ou mot de passe invalide");
    }

    // ---------------- Changer rôle (ADMIN) ----------------
    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('MANAGE_ROLES')")
    public ResponseEntity<Utilisateur> changeRole(@PathVariable Long id, @RequestParam String role) {
        Optional<Utilisateur> user = utilisateurService.getById(id);
        if(user.isPresent()) {
            user.get().setRole(Role.valueOf(role));
            utilisateurService.save(user.get());
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

    // ---------------- Dashboard / Statistiques ----------------
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('VIEW_STATS')")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("nombre_visites_total", visiteService.countAll());
        stats.put("nombre_visites_semaine", visiteService.countVisitesLastWeek());
        stats.put("nombre_annonces_semaine", annonceService.countAnnoncesLastWeek());
        return stats;
    }
}
