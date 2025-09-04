package com.example.immobiler.controller;

import com.example.immobiler.dto.*;
import com.example.immobiler.entity.Agence;
import com.example.immobiler.entity.Role;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.repo.UtilisateurRepo;
import com.example.immobiler.security.JwtTokenProvider;
import com.example.immobiler.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private VisitePlateformeService visiteService;
    @Autowired
    private AgenceService agenceService;
    @Autowired
    private AnnonceService annonceService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private EmailService emailService;

    @Autowired
    private UtilisateurRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    public UtilisateurController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }


    // ---------------- CRUD ----------------
    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public List<Utilisateur> getAll() {
        return utilisateurService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Utilisateur> getById(@PathVariable Long id) {
        return utilisateurService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getPhoto/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<byte[]> getPhotoById(@PathVariable Long id) {
        return utilisateurService.getPhotoById(id)
                .map(photo -> ResponseEntity
                        .ok()
                        .contentType(MediaType.IMAGE_JPEG) // ou IMAGE_PNG selon ton cas
                        .body(photo))
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
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    public ResponseEntity<Utilisateur> update(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Utilisateur> existingOpt = utilisateurService.getById(id);
        if (existingOpt.isPresent()) {
            Utilisateur existing = existingOpt.get();
            if (updates.containsKey("nom")) existing.setNom((String) updates.get("nom"));
            // ne touche pas à mot_de_passe
            return ResponseEntity.ok(utilisateurService.save(existing));
        }
        return ResponseEntity.notFound().build();
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

    @PreAuthorize("permitAll()")
    @GetMapping("/findbyEmail/{email}")
    public Optional<Utilisateur> getByEmail(@PathVariable String email) {
        return utilisateurService.findByEmail(email);
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PasswordChangeRequest request) {

        // Extraire l'email depuis le token JWT
        String token = authHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getUsernameFromToken(token);

        Optional<Utilisateur> userOpt = utilisateurService.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body("User not found");

        boolean success = utilisateurService.changePassword(userOpt.get().getId(), request.getOldPassword(), request.getNewPassword());
        if (success) return ResponseEntity.ok("Password changed successfully");
        else return ResponseEntity.badRequest().body("Old password is incorrect");
    }

    @PostMapping("/forgot-password")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> forgotPassword(@RequestBody PasswordResetRequest request) {
        Optional<Utilisateur> userOpt = utilisateurService.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            Utilisateur user = userOpt.get();
            String token = UUID.randomUUID().toString();

            user.setResetPasswordToken(token);
            user.setTokenExpiry(LocalDateTime.now().plusHours(1));

            userRepo.save(user);
            String resetLink = "http://localhost:4200/reset-password?token=" + token;
            String message = "Cliquez sur ce lien pour réinitialiser votre mot de passe : " + resetLink;
            emailService.sendEmail(user.getEmail(), "Réinitialisation mot de passe", message);
            return ResponseEntity.ok("Lien de réinitialisation envoyé !");
        }
        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }

    @PostMapping("/dash/forgot-password")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> dashforgotPassword(@RequestBody PasswordResetRequest request) {
        Optional<Utilisateur> userOpt = utilisateurService.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            Utilisateur user = userOpt.get();
            String token = UUID.randomUUID().toString();

            user.setResetPasswordToken(token);
            user.setTokenExpiry(LocalDateTime.now().plusHours(1));

            userRepo.save(user);
            String resetLink = "http://localhost:4201/reset-password?token=" + token;
            String message = "Cliquez sur ce lien pour réinitialiser votre mot de passe : " + resetLink;
            emailService.sendEmail(user.getEmail(), "Réinitialisation mot de passe", message);
            return ResponseEntity.ok("Lien de réinitialisation envoyé !");
        }
        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }

    @PostMapping("/reset-password")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetForm form) {
        Optional<Utilisateur> userOpt = utilisateurService.findByResetPasswordToken(form.getToken());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token invalide");
        }

        Utilisateur user = userOpt.get();
        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expiré");
        }

        user.setMotDePasse(passwordEncoder.encode(form.getNewPassword()));
        user.setResetPasswordToken(null); // invalider le token
        utilisateurService.save(user);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }
    @PutMapping("/updateDTO/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Utilisateur> updateUtilisateurAgence(
            @PathVariable Long id,
            @RequestBody UtilisateurUpdateDTO dto) {

        Utilisateur utilisateur = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Mettre à jour les champs User
        utilisateur.setNom(dto.getNom());
        utilisateur.setEmail(dto.getEmail());
        if (dto.getPhoto() != null) {
            utilisateur.setPhoto(dto.getPhoto());
        }

        // Mettre à jour les champs Agence si présents
        if (dto.getAgence() != null) {
            Agence agence = utilisateur.getAgence();
            if (agence == null) {
                agence = new Agence();
                agence.setProprietaire(utilisateur);
            }
            agence.setNom(dto.getAgence().getNom());
            agence.setAdresse(dto.getAgence().getAdresse());
            agence.setEmailPerso(dto.getAgence().getEmailPerso());
            agence.setTelephone(dto.getAgence().getTelephone());

            utilisateur.setAgence(agence);
        }

        Utilisateur saved = userRepo.save(utilisateur);

        return ResponseEntity.ok(saved);
    }
    @PutMapping("/updateDash/{id}")
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    public ResponseEntity<Utilisateur> updateDash(@PathVariable Long id,@RequestBody Utilisateur user) {
        Optional<Utilisateur> existing = utilisateurService.getById(id);
            if (existing.isPresent()) {
                user.setId(id);
                return ResponseEntity.ok(utilisateurService.save(user));
            }
            return ResponseEntity.notFound().build();
        }

    // ---------------- Dashboard / Statistiques ----------------
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('VIEW_STATS')")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("total_users", utilisateurService.countAll());
        stats.put("total_subscribers", utilisateurService.countSubscribers());
        stats.put("total_agences", agenceService.countAll());
        stats.put("total_properties", annonceService.countAll());
        stats.put("nombre_visites_total", visiteService.countAll());
        stats.put("nombre_visites_semaine", visiteService.countVisitesLastWeek());
        stats.put("nombre_annonces_semaine", annonceService.countAnnoncesLastWeek());

        return stats;
    }

}
