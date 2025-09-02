package com.example.immobiler.service;

import com.example.immobiler.entity.VisitePlateforme;
import com.example.immobiler.repo.VisitePlateformeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
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


    // Visites cette semaine (lundi 00:00 à maintenant)
    public long countVisitesThisWeek() {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDateTime startOfWeek = monday.atStartOfDay();
        return visitePlateformeRepository.countByDateAfter(startOfWeek);
    }

    // Visites semaine dernière
    public long countVisitesLastWeek() {
        LocalDate today = LocalDate.now();
        LocalDate lastMonday = today.minusWeeks(1).with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate lastSunday = lastMonday.plusDays(6);
        LocalDateTime startOfLastWeek = lastMonday.atStartOfDay();
        LocalDateTime endOfLastWeek = lastSunday.atTime(23, 59, 59);
        return visitePlateformeRepository.countByDateBetween(startOfLastWeek, endOfLastWeek);
    }

}
