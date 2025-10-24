import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';


export const usePaginatedLogs = (endpointUrl, initialSort) => {
    const [data, setData] = useState(null); // Will store the full Page object { content: [], totalPages: 0, ... }
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0); // Current page (zero-indexed)
    const [sort, setSort] = useState(initialSort);
    const [pageSize, setPageSize] = useState(15);

    const fetchLogs = useCallback(async (pageToFetch) => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(endpointUrl, {
                params: {
                    page: pageToFetch,
                    size: pageSize,
                    sort: sort,
                }
            });
            setData(response.data); // Store the whole Page object
        } catch (error) {
            console.error(`Failed to fetch logs from ${endpointUrl}:`, error);
            toast.error("Failed to load logs.");
            setData(null); // Clear data on error
        } finally {
            setIsLoading(false);
        }
    }, [endpointUrl, pageSize, sort]);

    // Initial fetch on mount
    useEffect(() => {
        fetchLogs(page);
    }, [fetchLogs]); // Only run on mount (fetchLogs is memoized)

    // Handler to change page
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchLogs(newPage); // Fetch the new page of data
    };

    return {
        data: data, // The full Page object
        logContent: data?.content || [], // The array of logs
        totalPages: data?.totalPages || 0,
        currentPage: data?.number || 0, // 'number' is the current page index from Spring Page
        isLoading,
        handlePageChange,
    };
};