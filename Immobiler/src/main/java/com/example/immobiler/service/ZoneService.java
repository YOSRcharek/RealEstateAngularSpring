package com.example.immobiler.service;

import com.example.immobiler.entity.Zone;
import com.example.immobiler.repo.ZoneRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// ------------------ ZoneService ------------------
@Service
public class ZoneService {
    @Autowired
    private ZoneRepo zoneRepository;

    public List<Zone> getAll() {
        return zoneRepository.findAll();
    }

    public Optional<Zone> getById(Long id) {
        return zoneRepository.findById(id);
    }

    public Zone save(Zone zone) {
        return zoneRepository.save(zone);
    }

    public void delete(Long id) {
        zoneRepository.deleteById(id);
    }

    public List<Zone> findByParentId(Long parentId) {
        return zoneRepository.findByParentId(parentId);
    }
}
