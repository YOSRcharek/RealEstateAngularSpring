package com.example.immobiler.repo;

import com.example.immobiler.entity.Annonce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnonceRepo extends JpaRepository<Annonce, Long> {
    List<Annonce> findByAgenceId(Long agenceId);
    long countByDateCreationAfter(LocalDateTime date);
    @Query("SELECT a FROM Annonce a WHERE " +
            "(:type IS NULL OR LOWER(a.typeBien) = LOWER(:type)) AND " +
            "(:statut IS NULL OR LOWER(a.statut) = LOWER(:statut)) AND " +
            "(:adresse IS NULL OR LOWER(a.adresse) LIKE %:adresse%) AND " +
            "(:titre IS NULL OR LOWER(a.titre) LIKE %:titre%) AND " +   // <-- ajout du titre
            "(:minPrice IS NULL OR a.prix >= :minPrice) AND " +
            "(:maxPrice IS NULL OR a.prix <= :maxPrice) AND " +
            "(:minSurface IS NULL OR a.surface >= :minSurface) AND " +
            "(:maxSurface IS NULL OR a.surface <= :maxSurface) AND " +
            "(:garden IS NULL OR a.garden = :garden) AND " +
            "(:airCondition IS NULL OR a.airCondition = :airCondition) AND " +
            "(:parking IS NULL OR a.parking = :parking) AND " +
            "(:internet IS NULL OR a.internet = :internet) AND " +
            "(:pool IS NULL OR a.pool = :pool)")
    List<Annonce> search(
            @Param("type") String type,
            @Param("statut") String statut,
            @Param("adresse") String adresse,
            @Param("titre") String titre,   // <-- nouveau paramètre
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minSurface") Integer minSurface,
            @Param("maxSurface") Integer maxSurface,
            @Param("garden") Boolean garden,
            @Param("airCondition") Boolean airCondition,
            @Param("parking") Boolean parking,
            @Param("internet") Boolean internet,
            @Param("pool") Boolean pool
    );
    // Repository
    long count();  // JPA fournit déjà cette méthode

    // Service



}