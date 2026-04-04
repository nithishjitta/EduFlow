package com.elearning.elearningserver.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import java.util.Arrays;

@Component
public class CookieUtil {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public void addTokenCookie(HttpServletResponse response, String token) {
    // ✅ Use ResponseCookie instead of Cookie — it supports SameSite
    ResponseCookie cookie = ResponseCookie.from("token", token)
        .httpOnly(true)
        .maxAge(15 * 24 * 60 * 60) // 15 days
        .path("/")
        .secure(true)           // ✅ Required for SameSite=None
        .sameSite("None")       // ✅ Required for cross-origin cookie
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
}

    public void clearTokenCookie(HttpServletResponse response) {
    ResponseCookie cookie = ResponseCookie.from("token", "")
        .httpOnly(true)
        .maxAge(0)
        .path("/")
        .secure(true)
        .sameSite("None")
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
}

    public String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}