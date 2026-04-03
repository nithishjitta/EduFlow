package com.elearning.elearningserver.service;

import com.elearning.elearningserver.model.Course;
import com.elearning.elearningserver.model.User;
import com.elearning.elearningserver.model.UserInteraction;
import com.elearning.elearningserver.repository.CourseRepository;
import com.elearning.elearningserver.repository.UserInteractionRepository;
import com.elearning.elearningserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIAnalyticsService {

    private final UserInteractionRepository interactionRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    // AI-powered user profiling
    public Map<String, Object> analyzeUserProfile(String userId) {
        List<UserInteraction> interactions = interactionRepository.findByUserId(userId);
        User user = userRepository.findById(userId).orElse(null);

        Map<String, Object> profile = new HashMap<>();

        if (user == null || interactions.isEmpty()) {
            profile.put("learningStyle", "beginner");
            profile.put("preferredCategories", Arrays.asList("General"));
            profile.put("skillLevel", "beginner");
            profile.put("engagementLevel", "low");
            return profile;
        }

        // Analyze learning patterns
        profile.put("learningStyle", determineLearningStyle(interactions));
        profile.put("preferredCategories", getPreferredCategories(interactions));
        profile.put("skillProficiencies", calculateSkillProficiencies(interactions));
        profile.put("engagementLevel", calculateEngagementLevel(interactions));
        profile.put("learningVelocity", calculateLearningVelocity(interactions));
        profile.put("completionRate", calculateCompletionRate(interactions));
        profile.put("preferredDifficulty", determinePreferredDifficulty(interactions));
        profile.put("studyHabits", analyzeStudyHabits(interactions));

        return profile;
    }

    // Predict course completion probability
    public double predictCompletionProbability(String userId, String courseId) {
        Map<String, Object> userProfile = analyzeUserProfile(userId);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (course == null) return 0.5;

        double baseProbability = 0.5;

        // Factor in user's completion rate
        double userCompletionRate = (double) userProfile.getOrDefault("completionRate", 0.5);

        // Factor in course difficulty vs user skill level
        String userSkillLevel = (String) userProfile.getOrDefault("skillLevel", "beginner");
        String courseLevel = course.getLevel();
        double difficultyMatch = calculateDifficultyMatch(userSkillLevel, courseLevel);

        // Factor in category preference
        @SuppressWarnings("unchecked")
        List<String> preferredCategories = (List<String>) userProfile.getOrDefault("preferredCategories", new ArrayList<>());
        double categoryPreference = preferredCategories.contains(course.getCategory()) ? 1.2 : 0.8;

        // Factor in engagement level
        String engagementLevel = (String) userProfile.getOrDefault("engagementLevel", "medium");
        double engagementMultiplier = getEngagementMultiplier(engagementLevel);

        return Math.min(0.95, Math.max(0.1, baseProbability * userCompletionRate * difficultyMatch * categoryPreference * engagementMultiplier));
    }

    // Generate personalized learning path
    public List<Map<String, Object>> generateLearningPath(String userId) {
        Map<String, Object> userProfile = analyzeUserProfile(userId);
        List<Course> allCourses = courseRepository.findAll();

        // Current user skills and gaps
        @SuppressWarnings("unchecked")
        Map<String, Double> skillProficiencies = (Map<String, Double>) userProfile.getOrDefault("skillProficiencies", new HashMap<>());

        // Sort courses by learning priority
        List<Map<String, Object>> learningPath = allCourses.stream()
                .filter(course -> !isUserEnrolled(userId, course.getId()))
                .map(course -> {
                    Map<String, Object> courseAnalysis = new HashMap<>();
                    courseAnalysis.put("course", course);
                    courseAnalysis.put("priority", calculateLearningPriority(course, userProfile, skillProficiencies));
                    courseAnalysis.put("estimatedCompletionTime", estimateCompletionTime(course, userProfile));
                    courseAnalysis.put("skillGap", calculateSkillGap(course, skillProficiencies));
                    courseAnalysis.put("difficultyMatch", calculateDifficultyMatch(
                            (String) userProfile.getOrDefault("skillLevel", "beginner"), course.getLevel()));
                    return courseAnalysis;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("priority"), (Double) a.get("priority")))
                .limit(10)
                .collect(Collectors.toList());

        return learningPath;
    }

    // AI-powered course recommendations with explanations
    public List<Map<String, Object>> getSmartRecommendations(String userId) {
        Map<String, Object> userProfile = analyzeUserProfile(userId);
        List<UserInteraction> interactions = interactionRepository.findByUserId(userId);

        List<Map<String, Object>> recommendations = new ArrayList<>();

        // 1. Skill-building recommendations
        recommendations.addAll(generateSkillBuildingRecommendations(userProfile));

        // 2. Career advancement recommendations
        recommendations.addAll(generateCareerAdvancementRecommendations(userProfile));

        // 3. Trending/popular courses with personalization
        recommendations.addAll(generateTrendingRecommendations(userProfile, interactions));

        // 4. Learning path continuation
        recommendations.addAll(generateLearningPathContinuations(userId, userProfile));

        // 5. Diversity recommendations (explore new areas)
        recommendations.addAll(generateDiversityRecommendations(userProfile));

        // Remove duplicates and sort by AI score
        return recommendations.stream()
                .collect(Collectors.groupingBy(rec -> ((Course) rec.get("course")).getId()))
                .values().stream()
                .map(list -> list.stream().max((a, b) ->
                        Double.compare((Double) a.get("aiScore"), (Double) b.get("aiScore"))).orElse(list.get(0)))
                .sorted((a, b) -> Double.compare((Double) b.get("aiScore"), (Double) a.get("aiScore")))
                .limit(8)
                .collect(Collectors.toList());
    }

    private String determineLearningStyle(List<UserInteraction> interactions) {
        long viewCount = interactions.stream().mapToLong(i -> "view".equals(i.getAction()) ? 1 : 0).sum();
        long enrollCount = interactions.stream().mapToLong(i -> "enroll".equals(i.getAction()) ? 1 : 0).sum();
        long completeCount = interactions.stream().mapToLong(i -> "complete".equals(i.getAction()) ? 1 : 0).sum();

        if (completeCount > enrollCount * 0.8) return "committed_learner";
        if (viewCount > enrollCount * 2) return "explorer";
        if (enrollCount > completeCount * 2) return "collector";
        return "balanced_learner";
    }

    private List<String> getPreferredCategories(List<UserInteraction> interactions) {
        return interactions.stream()
                .filter(i -> "enroll".equals(i.getAction()) || "complete".equals(i.getAction()))
                .map(i -> {
                    try {
                        Course course = courseRepository.findById(i.getCourseId()).orElse(null);
                        return course != null ? course.getCategory() : null;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(cat -> cat, Collectors.counting()))
                .entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .map(Map.Entry::getKey)
                .limit(3)
                .collect(Collectors.toList());
    }

    private Map<String, Double> calculateSkillProficiencies(List<UserInteraction> interactions) {
        Map<String, Double> proficiencies = new HashMap<>();

        interactions.stream()
                .filter(i -> "complete".equals(i.getAction()))
                .forEach(i -> {
                    try {
                        Course course = courseRepository.findById(i.getCourseId()).orElse(null);
                        if (course != null && course.getSkills() != null) {
                            course.getSkills().forEach(skill -> {
                                proficiencies.put(skill, proficiencies.getOrDefault(skill, 0.0) + 1.0);
                            });
                        }
                    } catch (Exception e) {
                        // Skip invalid interactions
                    }
                });

        return proficiencies;
    }

    private String calculateEngagementLevel(List<UserInteraction> interactions) {
        long totalInteractions = interactions.size();
        long engagementInteractions = interactionRepository.findEngagementInteractions(
                interactions.get(0).getUserId()).size();

        double engagementRatio = (double) engagementInteractions / Math.max(totalInteractions, 1);

        if (engagementRatio > 0.7) return "high";
        if (engagementRatio > 0.4) return "medium";
        return "low";
    }

    private double calculateLearningVelocity(List<UserInteraction> interactions) {
        // Courses completed per week
        Date earliest = interactions.stream()
                .map(UserInteraction::getTimestamp)
                .min(Date::compareTo).orElse(new Date());

        Date latest = interactions.stream()
                .map(UserInteraction::getTimestamp)
                .max(Date::compareTo).orElse(new Date());

        long weeks = Math.max(1, (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 7));

        long completions = interactions.stream()
                .mapToLong(i -> "complete".equals(i.getAction()) ? 1 : 0).sum();

        return (double) completions / weeks;
    }

    private double calculateCompletionRate(List<UserInteraction> interactions) {
        long enrollments = interactions.stream()
                .mapToLong(i -> "enroll".equals(i.getAction()) ? 1 : 0).sum();
        long completions = interactions.stream()
                .mapToLong(i -> "complete".equals(i.getAction()) ? 1 : 0).sum();

        return enrollments > 0 ? (double) completions / enrollments : 0.0;
    }

    private String determinePreferredDifficulty(List<UserInteraction> interactions) {
        Map<String, Long> levelCounts = interactions.stream()
                .filter(i -> "complete".equals(i.getAction()))
                .map(i -> {
                    try {
                        Course course = courseRepository.findById(i.getCourseId()).orElse(null);
                        return course != null ? course.getLevel() : null;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(level -> level, Collectors.counting()));

        return levelCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Beginner");
    }

    private Map<String, Object> analyzeStudyHabits(List<UserInteraction> interactions) {
        Map<String, Object> habits = new HashMap<>();

        // Most active hours
        List<Integer> hours = interactions.stream()
                .map(i -> {
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(i.getTimestamp());
                    return cal.get(Calendar.HOUR_OF_DAY);
                })
                .collect(Collectors.toList());

        // Most active days
        List<Integer> days = interactions.stream()
                .map(i -> {
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(i.getTimestamp());
                    return cal.get(Calendar.DAY_OF_WEEK);
                })
                .collect(Collectors.toList());

        habits.put("preferredHours", findMostCommon(hours));
        habits.put("preferredDays", findMostCommon(days));

        return habits;
    }

    private double calculateDifficultyMatch(String userLevel, String courseLevel) {
        Map<String, Integer> levelMap = Map.of(
                "Beginner", 1,
                "Intermediate", 2,
                "Advanced", 3
        );

        int userLvl = levelMap.getOrDefault(userLevel, 1);
        int courseLvl = levelMap.getOrDefault(courseLevel, 1);

        int diff = Math.abs(userLvl - courseLvl);

        if (diff == 0) return 1.0; // Perfect match
        if (diff == 1) return 0.8; // Good match
        return 0.5; // Challenging but possible
    }

    private double getEngagementMultiplier(String engagementLevel) {
        switch (engagementLevel) {
            case "high": return 1.2;
            case "medium": return 1.0;
            case "low": return 0.8;
            default: return 1.0;
        }
    }

    private double calculateLearningPriority(Course course, Map<String, Object> userProfile,
                                           Map<String, Double> skillProficiencies) {
        double priority = 0.0;

        // Skill gap priority
        double skillGap = calculateSkillGap(course, skillProficiencies);
        priority += skillGap * 0.4;

        // Category preference
        @SuppressWarnings("unchecked")
        List<String> preferredCategories = (List<String>) userProfile.getOrDefault("preferredCategories", new ArrayList<>());
        if (preferredCategories.contains(course.getCategory())) {
            priority += 0.2;
        }

        // Difficulty match
        String userSkillLevel = (String) userProfile.getOrDefault("skillLevel", "beginner");
        double difficultyMatch = calculateDifficultyMatch(userSkillLevel, course.getLevel());
        priority += difficultyMatch * 0.2;

        // Popularity and rating
        double popularityScore = Math.log(course.getViews() + 1) * 0.1;
        double ratingScore = course.getRating() * 0.1;
        priority += popularityScore + ratingScore;

        return priority;
    }

    private double calculateSkillGap(Course course, Map<String, Double> skillProficiencies) {
        if (course.getSkills() == null || course.getSkills().isEmpty()) return 0.0;

        double totalGap = 0.0;
        for (String skill : course.getSkills()) {
            double currentProficiency = skillProficiencies.getOrDefault(skill, 0.0);
            totalGap += Math.max(0, 1.0 - currentProficiency); // Gap is what user lacks
        }

        return totalGap / course.getSkills().size();
    }

    private double estimateCompletionTime(Course course, Map<String, Object> userProfile) {
        double baseTime = course.getDuration();
        String learningStyle = (String) userProfile.getOrDefault("learningStyle", "balanced_learner");

        switch (learningStyle) {
            case "quick_learner": return baseTime * 0.8;
            case "thorough_learner": return baseTime * 1.3;
            case "committed_learner": return baseTime * 0.9;
            default: return baseTime;
        }
    }

    private boolean isUserEnrolled(String userId, String courseId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getPlaylist() == null) return false;

        return user.getPlaylist().stream()
                .anyMatch(item -> courseId.equals(item.getCourseId()));
    }

    private List<Map<String, Object>> generateSkillBuildingRecommendations(Map<String, Object> userProfile) {
        // Focus on skills the user needs to develop
        @SuppressWarnings("unchecked")
        Map<String, Double> skillProficiencies = (Map<String, Double>) userProfile.getOrDefault("skillProficiencies", new HashMap<>());

        return courseRepository.findAll().stream()
                .filter(course -> course.getSkills() != null && !course.getSkills().isEmpty())
                .map(course -> {
                    Map<String, Object> rec = new HashMap<>();
                    rec.put("course", course);
                    rec.put("aiScore", calculateSkillBuildingScore(course, skillProficiencies));
                    rec.put("reason", "Build essential skills for career growth");
                    rec.put("type", "skill_building");
                    return rec;
                })
                .filter(rec -> (Double) rec.get("aiScore") > 0.3)
                .sorted((a, b) -> Double.compare((Double) b.get("aiScore"), (Double) a.get("aiScore")))
                .limit(3)
                .collect(Collectors.toList());
    }

    private double calculateSkillBuildingScore(Course course, Map<String, Double> skillProficiencies) {
        if (course.getSkills() == null) return 0.0;

        double score = 0.0;
        for (String skill : course.getSkills()) {
            double currentLevel = skillProficiencies.getOrDefault(skill, 0.0);
            if (currentLevel < 0.7) { // User needs improvement in this skill
                score += (1.0 - currentLevel) * course.getRating() / 10.0;
            }
        }

        return score / Math.max(course.getSkills().size(), 1);
    }

    private List<Map<String, Object>> generateCareerAdvancementRecommendations(Map<String, Object> userProfile) {
        String currentLevel = (String) userProfile.getOrDefault("skillLevel", "beginner");
        String nextLevel = getNextCareerLevel(currentLevel);

        return courseRepository.findAll().stream()
                .filter(course -> nextLevel.equals(course.getLevel()))
                .map(course -> {
                    Map<String, Object> rec = new HashMap<>();
                    rec.put("course", course);
                    rec.put("aiScore", course.getRating() * 0.8 + Math.log(course.getEnrolledStudents() + 1) * 0.2);
                    rec.put("reason", "Advance to " + nextLevel + " level courses");
                    rec.put("type", "career_advancement");
                    return rec;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("aiScore"), (Double) a.get("aiScore")))
                .limit(2)
                .collect(Collectors.toList());
    }

    private String getNextCareerLevel(String currentLevel) {
        switch (currentLevel.toLowerCase()) {
            case "beginner": return "Intermediate";
            case "intermediate": return "Advanced";
            default: return "Advanced";
        }
    }

    private List<Map<String, Object>> generateTrendingRecommendations(Map<String, Object> userProfile,
                                                                    List<UserInteraction> interactions) {
        // Get trending courses from last 30 days
        Date thirtyDaysAgo = Date.from(LocalDateTime.now().minusDays(30)
                .atZone(ZoneId.systemDefault()).toInstant());

        List<String> trendingCourseIds = interactionRepository
                .findByActionAndTimestampBetween("enroll", thirtyDaysAgo, new Date())
                .stream()
                .collect(Collectors.groupingBy(UserInteraction::getCourseId, Collectors.counting()))
                .entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());

        @SuppressWarnings("unchecked")
        List<String> preferredCategories = (List<String>) userProfile.getOrDefault("preferredCategories", new ArrayList<>());

        return courseRepository.findAllById(trendingCourseIds).stream()
                .filter(course -> preferredCategories.contains(course.getCategory()))
                .map(course -> {
                    Map<String, Object> rec = new HashMap<>();
                    rec.put("course", course);
                    rec.put("aiScore", course.getRating() * 0.7 + Math.log(course.getViews() + 1) * 0.3);
                    rec.put("reason", "Trending in your preferred categories");
                    rec.put("type", "trending");
                    return rec;
                })
                .limit(2)
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> generateLearningPathContinuations(String userId, Map<String, Object> userProfile) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getPlaylist() == null || user.getPlaylist().isEmpty()) {
            return new ArrayList<>();
        }

        // Find the most recent course and suggest related courses
        String lastCourseId = user.getPlaylist().get(user.getPlaylist().size() - 1).getCourseId();
        Course lastCourse = courseRepository.findById(lastCourseId).orElse(null);

        if (lastCourse == null) return new ArrayList<>();

        return courseRepository.findAll().stream()
                .filter(course -> !lastCourseId.equals(course.getId()))
                .filter(course -> hasCommonSkills(course, lastCourse) || lastCourse.getCategory().equals(course.getCategory()))
                .map(course -> {
                    Map<String, Object> rec = new HashMap<>();
                    rec.put("course", course);
                    rec.put("aiScore", course.getRating() * 0.9 + (hasCommonSkills(course, lastCourse) ? 0.1 : 0));
                    rec.put("reason", "Continue your learning journey");
                    rec.put("type", "learning_path");
                    return rec;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("aiScore"), (Double) a.get("aiScore")))
                .limit(2)
                .collect(Collectors.toList());
    }

    private boolean hasCommonSkills(Course c1, Course c2) {
        if (c1.getSkills() == null || c2.getSkills() == null) return false;

        return c1.getSkills().stream().anyMatch(skill -> c2.getSkills().contains(skill));
    }

    private List<Map<String, Object>> generateDiversityRecommendations(Map<String, Object> userProfile) {
        @SuppressWarnings("unchecked")
        List<String> preferredCategories = (List<String>) userProfile.getOrDefault("preferredCategories", new ArrayList<>());

        return courseRepository.findAll().stream()
                .filter(course -> !preferredCategories.contains(course.getCategory()))
                .filter(course -> course.getRating() >= 4.0) // Only high-rated courses for exploration
                .map(course -> {
                    Map<String, Object> rec = new HashMap<>();
                    rec.put("course", course);
                    rec.put("aiScore", course.getRating() * 0.6 + Math.log(course.getEnrolledStudents() + 1) * 0.4);
                    rec.put("reason", "Explore new areas and expand your knowledge");
                    rec.put("type", "diversity");
                    return rec;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("aiScore"), (Double) a.get("aiScore")))
                .limit(2)
                .collect(Collectors.toList());
    }

    private <T> T findMostCommon(List<T> list) {
        return list.stream()
                .collect(Collectors.groupingBy(item -> item, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }
}
