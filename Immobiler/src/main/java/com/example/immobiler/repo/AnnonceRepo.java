package com.example.immobiler.repo;

import com.example.immobiler.entity.Annonce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnonceRepo extends JpaRepository<Annonce, Long> {
    List<Annonce> findByZoneId(Long zoneId);
    List<Annonce> findByAgenceId(Long agenceId);
    long countByDateCreationAfter(LocalDateTime date);

}