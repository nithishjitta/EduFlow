package com.elearning.elearningserver.service;

import com.elearning.elearningserver.exception.AppException;
import com.elearning.elearningserver.model.Course;
import com.elearning.elearningserver.model.User;
import com.elearning.elearningserver.repository.CourseRepository;
import com.elearning.elearningserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired(required = false)
    private CloudinaryService cloudinaryService;
    private final EmailService emailService;
    private final StatsService statsService;

    // ── Register ─────────────────────────────────────────────────────────────
    public User register(String name, String email, String password, MultipartFile avatarFile)
            throws IOException {
        if (userRepository.existsByEmail(email))
            throw new AppException("User Already Exist", HttpStatus.CONFLICT);

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        if (avatarFile != null && !avatarFile.isEmpty()) {
            if (!cloudinaryService.isAvailable()) {
                throw new AppException("Image upload service is not available", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            var uploaded = cloudinaryService.uploadImage(avatarFile);

            User.Avatar avatar = new User.Avatar();
            avatar.setPublicId(uploaded.get("publicId"));
            avatar.setUrl(uploaded.get("url"));
            user.setAvatar(avatar);
        }

        User saved = userRepository.save(user);
        statsService.refreshStats();
        return saved;
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Incorrect Email or Password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new AppException("Incorrect Email or Password", HttpStatus.UNAUTHORIZED);

        return user;
    }

    // ── Get Profile ───────────────────────────────────────────────────────────
    public User getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        // Ensure subscription is initialized
        if (user.getSubscription() == null) {
            user.setSubscription(new User.Subscription());
        }
        return user;
    }

    // ── Change Password ───────────────────────────────────────────────────────
    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = getProfile(userId);
        if (!passwordEncoder.matches(oldPassword, user.getPassword()))
            throw new AppException("Incorrect Old Password", HttpStatus.BAD_REQUEST);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // ── Update Profile ────────────────────────────────────────────────────────
    public User updateProfile(String userId, String name, String email) {
        User user = getProfile(userId);
        if (name != null) user.setName(name);
        if (email != null) user.setEmail(email);
        return userRepository.save(user);
    }

    // ── Update Profile Picture ────────────────────────────────────────────────
    public User updateProfilePicture(String userId, MultipartFile file) throws IOException {
        if (!cloudinaryService.isAvailable()) {
            throw new AppException("Image upload service is not available", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        User user = getProfile(userId);

        // Delete old image from Cloudinary
        if (user.getAvatar() != null && user.getAvatar().getPublicId() != null && cloudinaryService.isAvailable())
            cloudinaryService.deleteImage(user.getAvatar().getPublicId());

        var uploaded = cloudinaryService.uploadImage(file);

        User.Avatar avatar = new User.Avatar();
        avatar.setPublicId(uploaded.get("publicId"));
        avatar.setUrl(uploaded.get("url"));
        user.setAvatar(avatar);

        return userRepository.save(user);
    }

    // ── Forget Password ───────────────────────────────────────────────────────
    public void forgetPassword(String email, String frontendUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.BAD_REQUEST));

        String resetToken = generateResetToken();
        String hashedToken = sha256(resetToken);

        user.setResetPasswordToken(hashedToken);
        user.setResetPasswordExpire(new Date(System.currentTimeMillis() + 15 * 60 * 1000));
        userRepository.save(user);

        String url = frontendUrl + "/resetpassword/" + resetToken;
        String message = "Click on the link to reset your password. " + url +
                ". If you have not requested then please ignore.";

        emailService.sendEmail(user.getEmail(), "E-Learning Reset Password", message);
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    public void resetPassword(String token, String newPassword) {
        String hashedToken = sha256(token);

        User user = userRepository.findAll().stream()
                .filter(u -> hashedToken.equals(u.getResetPasswordToken())
                        && u.getResetPasswordExpire() != null
                        && u.getResetPasswordExpire().after(new Date()))
                .findFirst()
                .orElseThrow(() -> new AppException("Token is invalid or has been expired", HttpStatus.UNAUTHORIZED));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpire(null);
        userRepository.save(user);
    }

    // ── Add to Playlist ───────────────────────────────────────────────────────
    public User addToPlaylist(String userId, String courseId) {
        User user = getProfile(userId);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Invalid Course Id", HttpStatus.NOT_FOUND));

        boolean exists = user.getPlaylist().stream()
                .anyMatch(p -> courseId.equals(p.getCourseId()));
        if (exists) throw new AppException("Item Already Exist", HttpStatus.CONFLICT);

        User.PlaylistItem item = new User.PlaylistItem();
        item.setCourseId(course.getId());
        item.setPoster(course.getPoster() != null ? course.getPoster().getUrl() : null);
        user.getPlaylist().add(item);

        return userRepository.save(user);
    }

    // ── Remove from Playlist ──────────────────────────────────────────────────
    public User removeFromPlaylist(String userId, String courseId) {
        User user = getProfile(userId);
        courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException("Invalid Course Id", HttpStatus.NOT_FOUND));

        user.getPlaylist().removeIf(p -> courseId.equals(p.getCourseId()));
        return userRepository.save(user);
    }

    // ── Admin: Get All Users ──────────────────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ── Admin: Toggle User Role ───────────────────────────────────────────────
    public User updateUserRole(String userId) {
        User user = getProfile(userId);
        user.setRole("user".equals(user.getRole()) ? "admin" : "user");
        return userRepository.save(user);
    }

    // ── Admin: Delete User ────────────────────────────────────────────────────
    public void deleteUser(String userId) throws IOException {
        User user = getProfile(userId);
        if (user.getAvatar() != null && user.getAvatar().getPublicId() != null && cloudinaryService.isAvailable())
            cloudinaryService.deleteImage(user.getAvatar().getPublicId());
        userRepository.deleteById(userId);
        statsService.refreshStats();
    }

    // ── Delete My Profile ─────────────────────────────────────────────────────
    public void deleteMyProfile(String userId) throws IOException {
        deleteUser(userId);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String generateResetToken() {
        byte[] bytes = new byte[20];
        new SecureRandom().nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 error", e);
        }
    }
}