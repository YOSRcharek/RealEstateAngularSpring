package com.example.immobiler.controller;

import com.example.immobiler.dto.AgenceRegisterRequest;
import com.example.immobiler.entity.Agence;
import com.example.immobiler.entity.Role;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.repo.AgenceRepo;
import com.example.immobiler.repo.UtilisateurRepo;
import com.example.immobiler.service.AgenceService;
import com.example.immobiler.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

// ------------------ AgenceController ------------------




@RestController
@RequestMapping("/api/agences")
public class AgenceController {
    @Autowired
    private EmailService emailService;
    @Autowired
    private UtilisateurRepo userRepository;
    @Autowired
    private AgenceRepo agenceRepository ;
    @Autowired
    private AgenceService agenceService;
    private final PasswordEncoder passwordEncoder;

    public AgenceController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

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
    @PreAuthorize("permitAll()")
// @PreAuthorize("hasAuthority('MANAGE_USERS')") // désactiver pour test
    public Agence registerAgence(@RequestBody AgenceRegisterRequest request) {
        return agenceService.registerAgence(request.getAgence(), request.getUser());
    }
    @PostMapping(value = "/registerDash", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("permitAll()")
    public ResponseEntity<Agence> registerAgency(
            @RequestPart("agence") Agence agence,
            @RequestPart("user") Utilisateur utilisateur,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        // Gestion du fichier si présent
        if (file != null && !file.isEmpty()) {
            // Exemple : enregistrer les bytes en DB ou filesystem
            byte[] photoBytes = file.getBytes();
            utilisateur.setPhoto(photoBytes); // ⚠️ Assure-toi que Utilisateur a un champ `@Lob private byte[] photo;`
        }

        // Encode le mot de passe et sauvegarde l'utilisateur
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        utilisateur.setRole(Role.AGENCY);
        utilisateur.setEmailToken(UUID.randomUUID().toString());
        utilisateur.setConfirmeEmail(false);
        Utilisateur savedUser = userRepository.save(utilisateur);

        // Email confirmation
        String link = "http://localhost:4200/confirm-email?token=" + savedUser.getEmailToken();
        String message = "Bonjour " + savedUser.getNom() + ",\n\nVeuillez confirmer votre email : " + link;
        emailService.sendEmail(savedUser.getEmail(), "Confirmez votre email", message);

        // Association agence-propriétaire
        agence.setProprietaire(savedUser);
        agence.setNom(savedUser.getNom());
        agence.setDateCreation(LocalDateTime.now());

        Agence savedAgence = agenceRepository.save(agence);

        return ResponseEntity.ok(savedAgence);
    }

}