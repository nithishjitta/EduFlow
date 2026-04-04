package com.elearning.elearningserver.controller;

import com.elearning.elearningserver.dto.LoginRequest;
import com.elearning.elearningserver.model.User;
import com.elearning.elearningserver.service.UserService;
import com.elearning.elearningserver.util.CookieUtil;
import com.elearning.elearningserver.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // POST /api/v1/register
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(required = false) MultipartFile file,
            HttpServletResponse response) throws IOException {

        User user = userService.register(name, email, password, file);
        String token = jwtUtil.generateToken(user.getId());
        cookieUtil.addTokenCookie(response, token);

        return ResponseEntity.status(201).body(success("Registered Successfully", user));
    }

    // POST /api/v1/login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {

        User user = userService.login(request.email, request.password);
        String token = jwtUtil.generateToken(user.getId());
        cookieUtil.addTokenCookie(response, token);

        return ResponseEntity.ok(success("Welcome back, " + user.getName(), user));
    }

    // GET /api/v1/logout
    @GetMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {
        cookieUtil.clearTokenCookie(response);
        return ResponseEntity.ok(success("Logged Out Successfully", null));
    }

    // GET /api/v1/me
   @GetMapping("/me")
public ResponseEntity<Map<String, Object>> getMyProfile(
        @AuthenticationPrincipal UserDetails userDetails) {
    if (userDetails == null) {
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Not authenticated")); // ✅ 401
    }
    User user = userService.getProfile(userDetails.getUsername());
    return ResponseEntity.ok(success(null, user));
}

    // DELETE /api/v1/me
    @DeleteMapping("/me")
    public ResponseEntity<Map<String, Object>> deleteMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletResponse response) throws IOException {
        userService.deleteMyProfile(userDetails.getUsername());
        cookieUtil.clearTokenCookie(response);
        return ResponseEntity.ok(success("User Deleted Successfully", null));
    }

    // PUT /api/v1/changepassword
    @PutMapping("/changepassword")
    public ResponseEntity<Map<String, Object>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        userService.changePassword(userDetails.getUsername(), oldPassword, newPassword);
        return ResponseEntity.ok(success("Password Changed Successfully", null));
    }

    // PUT /api/v1/updateprofile
    @PutMapping("/updateprofile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email) {
        User user = userService.updateProfile(userDetails.getUsername(), name, email);
        return ResponseEntity.ok(success("Profile Updated Successfully", user));
    }

    // PUT /api/v1/updateprofilepicture
    @PutMapping("/updateprofilepicture")
    public ResponseEntity<Map<String, Object>> updateProfilePicture(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam MultipartFile file) throws IOException {
        User user = userService.updateProfilePicture(userDetails.getUsername(), file);
        return ResponseEntity.ok(success("Profile Picture Updated Successfully", user));
    }

    // POST /api/v1/forgetpassword
    @PostMapping("/forgetpassword")
    public ResponseEntity<Map<String, Object>> forgetPassword(@RequestParam String email) {
        userService.forgetPassword(email, frontendUrl);
        return ResponseEntity.ok(success("Reset Token has been sent to " + email, null));
    }

    // PUT /api/v1/resetpassword/:token
    @PutMapping("/resetpassword/{token}")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @PathVariable String token,
            @RequestParam String password) {
        userService.resetPassword(token, password);
        return ResponseEntity.ok(success("Password Changed Successfully", null));
    }

    // POST /api/v1/addtoplaylist
    @PostMapping("/addtoplaylist")
    public ResponseEntity<Map<String, Object>> addToPlaylist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String id) {
        User user = userService.addToPlaylist(userDetails.getUsername(), id);
        return ResponseEntity.ok(success("Added to playlist", user));
    }

    // DELETE /api/v1/removefromplaylist
    @DeleteMapping("/removefromplaylist")
    public ResponseEntity<Map<String, Object>> removeFromPlaylist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String id) {
        User user = userService.removeFromPlaylist(userDetails.getUsername(), id);
        return ResponseEntity.ok(success("Removed From Playlist", user));
    }

    // ── Admin Routes ──────────────────────────────────────────────────────────

    // GET /api/v1/admin/users
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        return ResponseEntity.ok(Map.of("success", true, "users", userService.getAllUsers()));
    }

    // PUT /api/v1/admin/user/:id
    @PutMapping("/admin/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateUserRole(@PathVariable String id) {
        userService.updateUserRole(id);
        return ResponseEntity.ok(success("Role Updated", null));
    }

    // DELETE /api/v1/admin/user/:id
    @DeleteMapping("/admin/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String id)
            throws IOException {
        userService.deleteUser(id);
        return ResponseEntity.ok(success("User Deleted Successfully", null));
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private Map<String, Object> success(String message, Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        if (message != null) res.put("message", message);
        if (data != null) res.put("user", data);
        return res;
    }
}
