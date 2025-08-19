package com.example.immobiler.repo;

import com.example.immobiler.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageAnnonceRepo extends JpaRepository<ImageAnnonce, Long> {
    List<ImageAnnonce> findByAnnonceId(Long annonceId);
}


