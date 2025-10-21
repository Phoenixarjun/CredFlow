import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

export const useCustomerInvoices = (statusFilter = null) => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            // Assuming you have an endpoint like this. Adjust if needed.
            // It might just fetch all invoices, and we filter on the frontend,
            // or the backend could accept a status filter.
            const response = await apiClient.get('/customer/invoices'); // Adjust endpoint if needed

            // Filter locally if statusFilter is provided
            let fetchedInvoices = response.data;
            if (statusFilter) {
                fetchedInvoices = fetchedInvoices.filter(inv => inv.status === statusFilter);
            }
            setInvoices(fetchedInvoices);

        } catch (error) {
            console.error("Failed to fetch customer invoices:", error);
            toast.error("Failed to load your invoices.");
            setInvoices([]); // Set empty on error
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter]); // Re-fetch if filter changes

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    return { invoices, isLoadingInvoices: isLoading, refetchInvoices: fetchInvoices };
};

// **Backend Note:** You'll need to create a `GET /api/customer/invoices` endpoint
// in a `CustomerController` that fetches invoices linked to the logged-in customer's account.