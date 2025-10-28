import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useUserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // <-- Add uploading state
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/profile');
            setProfile(response.data);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            setError(err.response?.data?.message || "Could not load profile data.");
            toast.error("Failed to load profile.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = useCallback(async (updateData) => {
        setIsUpdating(true);
        setError(null);
        try {
            const response = await apiClient.put('/profile', updateData);
            setProfile(response.data);
            toast.success("Profile updated successfully!");
            return true;
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(err.response?.data?.message || "Could not update profile.");
            toast.error(err.response?.data?.message || "Profile update failed.");
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, []);

    // --- Add Upload Picture Function ---
    const uploadProfilePicture = useCallback(async (file) => {
        if (!file) {
            toast.error("No file selected.");
            return false;
        }
        // Basic frontend validation (backend has stricter checks)
        if (file.size > 5 * 1024 * 1024) { // ~5MB
             toast.error("File size exceeds 5MB limit.");
             return false;
        }
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
             toast.error("Invalid file type. Please upload a JPG, PNG, or GIF.");
             return false;
        }

        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file); // 'file' must match @RequestParam in backend

        try {
            const response = await apiClient.post('/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Axios usually sets this with FormData
                },
            });
            setProfile(response.data); // Update profile state with new data (including Base64 image)
            toast.success("Profile picture updated successfully!");
            return true;
        } catch (err) {
            console.error("Failed to upload profile picture:", err);
            const errMsg = err.response?.data?.message || err.response?.data?.error || "Could not upload picture.";
            setError(errMsg);
            toast.error(`Upload failed: ${errMsg}`);
            return false;
        } finally {
            setIsUploading(false);
        }
    }, []);
    // ------------------------------------

    return {
        profile,
        isLoading,
        isUpdating,
        isUploading, // <-- Expose uploading state
        error,
        fetchProfile,
        updateProfile,
        uploadProfilePicture, // <-- Expose upload function
    };
};