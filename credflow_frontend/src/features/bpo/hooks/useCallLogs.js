import { useState, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useCallLogs = (taskId) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch logs for the given task ID
    const fetchLogs = useCallback(async () => {
        if (!taskId) return;
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/bpo/tasks/${taskId}/logs`);
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch call logs:", error);
            toast.error("Failed to load call logs.");
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    // Create a new call log
    const createLog = useCallback(async (logData) => {
        if (!taskId) return false;
        
        try {
            const response = await apiClient.post(`/bpo/tasks/${taskId}/log-call`, logData);
            
            setLogs(prevLogs => [response.data, ...prevLogs]);
            toast.success("Call log saved.");
            return true; 
        } catch (error) {
            console.error("Failed to create call log:", error);
            toast.error(error.response?.data?.message || "Failed to save log.");
            return false; 
        }
    }, [taskId]);

    return { logs, isLoadingLogs: isLoading, fetchLogs, createLog };
};