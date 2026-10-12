package com.example.securetaskmanager.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthenticationResponse {
    private String token;
    private String username;
}