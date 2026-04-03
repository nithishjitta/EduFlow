package com.elearning.elearningserver.service;

import com.elearning.elearningserver.model.Stats;
import com.elearning.elearningserver.repository.CourseRepository;
import com.elearning.elearningserver.repository.StatsRepository;
import com.elearning.elearningserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final StatsRepository statsRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    // Called by scheduler on 1st of each month (replaces nodeCron)
    public void createMonthlyStats() {
        statsRepository.save(new Stats());
    }

    // Called whenever users or courses change (replaces MongoDB .watch())
    public void refreshStats() {
        ensureStatsExist();

        List<Stats> statsList = statsRepository.findTop1ByOrderByCreatedAtDesc();
        if (statsList.isEmpty()) return;

        Stats stats = statsList.get(0);

        long users = userRepository.count();
        long subscriptions = userRepository.countBySubscriptionStatus("active");
        long totalViews = courseRepository.findAll()
                .stream().mapToLong(c -> c.getViews()).sum();

        stats.setUsers((int) users);
        stats.setSubscription((int) subscriptions);
        stats.setViews(totalViews);
        stats.setCreatedAt(new Date());

        statsRepository.save(stats);
    }

    private void ensureStatsExist() {
        if (statsRepository.count() == 0) {
            statsRepository.save(new Stats());
        }
    }

    // Used by getDashboardStats (replaces otherController getDashboardStats)
    public List<Stats> getLast12MonthsStats() {
        List<Stats> stats = statsRepository.findTop12ByOrderByCreatedAtDesc();
        // Reverse to get chronological order
        java.util.Collections.reverse(stats);
        return stats;
    }
}