package com.example.immobiler.repo;

import com.example.immobiler.entity.VisitePlateforme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitePlateformeRepo extends JpaRepository<VisitePlateforme, Long> {
    List<VisitePlateforme> findByUserId(Long userId);
    long countByDateAfter(LocalDateTime date);
    long countByDateBetween(LocalDateTime start, LocalDateTime end);

}