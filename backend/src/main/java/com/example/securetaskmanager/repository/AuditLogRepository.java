package com.example.securetaskmanager.repository;

import com.example.securetaskmanager.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByUsernameOrderByTimestampDesc(String username);
}