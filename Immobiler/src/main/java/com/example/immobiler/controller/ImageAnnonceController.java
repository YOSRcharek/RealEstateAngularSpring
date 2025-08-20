package com.example.immobiler.controller;

import com.example.immobiler.entity.ImageAnnonce;
import com.example.immobiler.service.ImageAnnonceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ------------------ ImageAnnonceController ------------------
@RestController
@RequestMapping("/api/images")
public class ImageAnnonceController {

    @Autowired
    private ImageAnnonceService imageAnnonceService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_IMAGE')")
    public List<ImageAnnonce> getAll() {
        return imageAnnonceService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_IMAGE')")
    public ResponseEntity<ImageAnnonce> getById(@PathVariable Long id) {
        return imageAnnonceService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_IMAGE')")
    public ImageAnnonce create(@RequestBody ImageAnnonce image) {
        return imageAnnonceService.save(image);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_IMAGE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        imageAnnonceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/annonce/{annonceId}")
    @PreAuthorize("hasAuthority('READ_IMAGE')")
    public List<ImageAnnonce> getByAnnonce(@PathVariable Long annonceId) {
        return imageAnnonceService.findByAnnonceId(annonceId);
    }
}