package com.hostel.service;

import com.hostel.config.JwtService;
import com.hostel.dto.auth.AuthResponse;
import com.hostel.dto.auth.LoginRequest;
import com.hostel.dto.auth.RegisterRequest;
import com.hostel.entity.HostelBlock;
import com.hostel.entity.User;
import com.hostel.enums.Role;
import com.hostel.repository.HostelBlockRepository;
import com.hostel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final HostelBlockRepository hostelBlockRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Register a new user. Validates email uniqueness and hostel block for students.
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }

        User.UserBuilder builder = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .phone(request.getPhone())
                .roomNumber(request.getRoomNumber());

        // Link student to hostel block
        if (role == Role.STUDENT && request.getHostelBlockId() != null) {
            HostelBlock block = hostelBlockRepository.findById(request.getHostelBlockId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Hostel block not found: " + request.getHostelBlockId()));
            builder.hostelBlock(block);
        }

        User user = userRepository.save(builder.build());

        // Generate token with role claim
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        String token = jwtService.generateToken(claims, user);

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }

    /**
     * Authenticate an existing user and return a JWT.
     */
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        String token = jwtService.generateToken(claims, user);

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }
}
