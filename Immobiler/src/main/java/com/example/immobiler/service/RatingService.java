package com.example.immobiler.service;

import com.example.immobiler.entity.Rating;
import com.example.immobiler.repo.RatingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// ------------------ RatingService ------------------
@Service
public class RatingService {
    @Autowired
    private RatingRepo ratingRepository;

    public List<Rating> getAll() {
        return ratingRepository.findAll();
    }

    public Optional<Rating> getById(Long id) {
        return ratingRepository.findById(id);
    }

    public Rating save(Rating rating) {
        return ratingRepository.save(rating);
    }

    public void delete(Long id) {
        ratingRepository.deleteById(id);
    }

    public List<Rating> findByAnnonceId(Long annonceId) {
        return ratingRepository.findByAnnonceId(annonceId);
    }

    public List<Rating> findByUserId(Long userId) {
        return ratingRepository.findByUserId(userId);
    }
}
