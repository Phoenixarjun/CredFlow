import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

const toISODateString = (date) => {
    return date.toISOString().split('T')[0];
};

export const useAnalytics = () => {
    const [agingReport, setAgingReport] = useState(null);
    const [dunningActions, setDunningActions] = useState(null);
    const [collectionPerformance, setCollectionPerformance] = useState(null);
    const [bpoStatus, setBpoStatus] = useState(null);

    const [isLoadingAging, setIsLoadingAging] = useState(true);
    const [isLoadingDunning, setIsLoadingDunning] = useState(true);
    const [isLoadingCollection, setIsLoadingCollection] = useState(true);
    const [isLoadingBpo, setIsLoadingBpo] = useState(true);

    const [dateRange, setDateRange] = useState({
        startDate: toISODateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
        endDate: toISODateString(new Date()) // Today
    });

    const fetchStaticCharts = useCallback(async () => {
        setIsLoadingAging(true);
        setIsLoadingBpo(true);
        try {
            const [agingRes, bpoRes] = await Promise.all([
                apiClient.get('/admin/analytics/overdue-aging'),
                apiClient.get('/admin/analytics/bpo-status')
            ]);
            setAgingReport(agingRes.data);
            setBpoStatus(bpoRes.data);
        } catch (error) { toast.error("Failed to load static analytics charts."); } 
        finally {
            setIsLoadingAging(false);
            setIsLoadingBpo(false);
        }
    }, []);

    const fetchDateRangedCharts = useCallback(async () => {
        setIsLoadingDunning(true);
        setIsLoadingCollection(true);
        const params = { ...dateRange };
        try {
            const [dunningRes, collectionRes] = await Promise.all([
                apiClient.get('/admin/analytics/dunning-actions', { params }),
                apiClient.get('/admin/analytics/collection-performance', { params })
            ]);
            setDunningActions(dunningRes.data);
            setCollectionPerformance(collectionRes.data);
        } catch (error) { toast.error("Failed to load date-ranged analytics."); } 
        finally {
            setIsLoadingDunning(false);
            setIsLoadingCollection(false);
        }
    }, [dateRange]);

    useEffect(() => { fetchStaticCharts(); }, [fetchStaticCharts]);
    useEffect(() => { fetchDateRangedCharts(); }, [fetchDateRangedCharts]); 

    return {
        agingReport, dunningActions, collectionPerformance, bpoStatus,
        isLoading: isLoadingAging || isLoadingDunning || isLoadingCollection || isLoadingBpo,
        isLoadingAging, isLoadingDunning, isLoadingCollection, isLoadingBpo,
        dateRange, setDateRange
    };
};