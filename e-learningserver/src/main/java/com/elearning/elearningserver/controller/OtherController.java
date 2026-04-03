package com.elearning.elearningserver.controller;

import com.elearning.elearningserver.exception.AppException;
import com.elearning.elearningserver.model.Stats;
import com.elearning.elearningserver.service.EmailService;
import com.elearning.elearningserver.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OtherController {

    private final EmailService emailService;
    private final StatsService statsService;

    @Value("${app.contact-email}")
    private String contactEmail;

    // POST /api/v1/contact
    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> contact(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String message) {

        if (name == null || email == null || message == null)
            throw new AppException("All fields are mandatory", HttpStatus.BAD_REQUEST);

        String text = "I am " + name + " and my Email is " + email + ".\n" + message;
        emailService.sendEmail(contactEmail, "Contact from E-learning Platform", text);

        return ResponseEntity.ok(Map.of("success", true, "message", "Your Message Has Been Sent."));
    }

    // POST /api/v1/courserequest
    @PostMapping("/courserequest")
    public ResponseEntity<Map<String, Object>> courseRequest(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String course) {

        if (name == null || email == null || course == null)
            throw new AppException("All fields are mandatory", HttpStatus.BAD_REQUEST);

        String text = "I am " + name + " and my Email is " + email + ".\n" + course;
        emailService.sendEmail(contactEmail, "Requesting for a course on E-learning Platform", text);

        return ResponseEntity.ok(Map.of("success", true, "message", "Your Request Has Been Sent."));
    }

    // GET /api/v1/admin/stats
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Stats> stats = statsService.getLast12MonthsStats();

        // Pad to 12 entries if fewer months exist
        List<Stats> statsData = new ArrayList<>();
        int required = 12 - stats.size();
        for (int i = 0; i < required; i++) {
            statsData.add(new Stats()); // zeros
        }
        statsData.addAll(stats);

        // Latest month figures
        Stats latest = statsData.get(11);
        Stats prev   = statsData.get(10);

        int    usersCount        = latest.getUsers();
        int    subscriptionCount = latest.getSubscription();
        long   viewsCount        = latest.getViews();

        double usersPercentage = calcPercentage(latest.getUsers(), prev.getUsers());
        double viewsPercentage = calcPercentage(latest.getViews(), prev.getViews());
        double subPercentage   = calcPercentage(latest.getSubscription(), prev.getSubscription());

        // Map.of() only supports up to 10 entries — use HashMap for 11+
        Map<String, Object> response = new HashMap<>();
        response.put("success",                true);
        response.put("stats",                  statsData);
        response.put("usersCount",             usersCount);
        response.put("subscriptionCount",      subscriptionCount);
        response.put("viewsCount",             viewsCount);
        response.put("usersPercentage",        usersPercentage);
        response.put("viewsPercentage",        viewsPercentage);
        response.put("subscriptionPercentage", subPercentage);
        response.put("usersProfit",            usersPercentage >= 0);
        response.put("viewsProfit",            viewsPercentage >= 0);
        response.put("subscriptionProfit",     subPercentage >= 0);

        return ResponseEntity.ok(response);
    }

    private double calcPercentage(long current, long previous) {
        if (previous == 0) return current * 100.0;
        return ((double)(current - previous) / previous) * 100.0;
    }
}