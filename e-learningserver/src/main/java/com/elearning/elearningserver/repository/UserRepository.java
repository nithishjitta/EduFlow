package com.elearning.elearningserver.repository;

import com.elearning.elearningserver.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countBySubscriptionStatus(String status);
}