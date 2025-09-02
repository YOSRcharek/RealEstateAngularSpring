package com.example.immobiler.controller;

import com.example.immobiler.entity.Agence;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.repo.AgenceRepo;
import com.example.immobiler.repo.UtilisateurRepo;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    @Autowired
    private UtilisateurRepo userRepo;

    // --- Upload et stockage en DB ---
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) throws Exception {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ No file selected");
        }

        Utilisateur user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found"));

        user.setPhoto(file.getBytes()); // Stockage direct en BDD
        userRepo.save(user);

        return ResponseEntity.ok("✅ Photo uploaded successfully");
    }


    // --- Récupérer l'image ---
    @GetMapping("/{userId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<byte[]> getPhoto(@PathVariable Long userId) {
        Utilisateur user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found"));

        byte[] photo = user.getPhoto();
        if (photo == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"photo.jpg\"")
                .contentType(MediaType.IMAGE_JPEG) // ⚠️ si PNG → IMAGE_PNG
                .body(photo);
    }
}
