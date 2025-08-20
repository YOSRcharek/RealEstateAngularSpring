package com.example.immobiler.repo;

import com.example.immobiler.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepo extends JpaRepository<Zone, Long> {
    List<Zone> findByParentId(Long parentId);
}