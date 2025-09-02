package com.example.immobiler.controller;

import com.example.immobiler.entity.Annonce;
import com.example.immobiler.entity.ImageAnnonce;
import com.example.immobiler.repo.AnnonceRepo;
import com.example.immobiler.repo.ImageAnnonceRepo;
import com.example.immobiler.service.ImageAnnonceService;
import jakarta.annotation.security.PermitAll;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.File;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;

// ------------------ ImageAnnonceController ------------------
@RestController
@RequestMapping("/api/images")
public class ImageAnnonceController {

    @Autowired
    private ImageAnnonceService imageAnnonceService;
    @Autowired
    private ImageAnnonceRepo imageAnnonceRepo;

    @Autowired
    private AnnonceRepo annonceRepo;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_IMAGE')")
    public List<ImageAnnonce> getAll() {
        return imageAnnonceService.getAll();
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

    // --- Upload multiple images ---
// --- Upload multiple images ---
    @PostMapping(value = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('CREATE_IMAGE')")
    public ResponseEntity<List<ImageAnnonce>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("annonceId") Long annonceId) throws IOException {

        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().build();
        }

        Annonce annonce = annonceRepo.findById(annonceId)
                .orElseThrow(() -> new RuntimeException("Annonce not found"));

        List<ImageAnnonce> addedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            ImageAnnonce img = new ImageAnnonce();
            img.setAnnonce(annonce);
            img.setImage(file.getBytes());

            annonce.getImages().add(img); // ajoute à la collection existante
            addedImages.add(img);
        }

        // Sauvegarde via cascade
        annonceRepo.save(annonce);

        // ⚡ Retourne uniquement les nouvelles images ajoutées en JSON
        return ResponseEntity.ok(addedImages);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_IMAGE')")
    public ResponseEntity<ImageAnnonce> updateImage(@PathVariable Long id, @RequestBody ImageAnnonce imageAnnonce) {
        return imageAnnonceService.getById(id)
                .map(existing -> {
                    existing.setImage(imageAnnonce.getImage()); // met à jour seulement le byte[]
                    return ResponseEntity.ok(imageAnnonceService.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    // --- Download image ---
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_IMAGE')")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        ImageAnnonce img = imageAnnonceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        byte[] bytes = img.getImage(); // <-- plus besoin de Blob.getBytes()

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=image_" + id + ".jpg")
                .contentType(MediaType.IMAGE_JPEG)
                .body(bytes);
    }





    // --- Get all images for an annonce ---
    @GetMapping("/annonce/{annonceId}")
    @PreAuthorize("permitAll()")
    public List<ImageAnnonce> getByAnnonce(@PathVariable Long annonceId) {
        return imageAnnonceRepo.findByAnnonceId(annonceId);
    }

    // --- Download image ---


}