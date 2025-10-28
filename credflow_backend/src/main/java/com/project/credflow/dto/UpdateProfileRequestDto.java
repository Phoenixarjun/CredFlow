package com.project.credflow.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequestDto {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Size(max = 15, message = "Phone number cannot exceed 15 characters")
    private String phoneNumber;

    @Size(max = 100, message = "Company name cannot exceed 100 characters")
    private String companyName;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    @Size(max = 100, message = "Contact person name cannot exceed 100 characters")
    private String contactPerson;
}