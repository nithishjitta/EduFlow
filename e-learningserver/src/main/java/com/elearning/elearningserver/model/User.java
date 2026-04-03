package com.elearning.elearningserver.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String role = "user"; // "user" | "admin"

    private Subscription subscription = new Subscription();

    private String stripeCustomerId;

    private Avatar avatar;

    private List<PlaylistItem> playlist = new ArrayList<>();

    private Date createdAt = new Date();

    private String resetPasswordToken;
    private Date resetPasswordExpire;

    @Data
    @NoArgsConstructor
    public static class Subscription {
        private String id;
        private String status; // "active" | "inactive" | "pending"
    }

    @Data
    @NoArgsConstructor
    public static class Avatar {
        private String publicId;
        private String url;
    }

    @Data
    @NoArgsConstructor
    public static class PlaylistItem {
        private String courseId;
        private String poster;
    }
}