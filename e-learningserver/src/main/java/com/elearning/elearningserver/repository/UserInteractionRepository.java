package com.elearning.elearningserver.repository;

import com.elearning.elearningserver.model.UserInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface UserInteractionRepository extends MongoRepository<UserInteraction, String> {

    List<UserInteraction> findByUserId(String userId);

    List<UserInteraction> findByUserIdAndAction(String userId, String action);

    List<UserInteraction> findByUserIdAndCourseId(String userId, String courseId);

    List<UserInteraction> findByUserIdAndTimestampBetween(String userId, Date startDate, Date endDate);

    @Query("{'userId': ?0, 'action': {$in: ['view', 'enroll', 'complete']}}")
    List<UserInteraction> findEngagementInteractions(String userId);

    List<UserInteraction> findByActionAndTimestampBetween(String action, Date startDate, Date endDate);
}
