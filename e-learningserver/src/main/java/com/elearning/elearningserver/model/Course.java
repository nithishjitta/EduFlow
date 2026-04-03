package com.elearning.elearningserver.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    private String title;
    private String description;
    private String shortDescription;

    private List<Lecture> lectures = new ArrayList<>();

    private Poster poster;

    private long views = 0;
    private int numOfVideos = 0;

    private String category;
    private String level = "Beginner"; // Beginner | Intermediate | Advanced
    private double duration = 0;
    private double price = 0;
    private double originalPrice = 0;
    private String language = "English";
    private double rating = 0;
    private int numOfReviews = 0;
    private int enrolledStudents = 0;

    private List<String> skills = new ArrayList<>();
    private List<String> prerequisites = new ArrayList<>();
    private List<String> learningObjectives = new ArrayList<>();

    private boolean certificate = true;
    private Date lastUpdated = new Date();

    private Instructor instructor;

    private String createdBy;
    private Date createdAt = new Date();

    @Data
    @NoArgsConstructor
    public static class Lecture {
        private String id;
        private String title;
        private String description;
        private int duration = 0;
        private Video video;
    }

    @Data
    @NoArgsConstructor
    public static class Video {
        private String publicId;
        private String url;
    }

    @Data
    @NoArgsConstructor
    public static class Poster {
        private String publicId;
        private String url;
    }

    @Data
    @NoArgsConstructor
    public static class Instructor {
        private String name;
        private String bio;
        private Avatar avatar;
        private double rating = 0;
        private int studentsCount = 0;
        private int coursesCount = 0;
    }

    @Data
    @NoArgsConstructor
    public static class Avatar {
        private String publicId;
        private String url;
    }
}