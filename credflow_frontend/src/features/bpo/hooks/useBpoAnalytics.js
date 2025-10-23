import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

/**
 * Helper function to format a date as a short string (e.g., "Oct 23")
 */
const formatShortDate = (date) => {
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Processes the raw task trend data.
 * The API only returns days where tasks were completed.
 * This function creates a full 7-day array, filling in 0s for missing days.
 */
const processTaskTrendData = (apiData) => {
    const today = new Date();
    const trendData = [];
    
    // Create an array for the last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Format the date to 'YYYY-MM-DD' to match the SQL query result
        // Note: The native SQL query returns 'completedDate' as a string.
        const dateString = date.toISOString().split('T')[0];
        
        // Find the data for this specific day from the API
        const apiDayData = apiData.find(d => d.completedDate === dateString);
        
        trendData.push({
            name: formatShortDate(date), // e.g., "Oct 23" (for the X-axis)
            tasks: apiDayData ? Number(apiDayData.count) : 0 // The count, or 0
        });
    }
    return trendData;
};


export const useBpoAnalytics = () => {
    const [taskTrend, setTaskTrend] = useState([]);
    const [outcomeBreakdown, setOutcomeBreakdown] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBpoStats = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch both endpoints in parallel
            const [trendRes, outcomeRes] = await Promise.all([
                apiClient.get('/bpo/analytics/task-trend'),
                apiClient.get('/bpo/analytics/outcome-breakdown')
            ]);

            // Process the trend data to fill in missing days
            setTaskTrend(processTaskTrendData(trendRes.data));
            
            // Set the outcome data (it's ready to be used by the pie chart)
            setOutcomeBreakdown(outcomeRes.data);

        } catch (error) {
            console.error("Failed to fetch BPO analytics:", error);
            toast.error("Failed to load performance charts.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBpoStats();
    }, [fetchBpoStats]);

    return { 
        taskTrend, 
        outcomeBreakdown, 
        isLoading,
        refetchBpoStats: fetchBpoStats 
    };
};