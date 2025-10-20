import { useState, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useAdminKpis = () => {
    const [kpis, setKpis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // This hook doesn't fetch on load
    // It provides a function for the page to call
    const fetchKpis = useCallback(async (dateRange) => {
        setIsLoading(true);
        try {
            const params = {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            };
            const response = await apiClient.get('/admin/dashboard/kpis-by-date', { params });
            console.log("Fetched KPIs for date range:", response.data);
            setKpis(response.data);
        } catch (error) {
            console.error("Failed to fetch KPIs:", error);
            toast.error("Failed to load KPIs for date range.");
            setKpis(null); // Set to null on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Return the state and the fetch function
    return { kpis, isLoadingKpis: isLoading, fetchKpis };
};