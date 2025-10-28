package com.project.credflow.service.inter;

import com.project.credflow.dto.UpdateProfileRequestDto;
import com.project.credflow.dto.UserProfileDto;
import com.project.credflow.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProfileService {


    UserProfileDto getUserProfile(User currentUser);


    UserProfileDto updateUserProfile(User currentUser, UpdateProfileRequestDto updateDto);

    UserProfileDto updateProfilePicture(User currentUser, MultipartFile file) throws IOException;
}