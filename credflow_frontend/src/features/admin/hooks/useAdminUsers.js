import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Fetch All Users ---
    const fetchAllUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    // --- Create User ---
    const createUser = useCallback(async (userData) => {
        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/admin/users', userData);
            setUsers(currentUsers => [response.data, ...currentUsers]); // Add new user to the top
            toast.success("User created successfully!");
            setIsSubmitting(false);
            return true; // Success
        } catch (error) {
            console.error("Failed to create user:", error);
            toast.error(error.response?.data?.message || "Failed to create user.");
            setIsSubmitting(false);
            return false; // Failure
        }
    }, []);

    // --- Update User ---
    const updateUser = useCallback(async (userId, userData) => {
        setIsSubmitting(true);
        try {
            // Ensure userId in DTO matches path param for consistency (backend also checks)
            const payload = { ...userData, userId }; 
            const response = await apiClient.put(`/admin/users/${userId}`, payload);
            setUsers(currentUsers => 
                currentUsers.map(u => u.userId === userId ? response.data : u)
            );
            toast.success("User updated successfully!");
            setIsSubmitting(false);
            return true;
        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error(error.response?.data?.message || "Failed to update user.");
            setIsSubmitting(false);
            return false; 
        }
    }, []);

    return { 
        users, 
        isLoadingUsers: isLoading, 
        isSubmittingUser: isSubmitting,
        refetchUsers: fetchAllUsers,
        createUser,
        updateUser 
    };
};