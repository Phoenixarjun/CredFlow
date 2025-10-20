import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/authentication/context/AuthContext';
import apiClient from '@/services/apiClient'; 

export const useDunningRules = () => {
    const { user } = useAuth();
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRules = useCallback(async () => {
        if (!user?.token) {
            setError("No authorization token found.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/admin/rules', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setRules(response.data);
        } catch (err) {
            console.error("Failed to fetch rules:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch rules.');
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    const addRule = async (ruleData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/admin/rules', ruleData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setRules(prevRules => [...prevRules, response.data]);
        } catch (err) {
            console.error("Failed to add rule:", err);
            setError(err.response?.data?.message || err.message || 'Failed to add rule.');
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    const updateRule = async (ruleId, ruleData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.put(`/admin/rules/${ruleId}`, ruleData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setRules(prevRules =>
                prevRules.map(rule =>
                    rule.ruleId === ruleId ? response.data : rule
                )
            );
        } catch (err) {
            console.error("Failed to update rule:", err);
            setError(err.response?.data?.message || err.message || 'Failed to update rule.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteRule = async (ruleId) => {
        setLoading(true);
        setError(null);
        try {
            await apiClient.delete(`/admin/rules/${ruleId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setRules(prevRules => prevRules.filter(rule => rule.ruleId !== ruleId));
        } catch (err) {
            console.error("Failed to delete rule:", err);
            setError(err.response?.data?.message || err.message || 'Failed to delete rule.');
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchRules();
        } else {
            setLoading(false);
        }
    }, [user, fetchRules]);

    return {
        rules,
        loading,
        error,
        fetchRules,
        addRule,
        updateRule,
        deleteRule,
    };
};