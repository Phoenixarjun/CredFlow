import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/authentication/context/AuthContext';
import apiClient from '@/services/apiClient'; 

export const useNotificationTemplates = () => {
    const { user } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTemplates = useCallback(async () => {
        if (!user?.token) {
            setError("No authorization token found.");
            setLoading(false);
            return; 
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Attempting to fetch /admin/notification-templates..."); 
            const response = await apiClient.get('/admin/notification-templates', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                console.log('Fetched Templates Raw:', response); 
                setTemplates(response.data);
        } catch (err) {
            console.error("Failed to fetch templates:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch templates.');
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        if (user?.token) {
            fetchTemplates();
        } else {
            setLoading(false);
        }
    }, [user, fetchTemplates]);

    return { templates, loading: loading, error: error };
};