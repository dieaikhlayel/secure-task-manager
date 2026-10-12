package com.example.securetaskmanager.controller;

import com.example.securetaskmanager.entity.AuditLog;
import com.example.securetaskmanager.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getMyLogs(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(auditLogService.getLogsForUser(user.getUsername()));
    }
}