import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useAdminPlans = () => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAllPlans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/admin/plans');
            console.log("Fetched Plans:", response.data);
            setPlans(response.data);
        } catch (error) {
            console.error("Failed to fetch plans:", error);
            toast.error("Failed to load plans.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllPlans();
    }, [fetchAllPlans]);

    const createPlan = useCallback(async (planData) => {
        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/admin/plans', planData);
            setPlans(currentPlans => [response.data, ...currentPlans]);
            toast.success("Plan created successfully!");
            setIsSubmitting(false);
            return true;
        } catch (error) {
            console.error("Failed to create plan:", error);
            toast.error(error.response?.data?.message || "Failed to create plan.");
            setIsSubmitting(false);
            return false; 
        }
    }, []);

    const updatePlan = useCallback(async (planId, planData) => {
        setIsSubmitting(true);
        try {
            const response = await apiClient.put(`/admin/plans/${planId}`, planData);
            setPlans(currentPlans => 
                currentPlans.map(p => p.planId === planId ? response.data : p)
            );
            toast.success("Plan updated successfully!");
            setIsSubmitting(false);
            return true; 
        } catch (error) {
            console.error("Failed to update plan:", error);
            toast.error(error.response?.data?.message || "Failed to update plan.");
            setIsSubmitting(false);
            return false; 
        }
    }, []);

    return { 
        plans, 
        isLoadingPlans: isLoading, 
        isSubmittingPlan: isSubmitting,
        refetchPlans: fetchAllPlans,
        createPlan,
        updatePlan 
    };
};