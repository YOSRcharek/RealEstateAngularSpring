package com.example.immobiler.repo;

import com.example.immobiler.entity.Role;
import com.example.immobiler.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepo extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findByEmailToken(String token);

    Optional<Utilisateur> findByResetPasswordToken(String token);
    @Query("SELECT u.photo FROM Utilisateur u WHERE u.id = :id")
    Optional<byte[]> findPhotoById(@Param("id") Long id);

    long count();
    long countByRole(Role role);
}
