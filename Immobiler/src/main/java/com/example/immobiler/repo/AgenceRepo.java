package com.example.immobiler.repo;


import com.example.immobiler.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface AgenceRepo extends JpaRepository<Agence, Long> {
    List<Agence> findByProprietaireId(Long userId);
    // Repository
    long count();  // JPA fournit déjà cette méthode



}
