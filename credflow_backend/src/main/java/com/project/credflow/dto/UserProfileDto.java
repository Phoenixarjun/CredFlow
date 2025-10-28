package com.project.credflow.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

// DTO to display combined User and Customer profile information
@Data
public class UserProfileDto {
    private UUID userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private LocalDateTime userCreatedAt;
    private String roleName;

    private UUID customerId;
    private String companyName;
    private String address;
    private String contactPerson;
    private LocalDateTime customerCreatedAt;

    private String profilePictureBase64;
}