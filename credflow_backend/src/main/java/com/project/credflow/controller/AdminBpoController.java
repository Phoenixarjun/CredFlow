package com.project.credflow.controller;

import com.project.credflow.dto.BpoTaskDto;
import com.project.credflow.dto.UserDto;
import com.project.credflow.service.inter.BpoTaskService;
import com.project.credflow.service.inter.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bpo")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBpoController {

    private final UserService userService;
    private final BpoTaskService bpoTaskService;

    @GetMapping("/agents")
    public ResponseEntity<List<UserDto>> getAllBpoAgents() {
        List<UserDto> agents = userService.findUsersByRole("BPO_AGENT");
        return ResponseEntity.ok(agents);
    }


    @GetMapping("/tasks")
    public ResponseEntity<List<BpoTaskDto>> getAllBpoTasks() {
        List<BpoTaskDto> tasks = bpoTaskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
}