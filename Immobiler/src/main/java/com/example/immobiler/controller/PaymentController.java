package com.example.immobiler.controller;

import com.example.immobiler.entity.Role;
import com.example.immobiler.entity.Transaction;
import com.example.immobiler.entity.Utilisateur;
import com.example.immobiler.repo.UtilisateurRepo;
import com.example.immobiler.service.TransactionService;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    @Autowired
    private  UtilisateurRepo userRepository;
    @Autowired
    private TransactionService transactionService;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
    @PreAuthorize("hasAuthority('MAKE_PAYEMENT')")
    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            Long amount = Long.valueOf(request.get("amount").toString());

            // ⚠️ Stripe veut le montant en CENTS
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("http://localhost:4200/cancel")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount(amount * 100) // 20 TND -> 2000 cents
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Abonnement " + amount + " TND")
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            // ✅ Upgrade user en SUBSCRIBER
            String email = authentication.getName();
            Utilisateur user = userRepository.findByEmail(email).orElseThrow();
            user.setRole(Role.SUBSCRIBER);
            userRepository.save(user);

            // ✅ Enregistrer la transaction
            Transaction t = new Transaction();
            t.setUserId(user.getId()); // tu récupères l’ID du user connecté
            t.setPlanName("Abonnement " + amount + " TND");
            t.setAmount(Double.valueOf(amount));
            t.setCurrency("usd");
            t.setStatus("succeeded");

            transactionService.saveTransaction(t);

            // ✅ Réponse envoyée au frontend
            return ResponseEntity.ok(Map.of("id", session.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



}
