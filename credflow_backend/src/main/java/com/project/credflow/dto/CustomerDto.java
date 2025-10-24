package com.project.credflow.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CustomerDto {
    private UUID customerId;
    private String fullName;
    private String companyName;
    private String address;
    private String contactPerson;

    private String email;
    private String phoneNumber;
}