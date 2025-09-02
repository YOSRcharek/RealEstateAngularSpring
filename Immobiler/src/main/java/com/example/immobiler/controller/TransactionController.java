package com.example.immobiler.controller;

import com.example.immobiler.entity.Transaction;
import com.example.immobiler.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Enregistrer une transaction (ex: après paiement)
    @PostMapping("/save")
    @PreAuthorize("hasAuthority('MANAGE_TRANSACTIONS')")
    public ResponseEntity<?> saveTransaction(@RequestBody Transaction transaction) {
        // tu n’as pas de DTO, donc tu reçois directement un Transaction en JSON
        transaction.setCurrency("usd");
        transaction.setStatus("succeeded");

        transactionService.saveTransaction(transaction);

        return ResponseEntity.ok("Transaction enregistrée ✅");
    }

    // Récupérer toutes les transactions
    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_TRANSACTIONS')")
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    // Récupérer les transactions d’un user
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('MANAGE_TRANSACTIONS')")
    public ResponseEntity<?> getUserTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getTransactionsByUserId(userId));
    }
}
