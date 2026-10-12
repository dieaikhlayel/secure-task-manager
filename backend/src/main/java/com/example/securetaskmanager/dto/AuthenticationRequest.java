package com.example.securetaskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthenticationRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}