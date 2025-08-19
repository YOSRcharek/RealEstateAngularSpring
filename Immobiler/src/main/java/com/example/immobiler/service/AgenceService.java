package com.example.immobiler.service;

import com.example.immobiler.entity.Agence;
import com.example.immobiler.repo.AgenceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// ------------------ AgenceService ------------------
@Service
public class AgenceService {
    @Autowired
    private AgenceRepo agenceRepository;

    public List<Agence> getAll() {
        return agenceRepository.findAll();
    }

    public Optional<Agence> getById(Long id) {
        return agenceRepository.findById(id);
    }

    public Agence save(Agence agence) {
        return agenceRepository.save(agence);
    }

    public void delete(Long id) {
        agenceRepository.deleteById(id);
    }

    public List<Agence> findByProprietaireId(Long userId) {
        return agenceRepository.findByProprietaireId(userId);
    }
}
