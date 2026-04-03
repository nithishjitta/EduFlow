package com.elearning.elearningserver.security;

import com.elearning.elearningserver.model.User;
import com.elearning.elearningserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    // Spring Security calls loadUserByUsername — we store userId as the "username"
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        if (userId == null || userId.trim().isEmpty()) {
            throw new UsernameNotFoundException("User ID is null or empty");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        return new org.springframework.security.core.userdetails.User(
                user.getId(),
                user.getPassword() != null ? user.getPassword() : "",
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()))
        );
    }
}