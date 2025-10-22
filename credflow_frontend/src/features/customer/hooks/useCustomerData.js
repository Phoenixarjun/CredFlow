import { useState, useEffect, useCallback } from 'react'; 
import apiClient from '@/services/apiClient';
import { useAuth } from '@/features/authentication/context/AuthContext';

export const useCustomerData = () => {
    const { user } = useAuth(); 
    
    const [profile, setProfile] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [invoiceError, setInvoiceError] = useState(null);

    const [payments, setPayments] = useState([]);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const [profileResponse, accountsResponse] = await Promise.all([
                apiClient.get('/customer/profile'),
                apiClient.get('/customer/accounts')
            ]);
            setProfile(profileResponse.data);
            setAccounts(accountsResponse.data);
        } catch (err) {
            console.error("Failed to fetch customer data:", err);
            setError(err.response?.data?.message || 'Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    }, [user]); 

    useEffect(() => {
        fetchData();
    }, [fetchData]); 


    const fetchInvoicesForAccount = async (accountId) => {
        if (!accountId) {
            setInvoices([]);
            setSelectedAccountId(null);
            return;
        }

        setSelectedAccountId(accountId);
        setInvoiceLoading(true);
        setInvoiceError(null);
        setInvoices([]); 

        try {
            const response = await apiClient.get(`/customer/accounts/${accountId}/invoices`);
            setInvoices(response.data);
        } catch (err) {
            console.error("Failed to fetch invoices:", err);
            setInvoiceError(err.response?.data?.message || 'Failed to load invoices.');
        } finally {
            setInvoiceLoading(false);
        }
    };
    
    const fetchPaymentsForInvoice = async (invoiceId) => {
        if (!invoiceId) {
            setPayments([]);
            return;
        }
        
        setPaymentLoading(true);
        setPaymentError(null);
        setPayments([]); 

        try {
            const response = await apiClient.get(`/customer/invoices/${invoiceId}/payments`);
            setPayments(response.data);
        } catch (err) {
            console.error("Failed to fetch payments:", err);
            setPaymentError(err.response?.data?.message || 'Failed to load payments.');
        } finally {
            setPaymentLoading(false);
        }
    };

    return { 
        profile, 
        accounts, 
        loading, 
        error, 
        refetchData: fetchData, 
        
        invoices,
        invoiceLoading,
        invoiceError,
        fetchInvoicesForAccount,

        payments,
        paymentLoading,
        paymentError,
        fetchPaymentsForInvoice
    };
};