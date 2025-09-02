package com.example.immobiler.service;

import com.example.immobiler.entity.Role;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.repo.UtilisateurRepo;
import com.example.immobiler.security.CustomUserDetails;
import com.example.immobiler.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

// ------------------ UtilisateurService ------------------
@Service
public class UtilisateurService {
    @Autowired
    private UtilisateurRepo utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

        // ---------------- CRUD ----------------
        public List<Utilisateur> getAll() {
            return utilisateurRepository.findAll();
        }

    public Optional<Utilisateur> getById(Long id) {
        return utilisateurRepository.findById(id);
    }
    public Optional<byte[]> getPhotoById(Long id) {
        return utilisateurRepository.findPhotoById(id);
    }
        public long countAll() {
            return utilisateurRepository.count();
        }

        public void delete(Long id) {
            utilisateurRepository.deleteById(id);
        }

        public Utilisateur save(Utilisateur utilisateur) {
            return utilisateurRepository.save(utilisateur);
        }

        // ---------------- Register (Sign Up) ----------------

        public Utilisateur register(Utilisateur utilisateur) {
            utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
            utilisateur.setRole(Role.USER);
            utilisateur.setEmailToken(UUID.randomUUID().toString());
            utilisateur.setConfirmeEmail(false);

            Utilisateur savedUser = utilisateurRepository.save(utilisateur);

            // Envoyer email de confirmation
            String link = "http://localhost:4200/confirm-email?token=" + savedUser.getEmailToken();
            String message = "Bonjour " + savedUser.getNom() + ",\n\nVeuillez confirmer votre email en cliquant sur ce lien : " + link;
            emailService.sendEmail(savedUser.getEmail(), "Confirmez votre email", message);

            return savedUser;
        }

       public Optional<Utilisateur> findByEmail(String email) {
            return utilisateurRepository.findByEmail(email);
        }


        public Optional<Utilisateur> findByToken(String token) {
            return utilisateurRepository.findByEmailToken(token);
        }

    public Optional<Utilisateur> findByResetPasswordToken(String token) {
        return utilisateurRepository.findByResetPasswordToken(token);
    }


    // ---------------- Authenticate (Sign In) ----------------
        public String authenticate(String email, String motDePasse) {
            Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                Utilisateur user = userOpt.get();
                if (passwordEncoder.matches(motDePasse, user.getMotDePasse()) && user.isConfirmeEmail()) {
                    UserDetails userDetails = new CustomUserDetails(user); // <-- ici CustomUserDetails
                    return jwtTokenProvider.generateToken(userDetails);
                }
            }
            return null;
        }


    // ---------------- Changer rôle ----------------
        public Utilisateur changeRole(Utilisateur utilisateur, Role role) {
            utilisateur.setRole(role);
            return utilisateurRepository.save(utilisateur);
        }

    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifie l'ancien mot de passe
        if (!passwordEncoder.matches(oldPassword, user.getMotDePasse())) {
            return false;
        }

        // Encode le nouveau mot de passe
        user.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(user);
        return true;
    }
    public long countSubscribers() {
        return utilisateurRepository.countByRole(Role.SUBSCRIBER);
    }

    public long countAdmins() {
        return utilisateurRepository.countByRole(Role.ADMIN);
    }

    public long countAgencies() {
        return utilisateurRepository.countByRole(Role.AGENCY);
    }

    public long countUsers() {
        return utilisateurRepository.countByRole(Role.USER);
    }

    public long countAllUsers() {
        return utilisateurRepository.count();
    }
}
