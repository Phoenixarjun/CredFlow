package com.project.credflow.service.impl;

import com.project.credflow.dto.UpdateProfileRequestDto;
import com.project.credflow.dto.UserProfileDto;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.model.Customer;
import com.project.credflow.model.User;
import com.project.credflow.repository.CustomerRepository;
import com.project.credflow.repository.UserRepository;
import com.project.credflow.service.inter.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; // <-- Import

import java.io.IOException; // <-- Import
import java.util.Base64; // <-- Import
import java.util.Arrays; // <-- Import
import java.util.List;   // <-- Import

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    // --- ADD Image Validation Constants ---
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    // ------------------------------------

    private Customer getCustomerForUser(User user) {
        // Find associated customer profile, handling case where it might be optional depending on role
        return customerRepository.findByUser_UserId(user.getUserId()).orElse(null);
        // If Customer is MANDATORY for ROLE_CUSTOMER, keep the original .orElseThrow()
    }

    private UserProfileDto mapToUserProfileDto(User user, Customer customer) {
        UserProfileDto dto = new UserProfileDto();
        // User fields
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setUserCreatedAt(user.getCreatedAt());
        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getRoleName().name());
        }

        // --- Add Base64 Image Conversion ---
        if (user.getProfilePicture() != null && user.getProfilePicture().length > 0) {
            dto.setProfilePictureBase64("data:image/png;base64," + Base64.getEncoder().encodeToString(user.getProfilePicture()));
            // Note: Adjust "image/png" based on stored type if you save that info, otherwise assume PNG/JPEG is fine
        } else {
            dto.setProfilePictureBase64(null); // Explicitly set to null if no picture
        }
        // ----------------------------------

        // Customer fields
        if (customer != null) {
            dto.setCustomerId(customer.getCustomerId());
            dto.setCompanyName(customer.getCompanyName());
            dto.setAddress(customer.getAddress());
            dto.setContactPerson(customer.getContactPerson());
            dto.setCustomerCreatedAt(customer.getCreatedAt());
        }
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(User currentUser) {
        log.info("Fetching profile for user: {}", currentUser.getEmail());
        Customer customer = getCustomerForUser(currentUser); // Fetch customer regardless of role for mapping
        return mapToUserProfileDto(currentUser, customer);
    }

    @Override
    @Transactional
    public UserProfileDto updateUserProfile(User currentUser, UpdateProfileRequestDto updateDto) {
        // ... (existing implementation - no changes needed here) ...
        log.info("Updating profile for user: {}", currentUser.getEmail());

        boolean userUpdated = false;
        if (updateDto.getFullName() != null && !updateDto.getFullName().equals(currentUser.getFullName())) {
            currentUser.setFullName(updateDto.getFullName());
            userUpdated = true;
        }
        if (updateDto.getPhoneNumber() != null && !updateDto.getPhoneNumber().equals(currentUser.getPhoneNumber())) {
            currentUser.setPhoneNumber(updateDto.getPhoneNumber());
            userUpdated = true;
        }

        User savedUser = currentUser;
        if (userUpdated) {
            savedUser = userRepository.save(currentUser);
            log.info("User entity updated for user: {}", currentUser.getEmail());
        }

        Customer savedCustomer = null;
        // Check if customer profile exists before attempting to update
        Customer customer = getCustomerForUser(currentUser);
        if (customer != null) {
            boolean customerUpdated = false;

            if (updateDto.getCompanyName() != null) {
                if (customer.getCompanyName() == null || !customer.getCompanyName().equals(updateDto.getCompanyName())) {
                    customer.setCompanyName(updateDto.getCompanyName());
                    customerUpdated = true;
                }
            }
            if (updateDto.getAddress() != null) {
                if (customer.getAddress() == null || !customer.getAddress().equals(updateDto.getAddress())) {
                    customer.setAddress(updateDto.getAddress());
                    customerUpdated = true;
                }
            }
            if (updateDto.getContactPerson() != null) {
                if (customer.getContactPerson() == null || !customer.getContactPerson().equals(updateDto.getContactPerson())) {
                    customer.setContactPerson(updateDto.getContactPerson());
                    customerUpdated = true;
                }
            }

            if (customerUpdated) {
                savedCustomer = customerRepository.save(customer);
                log.info("Customer entity updated for user: {}", currentUser.getEmail());
            } else {
                savedCustomer = customer;
            }
        } else {
            log.warn("User {} has no customer profile, skipping customer fields update.", currentUser.getEmail());
        }

        return mapToUserProfileDto(savedUser, savedCustomer);
    }


    // --- IMPLEMENT New Method ---
    @Override
    @Transactional
    public UserProfileDto updateProfilePicture(User currentUser, MultipartFile file) throws IOException {
        log.info("Updating profile picture for user: {}", currentUser.getEmail());

        // 1. Validate the file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Profile picture file cannot be empty.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds the limit of 5 MB.");
        }
        if (!ALLOWED_MIME_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
        }

        // 2. Read bytes and update user
        byte[] imageBytes = file.getBytes();
        currentUser.setProfilePicture(imageBytes);

        // 3. Save user
        User updatedUser = userRepository.save(currentUser);
        log.info("Profile picture updated successfully for user: {}", currentUser.getEmail());

        // 4. Fetch customer (if exists) and return updated DTO
        Customer customer = getCustomerForUser(updatedUser);
        return mapToUserProfileDto(updatedUser, customer);
    }
    // --------------------------
}