import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useMyCallLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/bpo/my-call-logs');
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch call logs:", error);
            toast.error("Failed to load your call log history.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, isLoadingLogs: isLoading, refetchLogs: fetchLogs };
};