import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useAllBpoTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/admin/bpo/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch all BPO tasks:", error);
            toast.error("Failed to load all BPO tasks.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { tasks, isLoadingTasks: isLoading, refetchTasks: fetchTasks };
};