package com.example.immobiler.service;

import com.example.immobiler.entity.Transaction;
import com.example.immobiler.repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepository;

    // Sauvegarder une transaction
    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Récupérer toutes les transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Récupérer les transactions d’un user spécifique
    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
}
