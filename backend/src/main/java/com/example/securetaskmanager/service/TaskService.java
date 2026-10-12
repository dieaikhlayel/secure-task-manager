package com.example.securetaskmanager.service;

import com.example.securetaskmanager.dto.TaskRequest;
import com.example.securetaskmanager.dto.TaskResponse;
import com.example.securetaskmanager.entity.Task;
import com.example.securetaskmanager.entity.User;
import com.example.securetaskmanager.repository.TaskRepository;
import com.example.securetaskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksForUser(String username) {
        User user = loadUser(username);
        return taskRepository.findAllByUserIdOrderByIdDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public TaskResponse createTask(String username, TaskRequest request) {
        User user = loadUser(username);
        Task task = Task.builder()
                .description(request.getDescription())
                .completed(request.isCompleted())
                .user(user)
                .build();
        taskRepository.save(task);
        auditLogService.log(username, "TASK_CREATED", "Task #" + task.getId());
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(String username, Long id, TaskRequest request) {
        Task task = loadOwnedTask(username, id);
        task.setDescription(request.getDescription());
        task.setCompleted(request.isCompleted());
        taskRepository.save(task);
        auditLogService.log(username, "TASK_UPDATED", "Task #" + task.getId());
        return toResponse(task);
    }

    @Transactional
    public void deleteTask(String username, Long id) {
        Task task = loadOwnedTask(username, id);
        taskRepository.delete(task);
        auditLogService.log(username, "TASK_DELETED", "Task #" + id);
    }

    // --- helpers ---

    private User loadUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private Task loadOwnedTask(String username, Long id) {
        User user = loadUser(username);
        return taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Task not found or not owned by user"));
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .build();
    }
}