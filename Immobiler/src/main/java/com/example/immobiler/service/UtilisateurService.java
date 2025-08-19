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

        // ---------------- CRUD ----------------
        public List<Utilisateur> getAll() {
            return utilisateurRepository.findAll();
        }

        public Optional<Utilisateur> getById(Long id) {
            return utilisateurRepository.findById(id);
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
            utilisateur.setRole(Role.USER); // rôle par défaut
            utilisateur.setEmailToken(UUID.randomUUID().toString()); // token pour email
            utilisateur.setConfirmeEmail(false);
            // TODO : envoyer email avec le token
            return utilisateurRepository.save(utilisateur);
        }
        public Optional<Utilisateur> findByEmail(String email) {
            return utilisateurRepository.findByEmail(email);
        }

        public Optional<Utilisateur> findByToken(String token) {
            return utilisateurRepository.findByEmailToken(token);
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
    }
