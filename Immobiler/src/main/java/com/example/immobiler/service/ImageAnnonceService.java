package com.example.immobiler.service;

import com.example.immobiler.entity.ImageAnnonce;
import com.example.immobiler.repo.ImageAnnonceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// ------------------ ImageAnnonceService ------------------
@Service
public class ImageAnnonceService {
    @Autowired
    private ImageAnnonceRepo imageAnnonceRepository;

    public List<ImageAnnonce> getAll() {
        return imageAnnonceRepository.findAll();
    }

    public Optional<ImageAnnonce> getById(Long id) {
        return imageAnnonceRepository.findById(id);
    }

    public ImageAnnonce save(ImageAnnonce imageAnnonce) {
        return imageAnnonceRepository.save(imageAnnonce);
    }

    public void delete(Long id) {
        imageAnnonceRepository.deleteById(id);
    }

    public List<ImageAnnonce> findByAnnonceId(Long annonceId) {
        return imageAnnonceRepository.findByAnnonceId(annonceId);
    }
}
