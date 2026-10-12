package com.example.securetaskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskRequest {

    @NotBlank
    @Size(max = 255)
    private String description;

    private boolean completed;
}