package com.project.credflow.controller;

import com.project.credflow.dto.UpdateProfileRequestDto;
import com.project.credflow.dto.UserProfileDto;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // <-- Import Slf4j
import org.springframework.http.HttpStatus; // <-- Import HttpStatus
import org.springframework.http.MediaType; // <-- Import MediaType
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // <-- Import MultipartFile
import org.springframework.web.server.ResponseStatusException; // <-- Import ResponseStatusException

import java.io.IOException; // <-- Import IOException

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j // <-- Add Slf4j
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserProfileDto> getMyProfile(@AuthenticationPrincipal User currentUser) {
        UserProfileDto profile = profileService.getUserProfile(currentUser);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileDto> updateMyProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateProfileRequestDto updateDto) {
        UserProfileDto updatedProfile = profileService.updateUserProfile(currentUser, updateDto);
        return ResponseEntity.ok(updatedProfile);
    }

    // --- ADD THIS ENDPOINT ---
    /**
     * Endpoint to upload/update the profile picture for the currently logged-in user.
     * Consumes multipart/form-data.
     */
    @PostMapping(value = "/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserProfileDto> uploadProfilePicture(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file) { // Use @RequestParam for the file part

        try {
            UserProfileDto updatedProfile = profileService.updateProfilePicture(currentUser, file);
            return ResponseEntity.ok(updatedProfile);
        } catch (IOException e) {
            log.error("IO Error uploading profile picture for user {}: {}", currentUser.getEmail(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read uploaded file.", e);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid profile picture upload attempt by user {}: {}", currentUser.getEmail(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error uploading profile picture for user {}: {}", currentUser.getEmail(), e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.", e);
        }
    }
}