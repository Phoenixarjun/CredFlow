import { useState, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useAdminCustomerSearch = () => {
    // --- State ---
    const [searchResults, setSearchResults] = useState([]);
    const [customerHistory, setCustomerHistory] = useState(null);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isLoadingCure, setIsLoadingCure] = useState(false);
    const [searchedQuery, setSearchedQuery] = useState('');
    const [viewingHistoryFor, setViewingHistoryFor] = useState(null);
    
    // State for AI Summary
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [aiSummary, setAiSummary] = useState(null); // Initialize as null
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

    // --- Search Customers ---
    const searchCustomers = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            toast.error("Please enter at least 2 characters to search.");
            return;
        }
        setIsLoadingSearch(true);
        setSearchResults([]);
        setCustomerHistory(null);
        setViewingHistoryFor(null);
        setSearchedQuery(query);
        setAiSummary(null); // Clear summary on new search
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
        if (!customerId) {
            toast.error("Invalid Customer ID provided.");
            return;
        }
        setIsLoadingHistory(true);
        setCustomerHistory(null);
        setAiSummary(null); // Clear previous summary
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

    // --- Manual Cure ---
    const manuallyCureCustomer = useCallback(async (customerId, reason) => {
        if (!customerId || !reason) {
            toast.error("Customer ID and reason are required.");
            return false;
        }
        setIsLoadingCure(true);
        try {
            await apiClient.post(`/admin/customers/${customerId}/manual-cure`, { reason });
            toast.success(`Manual cure initiated for customer ${customerId}.`);
            if (viewingHistoryFor?.id === customerId && customerHistory) {
                await fetchCustomerHistory(customerId, viewingHistoryFor.name);
            }
            setIsLoadingCure(false);
            return true;
        } catch (error) {
            console.error("Failed to manually cure customer:", error);
            toast.error(error.response?.data?.message || "Manual cure failed.");
            setIsLoadingCure(false);
            return false;
        }
    }, [fetchCustomerHistory, viewingHistoryFor, customerHistory]);

    // --- Clear Results ---
    const clearSearchResultsAndHistory = useCallback(() => {
        setSearchResults([]);
        setCustomerHistory(null);
        setSearchedQuery('');
        setViewingHistoryFor(null);
        setAiSummary(null);
        setIsSummaryModalOpen(false);
    }, []);

    // --- AI Summary Functions ---
    const fetchAiSummary = useCallback(async (customerId) => {
        if (!customerId) {
            toast.error("Invalid Customer ID provided.");
            return;
        }
        setIsLoadingSummary(true);
        setAiSummary(null);
        setIsSummaryModalOpen(true);
        try {
            // Call the endpoint that returns the structured JSON
            const response = await apiClient.get(`/admin/customers/${customerId}/ai-summary`);
            setAiSummary(response.data); // Set state to the JSON object
            toast.success("AI Summary generated!");
        } catch (error) {
            console.error("Failed to generate AI summary:", error);
            const errorMsg = error.response?.data?.message || "AI summary generation failed.";
            // Set an error-like object to display in the modal
            setAiSummary({
                riskLevel: "Error",
                executiveSummary: `Failed to generate summary: ${errorMsg}`,
                financials: null,
                keyIssues: [],
                recentActivity: []
            });
            toast.error(errorMsg);
        } finally {
            setIsLoadingSummary(false);
        }
    }, []);

    const closeSummaryModal = useCallback(() => {
        setIsSummaryModalOpen(false);
    }, []);

    // --- Return Values ---
    return {
        searchResults,
        customerHistory,
        isLoadingSearch,
        isLoadingHistory,
        isLoadingCure,
        searchCustomers,
        fetchCustomerHistory,
        manuallyCureCustomer,
        clearSearchResultsAndHistory,
        searchedQuery,
        viewingHistoryFor,
        // AI Summary values
        isLoadingSummary,
        aiSummary,
        isSummaryModalOpen,
        fetchAiSummary,
        closeSummaryModal
    };
};