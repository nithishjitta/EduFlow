package com.elearning.elearningserver.security;

import com.elearning.elearningserver.model.User;
import com.elearning.elearningserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component("authChecker")
@RequiredArgsConstructor
public class AuthChecker {

    private final UserRepository userRepository;

    /**
     * Returns true if the authenticated user has an active subscription OR is an admin.
     * Used in @PreAuthorize("hasRole('ADMIN') or @authChecker.isSubscriber(authentication)")
     */
    public boolean isSubscriber(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return false;

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetails userDetails)) return false;

        return userRepository.findById(userDetails.getUsername())
                .map(user -> "active".equals(
                        user.getSubscription() != null ? user.getSubscription().getStatus() : null)
                        || "admin".equals(user.getRole()))
                .orElse(false);
    }
}