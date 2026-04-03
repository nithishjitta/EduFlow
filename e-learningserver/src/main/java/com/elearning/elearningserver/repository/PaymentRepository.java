package com.elearning.elearningserver.repository;

import com.elearning.elearningserver.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
}