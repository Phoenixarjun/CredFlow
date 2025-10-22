import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useBpoPerformance = () => {
    const [stats, setStats] = useState({ totalTasksResolved: 0, totalCallsLogged: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/bpo/my-performance');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch performance stats:", error);
            toast.error("Failed to load performance stats.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, isLoadingStats: isLoading, refetchStats: fetchStats };
};