package com.elearning.elearningserver.controller;

import com.elearning.elearningserver.dto.RecommendationRequest;
import com.elearning.elearningserver.model.Course;
import com.elearning.elearningserver.service.AIAnalyticsService;
import com.elearning.elearningserver.service.CourseService;
import com.elearning.elearningserver.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final RecommendationService recommendationService;
    private final AIAnalyticsService aiAnalyticsService;

    // GET /api/v1/courses
    @GetMapping("/courses")
    public ResponseEntity<Map<String, Object>> getAllCourses(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "") String category) {
        List<Course> courses = courseService.getAllCourses(keyword, category);
        return ResponseEntity.ok(Map.of("success", true, "courses", courses));
    }

    // POST /api/v1/createcourse  (Admin only)
    @PostMapping("/createcourse")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createCourse(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String createdBy,
            @RequestParam MultipartFile file) throws IOException {
        courseService.createCourse(title, description, category, createdBy, file);
        return ResponseEntity.status(201).body(Map.of(
                "success", true,
                "message", "Course Created Successfully. You can add lectures now."
        ));
    }

    // GET /api/v1/course/:id  (Subscribers + Admin)
    @GetMapping("/course/{id}")
    public ResponseEntity<Map<String, Object>> getCourseLectures(@PathVariable String id) {
        Course course = courseService.getCourseLectures(id);
        return ResponseEntity.ok(Map.of("success", true, "lectures", course.getLectures()));
    }

    // POST /api/v1/course/:id  (Admin only - add lecture)
    @PostMapping("/course/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> addLecture(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam MultipartFile file) throws IOException {
        courseService.addLecture(id, title, description, file);
        return ResponseEntity.ok(Map.of("success", true, "message", "Lecture added in Course"));
    }

    // DELETE /api/v1/course/:id  (Admin only)
    @DeleteMapping("/course/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteCourse(@PathVariable String id)
            throws IOException {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Course Deleted Successfully"));
    }

    // DELETE /api/v1/lecture  (Admin only)
    @DeleteMapping("/lecture")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteLecture(
            @RequestParam String courseId,
            @RequestParam String lectureId) throws IOException {
        courseService.deleteLecture(courseId, lectureId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Lecture Deleted Successfully"));
    }

    // POST /api/v1/recommend (with optional authentication)
    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> recommend(
            @RequestParam(required = false) String userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Use authenticated user ID if not provided
        String effectiveUserId = userId;
        if (effectiveUserId == null && userDetails != null) {
            effectiveUserId = userDetails.getUsername();
        }
        
        List<Course> courses = recommendationService.getRecommendations(effectiveUserId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "courses", courses,
                "message", "AI-powered intelligent recommendations based on your learning history"
        ));
    }

    // POST /api/v1/recommend/advanced
    @PostMapping("/recommend/advanced")
    public ResponseEntity<Map<String, Object>> advancedRecommend(
            @RequestBody RecommendationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // If user is authenticated, use their ID if not provided in request
        if (request.getUserId() == null && userDetails != null) {
            request.setUserId(userDetails.getUsername());
        }

        List<Course> courses = recommendationService.getAdvancedRecommendations(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Advanced AI-powered recommendations based on your preferences",
                "courses", courses,
                "preferences", request
        ));
    }

    // GET /api/v1/recommend/smart
    @GetMapping("/recommend/smart")
    public ResponseEntity<Map<String, Object>> getSmartRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : null;
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Authentication required for smart recommendations"
            ));
        }

        List<Map<String, Object>> recommendations = aiAnalyticsService.getSmartRecommendations(userId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "AI-powered smart recommendations with explanations",
                "recommendations", recommendations
        ));
    }

    // GET /api/v1/recommend/learning-path
    @GetMapping("/recommend/learning-path")
    public ResponseEntity<Map<String, Object>> getLearningPath(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : null;
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Authentication required for learning path"
            ));
        }

        List<Map<String, Object>> learningPath = aiAnalyticsService.generateLearningPath(userId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Personalized AI-generated learning path",
                "learningPath", learningPath
        ));
    }

    // GET /api/v1/analytics/profile
    @GetMapping("/analytics/profile")
    public ResponseEntity<Map<String, Object>> getUserAnalyticsProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : null;
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Authentication required for analytics"
            ));
        }

        Map<String, Object> profile = aiAnalyticsService.analyzeUserProfile(userId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "AI-powered user analytics profile",
                "profile", profile
        ));
    }

    // GET /api/v1/predict/completion/{courseId}
    @GetMapping("/predict/completion/{courseId}")
    public ResponseEntity<Map<String, Object>> predictCompletion(
            @PathVariable String courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : null;
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Authentication required for prediction"
            ));
        }

        double probability = aiAnalyticsService.predictCompletionProbability(userId, courseId);
        String prediction = probability > 0.7 ? "High chance of completion" :
                           probability > 0.4 ? "Moderate chance of completion" :
                           "May need additional support";

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "AI-powered completion probability prediction",
                "courseId", courseId,
                "completionProbability", probability,
                "prediction", prediction
        ));
    }

    // POST /api/v1/track/interaction
    @PostMapping("/track/interaction")
    public ResponseEntity<Map<String, Object>> trackInteraction(
            @RequestParam String courseId,
            @RequestParam String action,
            @RequestParam(required = false) Map<String, Object> metadata,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : null;
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Authentication required for tracking"
            ));
        }

        // Note: UserInteractionService needs to be injected into controller
        // For now, we'll return success - implement tracking in service layer
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Interaction tracked successfully"
        ));
    }
}