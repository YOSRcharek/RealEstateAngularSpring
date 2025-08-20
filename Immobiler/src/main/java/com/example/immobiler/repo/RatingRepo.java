package com.example.immobiler.repo;


import com.example.immobiler.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {
    List<Rating> findByAnnonceId(Long annonceId);
    List<Rating> findByUserId(Long userId);
}

