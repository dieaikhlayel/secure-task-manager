package com.example.securetaskmanager.service;

import com.example.securetaskmanager.entity.AuditLog;
import com.example.securetaskmanager.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(String username, String action, String details) {
        AuditLog entry = AuditLog.builder()
                .username(username)
                .action(action)
                .details(details)
                .build();
        auditLogRepository.save(entry);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getLogsForUser(String username) {
        return auditLogRepository.findAllByUsernameOrderByTimestampDesc(username);
    }
}