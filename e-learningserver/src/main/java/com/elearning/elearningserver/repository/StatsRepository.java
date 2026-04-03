package com.elearning.elearningserver.repository;

import com.elearning.elearningserver.model.Stats;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StatsRepository extends MongoRepository<Stats, String> {
    List<Stats> findTop12ByOrderByCreatedAtDesc();
    List<Stats> findTop1ByOrderByCreatedAtDesc();
}