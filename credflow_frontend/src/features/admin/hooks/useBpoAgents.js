import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useBpoAgents = () => {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAgents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/admin/bpo/agents');
            setAgents(response.data);
        } catch (error) {
            console.error("Failed to fetch BPO agents:", error);
            toast.error("Failed to load BPO agents.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    return { agents, isLoadingAgents: isLoading, refetchAgents: fetchAgents };
};