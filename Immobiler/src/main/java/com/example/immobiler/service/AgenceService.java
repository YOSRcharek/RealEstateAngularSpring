package com.example.immobiler.service;

import com.example.immobiler.entity.Agence;
import com.example.immobiler.entity.Role;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.repo.AgenceRepo;
import com.example.immobiler.repo.UtilisateurRepo;
import com.example.immobiler.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

// ------------------ AgenceService ------------------
@Service
public class AgenceService {
    @Autowired
    private AgenceRepo agenceRepository;
    @Autowired
    private UtilisateurRepo userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private EmailService emailService;

    public List<Agence> getAll() {
        return agenceRepository.findAll();
    }

    public Optional<Agence> getById(Long id) {
        return agenceRepository.findById(id);
    }

    public Agence save(Agence agence) {
        return agenceRepository.save(agence);
    }

    public void delete(Long id) {
        agenceRepository.deleteById(id);
    }

    public List<Agence> findByProprietaireId(Long userId) {
        return agenceRepository.findByProprietaireId(userId);
    }
    public Agence registerAgence(Agence agence, Utilisateur utilisateur) {
        // Sauvegarde de l'utilisateur (propriétaire)
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        utilisateur.setRole(Role.AGENCY);
        utilisateur.setEmailToken(UUID.randomUUID().toString());
        utilisateur.setConfirmeEmail(false);

        Utilisateur savedUser = userRepository.save(utilisateur);

        // Envoyer email de confirmation
        String link = "http://localhost:4200/confirm-email?token=" + savedUser.getEmailToken();
        String message = "Bonjour " + savedUser.getNom() + ",\n\nVeuillez confirmer votre email en cliquant sur ce lien : " + link;
        emailService.sendEmail(savedUser.getEmail(), "Confirmez votre email", message);


        // Association de l'utilisateur à l'agence
        agence.setProprietaire(savedUser);
        agence.setDateCreation(LocalDateTime.now());
        agence.setNom(savedUser.getNom());

        // Sauvegarde de l'agence avec son propriétaire
        return agenceRepository.save(agence);
    }

    // Service
    public long countAll() {
        return agenceRepository.count();
    }

}
