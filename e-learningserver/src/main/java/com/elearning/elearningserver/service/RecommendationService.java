package com.elearning.elearningserver.service;

import com.elearning.elearningserver.dto.RecommendationRequest;
import com.elearning.elearningserver.model.Course;
import com.elearning.elearningserver.model.User;
import com.elearning.elearningserver.repository.CourseRepository;
import com.elearning.elearningserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final AIAnalyticsService aiAnalyticsService;

    private static final int LIMIT = 6;

    public List<Course> getRecommendations(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            // If no userId, return popular courses
            return getPopularCourses(null);
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            // User not found, return popular courses
            return getPopularCourses(null);
        }

        List<Course> recommendations = new ArrayList<>();

        // 1. Content-based recommendations based on user's playlist
        Set<String> userPlaylistIds = getUserPlaylistIds(user);
        if (!userPlaylistIds.isEmpty()) {
            recommendations.addAll(getContentBasedRecommendations(userPlaylistIds));
        }

        // 2. Category-based recommendations
        String preferredCategory = getUserPreferredCategory(user);
        if (preferredCategory != null) {
            recommendations.addAll(getCategoryBasedRecommendations(preferredCategory, userPlaylistIds));
        }

        // 3. Skill-based recommendations
        List<String> userSkills = getUserSkills(user);
        if (!userSkills.isEmpty()) {
            recommendations.addAll(getSkillBasedRecommendations(userSkills, userPlaylistIds));
        }

        // 4. Level progression recommendations
        String nextLevel = getNextLevel(user);
        if (nextLevel != null) {
            recommendations.addAll(getLevelBasedRecommendations(nextLevel, userPlaylistIds));
        }

        // 5. Collaborative filtering (similar users)
        recommendations.addAll(getCollaborativeRecommendations(userId, userPlaylistIds));

        // Remove duplicates and user's existing courses
        recommendations = recommendations.stream()
                .filter(course -> !userPlaylistIds.contains(course.getId()))
                .distinct()
                .collect(Collectors.toList());

        // If we don't have enough recommendations, fill with popular courses
        if (recommendations.size() < LIMIT) {
            List<Course> popularCourses = getPopularCourses(userPlaylistIds);
            for (Course course : popularCourses) {
                if (!recommendations.contains(course) && recommendations.size() < LIMIT) {
                    recommendations.add(course);
                }
            }
        }

        ensurePosters(recommendations);
        return recommendations.stream().limit(LIMIT).collect(Collectors.toList());
    }

    private Set<String> getUserPlaylistIds(User user) {
        if (user.getPlaylist() == null) return new HashSet<>();
        return user.getPlaylist().stream()
                .map(User.PlaylistItem::getCourseId)
                .collect(Collectors.toSet());
    }

    private List<Course> getContentBasedRecommendations(Set<String> userPlaylistIds) {
        List<Course> userCourses = courseRepository.findAllById(userPlaylistIds).stream()
                .collect(Collectors.toList());

        if (userCourses.isEmpty()) return new ArrayList<>();

        // Find courses with similar categories and skills
        Set<String> userCategories = userCourses.stream()
                .map(Course::getCategory)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<String> userSkills = userCourses.stream()
                .flatMap(course -> course.getSkills().stream())
                .collect(Collectors.toSet());

        return courseRepository.findAll().stream()
                .filter(course -> !userPlaylistIds.contains(course.getId()))
                .filter(course -> hasMatchingAttributes(course, userCategories, userSkills))
                .sorted(this::compareByRelevance)
                .limit(3)
                .collect(Collectors.toList());
    }

    private boolean hasMatchingAttributes(Course course, Set<String> categories, Set<String> skills) {
        if (course.getCategory() != null && categories.contains(course.getCategory())) {
            return true;
        }
        return course.getSkills().stream().anyMatch(skills::contains);
    }

    private int compareByRelevance(Course c1, Course c2) {
        // Higher rating and more students = more relevant
        double score1 = c1.getRating() * Math.log(c1.getEnrolledStudents() + 1);
        double score2 = c2.getRating() * Math.log(c2.getEnrolledStudents() + 1);
        return Double.compare(score2, score1);
    }

    private String getUserPreferredCategory(User user) {
        if (user.getPlaylist() == null || user.getPlaylist().isEmpty()) return null;

        return user.getPlaylist().stream()
                .map(item -> {
                    try {
                        Course course = courseRepository.findById(item.getCourseId()).orElse(null);
                        return course != null ? course.getCategory() : null;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(cat -> cat, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private List<Course> getCategoryBasedRecommendations(String category, Set<String> excludeIds) {
        return courseRepository.findAll().stream()
                .filter(course -> category.equals(course.getCategory()))
                .filter(course -> !excludeIds.contains(course.getId()))
                .sorted(Comparator.comparingDouble(Course::getRating).reversed())
                .limit(2)
                .collect(Collectors.toList());
    }

    private List<String> getUserSkills(User user) {
        if (user.getPlaylist() == null) return new ArrayList<>();

        return user.getPlaylist().stream()
                .map(item -> {
                    try {
                        Course course = courseRepository.findById(item.getCourseId()).orElse(null);
                        return course != null ? course.getSkills() : new ArrayList<String>();
                    } catch (Exception e) {
                        return new ArrayList<String>();
                    }
                })
                .flatMap(List::stream)
                .distinct()
                .collect(Collectors.toList());
    }

    private List<Course> getSkillBasedRecommendations(List<String> userSkills, Set<String> excludeIds) {
        return courseRepository.findAll().stream()
                .filter(course -> !excludeIds.contains(course.getId()))
                .filter(course -> course.getSkills().stream().anyMatch(userSkills::contains))
                .sorted(Comparator.comparingDouble(Course::getRating).reversed())
                .limit(2)
                .collect(Collectors.toList());
    }

    private String getNextLevel(User user) {
        if (user.getPlaylist() == null || user.getPlaylist().isEmpty()) return "Beginner";

        Map<String, Long> levelCounts = user.getPlaylist().stream()
                .map(item -> {
                    try {
                        Course course = courseRepository.findById(item.getCourseId()).orElse(null);
                        return course != null ? course.getLevel() : null;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(level -> level, Collectors.counting()));

        String currentLevel = levelCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Beginner");

        // Suggest next level
        switch (currentLevel) {
            case "Beginner": return "Intermediate";
            case "Intermediate": return "Advanced";
            default: return "Advanced";
        }
    }

    private List<Course> getLevelBasedRecommendations(String level, Set<String> excludeIds) {
        return courseRepository.findAll().stream()
                .filter(course -> level.equals(course.getLevel()))
                .filter(course -> !excludeIds.contains(course.getId()))
                .sorted(Comparator.comparingDouble(Course::getRating).reversed())
                .limit(2)
                .collect(Collectors.toList());
    }

    private List<Course> getCollaborativeRecommendations(String userId, Set<String> excludeIds) {
        Set<String> currentUserCourses = getUserPlaylistIds(userRepository.findById(userId).orElse(null));

        // Find users with similar playlists (most courses in common)
        List<User> similarUsers = userRepository.findAll().stream()
                .filter(user -> !userId.equals(user.getId()))
                .filter(user -> user.getPlaylist() != null && !user.getPlaylist().isEmpty())
                .map(user -> {
                    Set<String> otherUserCourses = getUserPlaylistIds(user);
                    Set<String> intersection = new HashSet<>(currentUserCourses);
                    intersection.retainAll(otherUserCourses);
                    return new AbstractMap.SimpleEntry<>(user, intersection.size());
                })
                .filter(entry -> entry.getValue() > 0) // Only users with at least one common course
                .sorted((e1, e2) -> Integer.compare(e2.getValue(), e1.getValue())) // Sort by similarity (most common courses first)
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Get courses from similar users that current user hasn't taken
        Set<String> recommendedCourseIds = new HashSet<>();
        for (User similarUser : similarUsers) {
            Set<String> similarUserCourses = getUserPlaylistIds(similarUser);
            similarUserCourses.removeAll(excludeIds);
            recommendedCourseIds.addAll(similarUserCourses);
        }

        return courseRepository.findAllById(recommendedCourseIds).stream()
                .sorted(Comparator.comparingDouble(Course::getRating).reversed())
                .limit(2)
                .collect(Collectors.toList());
    }

    private List<Course> getPopularCourses(Set<String> excludeIds) {
        List<Course> courses = courseRepository.findAll().stream()
                .filter(c -> excludeIds == null || !excludeIds.contains(c.getId()))
                .sorted(Comparator.comparingLong(Course::getViews).reversed()
                        .thenComparing(Comparator.comparingInt(Course::getEnrolledStudents).reversed()))
                .limit(LIMIT)
                .collect(Collectors.toList());
        ensurePosters(courses);
        return courses;
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max);
    }

    public List<Course> getAdvancedRecommendations(RecommendationRequest request) {
        String userId = request.getUserId();
        Set<String> excludeIds = userId != null ? getUserPlaylistIds(userRepository.findById(userId).orElse(null)) : new HashSet<>();

        List<Course> recommendations = courseRepository.findAll().stream()
                .filter(course -> !excludeIds.contains(course.getId()))
                .filter(course -> matchesPreferences(course, request))
                .sorted(this::compareByRelevance)
                .limit(LIMIT)
                .collect(Collectors.toList());

        // If not enough recommendations, fill with popular courses matching preferences
        if (recommendations.size() < LIMIT) {
            List<Course> popularCourses = courseRepository.findAll().stream()
                    .filter(course -> !excludeIds.contains(course.getId()))
                    .filter(course -> matchesPreferences(course, request))
                    .sorted(Comparator.comparingLong(Course::getViews).reversed())
                    .limit(LIMIT - recommendations.size())
                    .collect(Collectors.toList());
            recommendations.addAll(popularCourses);
        }

        ensurePosters(recommendations);
        return recommendations;
    }

    private boolean matchesPreferences(Course course, RecommendationRequest request) {
        // Category filter
        if (request.getPreferredCategories() != null && !request.getPreferredCategories().isEmpty()) {
            if (course.getCategory() == null || !request.getPreferredCategories().contains(course.getCategory())) {
                return false;
            }
        }

        // Skills filter
        if (request.getPreferredSkills() != null && !request.getPreferredSkills().isEmpty()) {
            boolean hasMatchingSkill = course.getSkills().stream()
                    .anyMatch(skill -> request.getPreferredSkills().contains(skill));
            if (!hasMatchingSkill) {
                return false;
            }
        }

        // Level filter
        if (request.getPreferredLevel() != null && !request.getPreferredLevel().isEmpty()) {
            if (!request.getPreferredLevel().equals(course.getLevel())) {
                return false;
            }
        }

        // Price filter
        if (request.getMaxPrice() != null && request.getMaxPrice() > 0) {
            if (course.getPrice() > request.getMaxPrice()) {
                return false;
            }
        }

        // Language filter
        if (request.getLanguage() != null && !request.getLanguage().isEmpty()) {
            if (!request.getLanguage().equalsIgnoreCase(course.getLanguage())) {
                return false;
            }
        }

        // Duration filter
        if (request.getMaxDuration() != null && request.getMaxDuration() > 0) {
            if (course.getDuration() > request.getMaxDuration()) {
                return false;
            }
        }

        return true;
    }

    private void ensurePosters(List<Course> courses) {
        for (Course course : courses) {
            if (course.getPoster() == null) {
                Course.Poster poster = new Course.Poster();
                poster.setUrl("https://picsum.photos/300/200?random=" + course.getTitle().hashCode());
                course.setPoster(poster);
            }
            if (course.getPrice() == 0) {
                course.setPrice(9.99);
            }
        }
    }
}
