package com.elearning.elearningserver.repository;

import com.elearning.elearningserver.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByTitleRegexIgnoreCaseAndCategoryRegexIgnoreCase(String title, String category);
    List<Course> findTop3ByOrderByViewsDesc();
}