package com.example.immobiler.service;

import com.example.immobiler.entity.*;
import com.example.immobiler.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

// ------------------ AnnonceService ------------------
@Service
public class AnnonceService {
    @Autowired
    private AnnonceRepo annonceRepository;

    public List<Annonce> getAll() { return annonceRepository.findAll(); }
    public Optional<Annonce> getById(Long id) { return annonceRepository.findById(id); }
    public Annonce save(Annonce annonce) { return annonceRepository.save(annonce); }
    public void delete(Long id) {
        Optional<Annonce> annonce = annonceRepository.findById(id);
        if (annonce.isPresent()) {
            annonceRepository.delete(annonce.get());
        }
    }


    public List<Annonce> findByAgenceId(Long agenceId) { return annonceRepository.findByAgenceId(agenceId); }
    // Nombre d'annonces publiées la semaine dernière
    public long countAnnoncesLastWeek() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return annonceRepository.countByDateCreationAfter(oneWeekAgo);
    }
    public List<Annonce> searchAnnonces(
            String type,
            String statut,
            String adresse,
            String titre,   // <-- ajouté
            Boolean garden,
            Boolean airCondition,
            Boolean parking,
            Boolean internet,
            Boolean pool,
            Double minPrice,
            Double maxPrice,
            Integer minSurface,
            Integer maxSurface
    ) {
        return annonceRepository.search(
                type,
                statut,
                adresse,
                titre,   // <-- propagation
                minPrice != null ? BigDecimal.valueOf(minPrice) : null,
                maxPrice != null ? BigDecimal.valueOf(maxPrice) : null,
                minSurface,
                maxSurface,
                garden,
                airCondition,
                parking,
                internet,
                pool
        );
    }

    public long countAll() {
        return annonceRepository.count();
    }
}

