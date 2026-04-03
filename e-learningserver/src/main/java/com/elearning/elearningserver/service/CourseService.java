package com.elearning.elearningserver.service;

import com.elearning.elearningserver.exception.AppException;
import com.elearning.elearningserver.model.Course;
import com.elearning.elearningserver.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    @Autowired(required = false)
    private CloudinaryService cloudinaryService;
    private final StatsService statsService;
    private final MongoTemplate mongoTemplate;

    // ── Get All Courses ───────────────────────────────────────────────────────
    public List<Course> getAllCourses(String keyword, String category) {
        Query query = new Query();
        if (keyword != null && !keyword.isEmpty())
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        if (category != null && !category.isEmpty())
            query.addCriteria(Criteria.where("category").regex(category, "i"));

        // Exclude lectures for list view (like .select("-lectures"))
        query.fields().exclude("lectures");
        List<Course> courses = mongoTemplate.find(query, Course.class);

        // Ensure each course has a poster
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

        return courses;
    }

    // ── Create Course ─────────────────────────────────────────────────────────
    public Course createCourse(String title, String description, String category,
                               String createdBy, MultipartFile posterFile) throws IOException {
        if (title == null || description == null || category == null || createdBy == null)
            throw new AppException("Please add all fields", HttpStatus.BAD_REQUEST);

        if (!cloudinaryService.isAvailable()) {
            throw new AppException("Image upload service is not available", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        var uploaded = cloudinaryService.uploadImage(posterFile);

        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setCategory(category);
        course.setCreatedBy(createdBy);

        Course.Poster poster = new Course.Poster();
        poster.setPublicId(uploaded.get("publicId"));
        poster.setUrl(uploaded.get("url"));
        course.setPoster(poster);

        Course saved = courseRepository.save(course);
        statsService.refreshStats();
        return saved;
    }

    // ── Get Course Lectures ───────────────────────────────────────────────────
    public Course getCourseLectures(String courseId) {
        Course course = getCourseById(courseId);
        course.setViews(course.getViews() + 1);
        return courseRepository.save(course);
    }

    // ── Add Lecture ───────────────────────────────────────────────────────────
    public Course addLecture(String courseId, String title, String description,
                             MultipartFile videoFile) throws IOException {
        Course course = getCourseById(courseId);

        if (!cloudinaryService.isAvailable()) {
            throw new AppException("Video upload service is not available", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        var uploaded = cloudinaryService.uploadVideo(videoFile);

        Course.Video video = new Course.Video();
        video.setPublicId(uploaded.get("publicId"));
        video.setUrl(uploaded.get("url"));

        Course.Lecture lecture = new Course.Lecture();
        lecture.setId(UUID.randomUUID().toString());
        lecture.setTitle(title);
        lecture.setDescription(description);
        lecture.setVideo(video);

        course.getLectures().add(lecture);
        course.setNumOfVideos(course.getLectures().size());

        return courseRepository.save(course);
    }

    // ── Delete Course ─────────────────────────────────────────────────────────
    public void deleteCourse(String courseId) throws IOException {
        Course course = getCourseById(courseId);

        if (course.getPoster() != null && cloudinaryService.isAvailable())
            cloudinaryService.deleteImage(course.getPoster().getPublicId());

        for (Course.Lecture lecture : course.getLectures()) {
            if (lecture.getVideo() != null && cloudinaryService.isAvailable())
                cloudinaryService.deleteVideo(lecture.getVideo().getPublicId());
        }

        courseRepository.deleteById(courseId);
        statsService.refreshStats();
    }

    // ── Delete Lecture ────────────────────────────────────────────────────────
    public Course deleteLecture(String courseId, String lectureId) throws IOException {
        Course course = getCourseById(courseId);

        Course.Lecture lecture = course.getLectures().stream()
                .filter(l -> lectureId.equals(l.getId()))
                .findFirst()
                .orElseThrow(() -> new AppException("Lecture not found", HttpStatus.NOT_FOUND));

        if (lecture.getVideo() != null && cloudinaryService.isAvailable())
            cloudinaryService.deleteVideo(lecture.getVideo().getPublicId());

        course.getLectures().removeIf(l -> lectureId.equals(l.getId()));
        course.setNumOfVideos(course.getLectures().size());

        return courseRepository.save(course);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    public Course getCourseById(String courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Course not found", HttpStatus.NOT_FOUND));
    }
}