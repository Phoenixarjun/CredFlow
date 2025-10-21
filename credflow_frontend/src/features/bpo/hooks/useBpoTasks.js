import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useBpoTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/bpo/tasks/my-queue');
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch BPO tasks:", error);
            toast.error("Failed to fetch task queue.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const claimTask = useCallback(async (taskId) => {
        try {
            const response = await apiClient.put(`/bpo/tasks/${taskId}/claim`);
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.taskId === taskId ? response.data : task
                )
            );
            toast.success("Task claimed!");
        } catch (error) {
            console.error("Failed to claim task:", error);
            toast.error(error.response?.data?.message || "Failed to claim task.");
        }
    }, []);

    const updateTask = useCallback(async (taskId, updateData) => {
        try {
            const response = await apiClient.put(`/bpo/tasks/${taskId}/update`, updateData);
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.taskId === taskId ? response.data : task
                )
            );
            toast.success("Task updated successfully.");
            return true; 
        } catch (error) {
            console.error("Failed to update task:", error);
            toast.error(error.response?.data?.message || "Failed to update task.");
            return false;
        }
    }, []);

    return { tasks, isLoading, fetchTasks, claimTask, updateTask };
};