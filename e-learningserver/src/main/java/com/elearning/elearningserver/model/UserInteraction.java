package com.elearning.elearningserver.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@Document(collection = "user_interactions")
public class UserInteraction {

    @Id
    private String id;

    private String userId;
    private String courseId;
    private String action; // "view", "enroll", "complete", "rate", "search", "click"

    private Map<String, Object> metadata = new HashMap<>(); // Additional data like timeSpent, rating, searchQuery, etc.

    private Date timestamp = new Date();

    // AI learning data
    private double engagementScore; // Calculated based on time spent, completion rate, etc.
    private String learningPattern; // "quick_learner", "thorough_learner", "casual_learner", etc.
    private Map<String, Double> skillProficiency = new HashMap<>(); // Skill -> proficiency level
}
