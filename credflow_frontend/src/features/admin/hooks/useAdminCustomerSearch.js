import { useState, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useAdminCustomerSearch = () => {
    // ... existing state ...
    const [searchResults, setSearchResults] = useState([]);
    const [customerHistory, setCustomerHistory] = useState(null);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isLoadingCure, setIsLoadingCure] = useState(false); // <-- Add loading state for cure
    const [searchedQuery, setSearchedQuery] = useState('');
    const [viewingHistoryFor, setViewingHistoryFor] = useState(null);

    // --- Search Customers ---
    const searchCustomers = useCallback(async (query) => {
        // ... existing implementation ...
        if (!query || query.trim().length < 2) {
            toast.error("Please enter at least 2 characters to search.");
            return;
        }
        setIsLoadingSearch(true);
        setSearchResults([]);
        setCustomerHistory(null);
        setViewingHistoryFor(null);
        setSearchedQuery(query);
        try {
            const response = await apiClient.get('/admin/customers/search', {
                params: { query: query.trim() }
            });
            setSearchResults(response.data);
            if (response.data.length === 0) {
                toast.info(`No customers found matching "${query.trim()}".`);
            } else {
                 toast.success(`Found ${response.data.length} customer(s).`);
            }
        } catch (error) {
            console.error("Failed to search customers:", error);
            toast.error(error.response?.data?.message || "Failed to search customers.");
        } finally {
            setIsLoadingSearch(false);
        }
    }, []);

    // --- Fetch History ---
    const fetchCustomerHistory = useCallback(async (customerId, customerName) => {
        // ... existing implementation ...
        if (!customerId) {
            toast.error("Invalid Customer ID provided.");
            return;
        }
        setIsLoadingHistory(true);
        setCustomerHistory(null);
        setViewingHistoryFor({ id: customerId, name: customerName });
        try {
            const response = await apiClient.get(`/admin/customers/${customerId}/history`);
            setCustomerHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch customer history:", error);
             setViewingHistoryFor(null);
            if (error.response?.status === 404) {
                 toast.error(`Customer history not found for ID ${customerId}.`);
            } else {
                 toast.error(error.response?.data?.message || "Failed to load customer history.");
            }
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    // --- ADD MANUAL CURE FUNCTION ---
    const manuallyCureCustomer = useCallback(async (customerId, reason) => {
        if (!customerId || !reason) {
            toast.error("Customer ID and reason are required.");
            return false; // Indicate failure
        }
        setIsLoadingCure(true);
        try {
            await apiClient.post(`/admin/customers/${customerId}/manual-cure`, { reason });
            toast.success(`Manual cure initiated for customer ${customerId}.`);
            // Refresh history after curing
            if (viewingHistoryFor?.id === customerId && customerHistory) {
                 await fetchCustomerHistory(customerId, viewingHistoryFor.name);
            }
            setIsLoadingCure(false);
            return true; // Indicate success
        } catch (error) {
            console.error("Failed to manually cure customer:", error);
            toast.error(error.response?.data?.message || "Manual cure failed.");
            setIsLoadingCure(false);
            return false; // Indicate failure
        }
    }, [fetchCustomerHistory, viewingHistoryFor, customerHistory]); // Add dependencies

    // --- Clear Results ---
    const clearSearchResultsAndHistory = useCallback(() => {
        // ... existing implementation ...
        setSearchResults([]);
        setCustomerHistory(null);
        setSearchedQuery('');
        setViewingHistoryFor(null);
    }, []);

    return {
        searchResults,
        customerHistory,
        isLoadingSearch,
        isLoadingHistory,
        isLoadingCure, // <-- Expose cure loading state
        searchCustomers,
        fetchCustomerHistory,
        manuallyCureCustomer, // <-- Expose cure function
        clearSearchResultsAndHistory,
        searchedQuery,
        viewingHistoryFor
    };
};