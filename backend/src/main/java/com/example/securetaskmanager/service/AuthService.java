package com.example.securetaskmanager.service;

import com.example.securetaskmanager.dto.AuthenticationRequest;
import com.example.securetaskmanager.dto.AuthenticationResponse;
import com.example.securetaskmanager.dto.RegisterRequest;
import com.example.securetaskmanager.entity.User;
import com.example.securetaskmanager.repository.UserRepository;
import com.example.securetaskmanager.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        auditLogService.log(user.getUsername(), "USER_REGISTERED", "New account created");

        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token, user.getUsername());
    }

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        auditLogService.log(user.getUsername(), "USER_LOGGED_IN", "Login successful");

        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token, user.getUsername());
    }
}