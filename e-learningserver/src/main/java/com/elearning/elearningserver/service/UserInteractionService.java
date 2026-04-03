package com.elearning.elearningserver.service;

import com.elearning.elearningserver.model.UserInteraction;
import com.elearning.elearningserver.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserInteractionService {

    private final UserInteractionRepository interactionRepository;

    // Track user actions for AI learning
    public void trackInteraction(String userId, String courseId, String action) {
        trackInteraction(userId, courseId, action, new HashMap<>());
    }

    public void trackInteraction(String userId, String courseId, String action, Map<String, Object> metadata) {
        try {
            UserInteraction interaction = new UserInteraction();
            interaction.setUserId(userId);
            interaction.setCourseId(courseId);
            interaction.setAction(action);
            interaction.setMetadata(metadata != null ? metadata : new HashMap<>());
            interaction.setTimestamp(new Date());

            // Calculate engagement score based on action
            double engagementScore = calculateEngagementScore(action, metadata);
            interaction.setEngagementScore(engagementScore);

            interactionRepository.save(interaction);

            log.debug("Tracked user interaction: user={}, course={}, action={}, score={}",
                     userId, courseId, action, engagementScore);
        } catch (Exception e) {
            log.error("Failed to track user interaction", e);
        }
    }

    private double calculateEngagementScore(String action, Map<String, Object> metadata) {
        switch (action.toLowerCase()) {
            case "view":
                return 0.1;
            case "enroll":
                return 0.5;
            case "complete":
                return 1.0;
            case "rate":
                double rating = ((Number) metadata.getOrDefault("rating", 3.0)).doubleValue();
                return 0.3 + (rating / 5.0) * 0.2; // 0.3 to 0.5 based on rating
            case "search":
                return 0.05;
            case "click":
                return 0.02;
            default:
                return 0.01;
        }
    }

    // Track course view
    public void trackCourseView(String userId, String courseId) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("source", "course_page");
        trackInteraction(userId, courseId, "view", metadata);
    }

    // Track course enrollment
    public void trackCourseEnrollment(String userId, String courseId) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("enrollmentType", "direct");
        trackInteraction(userId, courseId, "enroll", metadata);
    }

    // Track course completion
    public void trackCourseCompletion(String userId, String courseId, double timeSpent, int lecturesWatched) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("timeSpent", timeSpent);
        metadata.put("lecturesWatched", lecturesWatched);
        metadata.put("completionRate", 1.0);
        trackInteraction(userId, courseId, "complete", metadata);
    }

    // Track course rating
    public void trackCourseRating(String userId, String courseId, double rating, String review) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("rating", rating);
        if (review != null && !review.trim().isEmpty()) {
            metadata.put("review", review);
        }
        trackInteraction(userId, courseId, "rate", metadata);
    }

    // Track search queries
    public void trackSearch(String userId, String query, String category, int resultsCount) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("query", query);
        metadata.put("category", category);
        metadata.put("resultsCount", resultsCount);
        trackInteraction(userId, null, "search", metadata);
    }

    // Track recommendation clicks
    public void trackRecommendationClick(String userId, String courseId, String recommendationType) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("recommendationType", recommendationType);
        metadata.put("source", "ai_recommendation");
        trackInteraction(userId, courseId, "click", metadata);
    }
}
