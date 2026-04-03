package com.elearning.elearningserver.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class RecommendationRequest {
    private String userId;
    private List<String> preferredCategories;
    private List<String> preferredSkills;
    private String preferredLevel;
    private Double maxPrice;
    private String language;
    private Integer maxDuration; // in hours
}
