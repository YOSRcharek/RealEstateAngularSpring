package com.example.immobiler.controller;

import com.example.immobiler.entity.Zone;
import com.example.immobiler.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// ------------------ ZoneController ------------------
@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    @Autowired
    private ZoneService zoneService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ZONE')")
    public List<Zone> getAll() {
        return zoneService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_ZONE')")
    public ResponseEntity<Zone> getById(@PathVariable Long id) {
        return zoneService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_ZONE')")
    public Zone create(@RequestBody Zone zone) {
        return zoneService.save(zone);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_ZONE')")
    public ResponseEntity<Zone> update(@PathVariable Long id, @RequestBody Zone zone) {
        Optional<Zone> existing = zoneService.getById(id);
        if (existing.isPresent()) {
            zone.setId(id);
            return ResponseEntity.ok(zoneService.save(zone));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_ZONE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        zoneService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/parent/{parentId}")
    @PreAuthorize("hasAuthority('READ_ZONE')")
    public List<Zone> getByParent(@PathVariable Long parentId) {
        return zoneService.findByParentId(parentId);
    }
}