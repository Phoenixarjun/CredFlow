import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const usePlans = () => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/plans');
            setPlans(response.data);
        } catch (error) {
            console.error("Failed to fetch plans:", error);
            toast.error("Failed to load available plans.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    return { plans, isLoadingPlans: isLoading, refetchPlans: fetchPlans };
};

export const useSelectPlan = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectPlan = useCallback(async (accountId, planId) => {
        if (!accountId || !planId) return false;
        
        setIsSubmitting(true);
        try {
            await apiClient.post(`/customer/accounts/${accountId}/select-plan`, { planId });
            toast.success("Plan successfully selected!");
            setIsSubmitting(false);
            return true;
        } catch (error) {
            console.error("Failed to select plan:", error);
            toast.error(error.response?.data?.message || "Failed to select plan.");
            setIsSubmitting(false);
            return false;
        }
    }, []);

    return { selectPlan, isSubmittingPlan: isSubmitting };
};