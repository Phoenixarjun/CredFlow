import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useAdminStats = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLiveStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/admin/dashboard/stats-live');
            console.log("Fetched Live Stats:", response.data);
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch live stats:", error);
            toast.error("Failed to load live stats.");
            setStats(null); // Set to null on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch stats on initial load
    useEffect(() => {
        fetchLiveStats();
    }, [fetchLiveStats]);

    // Return the state and the refetch function
    return { stats, isLoadingStats: isLoading, fetchLiveStats };
};