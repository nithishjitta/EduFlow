package com.elearning.elearningserver;

import com.elearning.elearningserver.model.Course;
import com.elearning.elearningserver.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        // Update existing courses to ensure they have posters and prices
        List<Course> existingCourses = courseRepository.findAll();
        boolean updated = false;
        for (Course course : existingCourses) {
            if (course.getPoster() == null || course.getPoster().getUrl() == null || course.getPoster().getUrl().isEmpty()) {
                Course.Poster poster = new Course.Poster();
                poster.setUrl("https://picsum.photos/300/200?random=" + course.getTitle().hashCode());
                course.setPoster(poster);
                updated = true;
            }
            if (course.getPrice() == 0) {
                course.setPrice(9.99);
                updated = true;
            }
        }
        if (updated) {
            courseRepository.saveAll(existingCourses);
            System.out.println("Existing courses updated with posters and prices.");
        }

        if (courseRepository.count() == 0) {
            // Seed sample courses with detailed data
            List<Course> sampleCourses = createSampleCourses();
            courseRepository.saveAll(sampleCourses);
            System.out.println("Sample courses seeded.");
        }
    }

    private List<Course> createSampleCourses() {
        return Arrays.asList(
            createCourse("Complete React & Node.js Fullstack Bootcamp",
                "Build production-ready web apps with React hooks, Redux, Node.js, Express, and MongoDB.",
                "Web Development", "Alex Turner", 9, 42, 18400, 4.9, 4200, 24, "Intermediate"),
            createCourse("Python for Machine Learning & AI",
                "Master Python, NumPy, Pandas, Scikit-learn and TensorFlow. Build real ML models from scratch.",
                "Machine Learning", "Priya Sharma", 8, 56, 22100, 4.8, 6800, 32, "Beginner"),
            createCourse("Data Structures & Algorithms Masterclass",
                "Crack coding interviews. Arrays, Trees, Graphs, DP, Sorting, Searching -- everything you need.",
                "Data Structure & Algorithm", "Karan Mehta", 7, 38, 14300, 4.9, 3100, 28, "Advanced"),
            createCourse("Flutter & Dart: Complete Mobile App Development",
                "Build beautiful cross-platform iOS and Android apps using Flutter with Firebase.",
                "App Development", "Neha Patel", 9, 64, 10900, 4.7, 2400, 35, "Intermediate"),
            createCourse("Unity Game Development: 2D & 3D Games",
                "Create your own games using Unity and C#. From 2D platformers to 3D action games.",
                "Game Development", "Rohan Das", 8, 48, 8700, 4.8, 1900, 30, "Beginner"),
            createCourse("Data Science with Python & R",
                "End-to-end data science: EDA, visualization, statistical modeling, and storytelling with data.",
                "Data Science", "Ananya Roy", 9, 52, 16500, 4.8, 5400, 38, "Intermediate"),
            createCourse("Ethical Hacking & Cybersecurity Fundamentals",
                "Penetration testing, network security, cryptography, and real-world attack defense.",
                "Cybersecurity", "Vikram Singh", 10, 44, 12200, 4.7, 2800, 26, "Intermediate"),
            createCourse("AWS & Cloud Computing: Zero to Professional",
                "Master AWS services, serverless, containers, CI/CD. Prepare for AWS certifications.",
                "Cloud Computing", "Siddharth Rao", 10, 60, 9800, 4.9, 2100, 40, "Beginner"),
            createCourse("UI/UX Design Masterclass: Figma to Prototype",
                "Design stunning interfaces. Figma, design systems, user research, wireframes, and prototypes.",
                "UI/UX Design", "Divya Menon", 7, 36, 13400, 4.8, 3700, 22, "Beginner"),
            createCourse("Blockchain Development & Web3 Fundamentals",
                "Build decentralized applications on Ethereum. Solidity, smart contracts, DeFi, and NFTs.",
                "Blockchain", "Arjun Verma", 9, 40, 7600, 4.6, 1400, 30, "Advanced"),
            createCourse("Advanced CSS & Modern Animations",
                "Master CSS Grid, Flexbox, custom properties, keyframe animations and 3D transforms.",
                "Web Development", "Meera Krishnan", 6, 28, 11200, 4.7, 2900, 18, "Intermediate"),
            createCourse("Deep Learning with PyTorch",
                "Build neural networks, CNNs, RNNs, Transformers, and LLMs from scratch with PyTorch.",
                "Machine Learning", "Dr. Rahul Bose", 10, 58, 9100, 4.9, 1700, 44, "Advanced"),
            createCourse("TypeScript for React Developers",
                "Level up your React apps with TypeScript. Types, interfaces, generics, and advanced patterns.",
                "Web Development", "Aditya Gupta", 8, 32, 9400, 4.8, 2300, 20, "Intermediate"),
            createCourse("SQL & PostgreSQL: Database Mastery",
                "From SELECT to advanced window functions, stored procedures, and performance tuning.",
                "Data Science", "Sunita Nair", 7, 34, 12800, 4.7, 4100, 24, "Beginner"),
            createCourse("Docker & Kubernetes: DevOps Essentials",
                "Containerize applications, orchestrate with Kubernetes, and master CI/CD pipelines.",
                "Cloud Computing", "Ravi Kumar", 10, 46, 8200, 4.8, 1600, 32, "Intermediate")
        );
    }

    private Course createCourse(String title, String description, String category, String createdBy,
                               double price, int numOfVideos, long views, double rating,
                               int enrolledStudents, double duration, String level) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setCategory(category);
        course.setCreatedBy(createdBy);
        course.setViews(views);
        course.setNumOfVideos(numOfVideos);
        course.setEnrolledStudents(enrolledStudents);
        course.setRating(rating);
        course.setLevel(level);
        course.setLanguage("English");
        course.setDuration(duration);
        course.setPrice(Math.min(price, 10)); // Cap at 10 as per frontend
        course.setSkills(Arrays.asList("Skill1", "Skill2"));
        course.setCreatedAt(new Date());
        course.setLastUpdated(new Date());

        // Set poster based on category
        Course.Poster poster = new Course.Poster();
        String imageUrl = getImageForCategory(category);
        poster.setUrl(imageUrl);
        course.setPoster(poster);

        return course;
    }

    private String getImageForCategory(String category) {
        switch (category) {
            case "Web Development": return "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80";
            case "Data Science": return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80";
            case "Data Structure & Algorithm": return "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80";
            case "App Development": return "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80";
            case "Game Development": return "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&q=80";
            case "Cybersecurity": return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80";
            case "Cloud Computing": return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80";
            case "UI/UX Design": return "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80";
            case "Machine Learning": return "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80";
            case "Blockchain": return "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&q=80";
            default: return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80";
        }
    }
}
