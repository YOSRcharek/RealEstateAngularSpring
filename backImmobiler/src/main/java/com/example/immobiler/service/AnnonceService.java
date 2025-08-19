package com.example.immobiler.service;

import com.example.immobiler.entity.*;
import com.example.immobiler.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// ------------------ AnnonceService ------------------
@Service
public class AnnonceService {
    @Autowired
    private AnnonceRepo annonceRepository;

    public List<Annonce> getAll() { return annonceRepository.findAll(); }
    public Optional<Annonce> getById(Long id) { return annonceRepository.findById(id); }
    public Annonce save(Annonce annonce) { return annonceRepository.save(annonce); }
    public void delete(Long id) { annonceRepository.deleteById(id); }
    public List<Annonce> findByZoneId(Long zoneId) { return annonceRepository.findByZoneId(zoneId); }
    public List<Annonce> findByAgenceId(Long agenceId) { return annonceRepository.findByAgenceId(agenceId); }
    // Nombre d'annonces publiées la semaine dernière
    public long countAnnoncesLastWeek() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return annonceRepository.countByDateCreationAfter(oneWeekAgo);
    }

}

