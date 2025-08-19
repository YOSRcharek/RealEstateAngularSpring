package com.example.immobiler.service;

import com.example.immobiler.entity.VisitePlateforme;
import com.example.immobiler.repo.VisitePlateformeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// ------------------ VisitePlateformeService ------------------
@Service
public class VisitePlateformeService {
    @Autowired
    private VisitePlateformeRepo visitePlateformeRepository;

    public List<VisitePlateforme> getAll() {
        return visitePlateformeRepository.findAll();
    }

    public Optional<VisitePlateforme> getById(Long id) {
        return visitePlateformeRepository.findById(id);
    }

    public VisitePlateforme save(VisitePlateforme visite) {
        return visitePlateformeRepository.save(visite);
    }

    public void delete(Long id) {
        visitePlateformeRepository.deleteById(id);
    }

    public List<VisitePlateforme> findByUserId(Long userId) {
        return visitePlateformeRepository.findByUserId(userId);
    }

    // Nombre total de visites
    public long countAll() {
        return visitePlateformeRepository.count();
    }

    // Nombre de visites par semaine
    public long countVisitesLastWeek() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return visitePlateformeRepository.countByDateAfter(oneWeekAgo);
    }

}
