import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/authentication/context/AuthContext';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';
import {
    createTemplate as apiCreateTemplate,
    updateTemplate as apiUpdateTemplate,
    deleteTemplate as apiDeleteTemplate,
    generateTemplateContentAi as apiGenerateTemplateAi
} from './templateService';

export const useNotificationTemplates = () => {
    const { user } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMutating, setIsMutating] = useState(false);

    const fetchTemplates = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No authorization token found.");
            setLoading(false);
            setTemplates([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            console.log("FETCH: Attempting fetch...");
            const response = await apiClient.get('/admin/templates', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            console.log('FETCH: API Response Data:', data);
            if (data && Array.isArray(data)) {
                const sortedData = [...data].sort((a, b) => a.templateName.localeCompare(b.templateName));
                setTemplates(sortedData);
                console.log('FETCH: setTemplates called.');
            } else {
                 console.error('FETCH: Invalid data received from API:', data);
                 setError('Received invalid data format from server.');
                 setTemplates([]);
            }
        } catch (err) {
            console.error("FETCH: API call failed:", err);
            const errMsg = err.response?.data?.message || err.message || 'Failed to fetch templates.';
            setError(errMsg);
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const currentToken = user?.token;
        console.log("HOOK useEffect: Token check:", currentToken);
        if (currentToken) {
            fetchTemplates();
        } else {
             console.log("HOOK useEffect: No token, skipping fetch.");
            setError("User not authenticated.");
            setTemplates([]);
            setLoading(false);
        }
    }, [user?.token, fetchTemplates]);


    const addTemplate = useCallback(async (templateData) => {
        setIsMutating(true);
        setError(null);
        try {
            const newTemplate = await apiCreateTemplate(templateData);
            setTemplates(prev => [...prev, newTemplate].sort((a, b) => a.templateName.localeCompare(b.templateName)));
            toast.success(`Template "${newTemplate.templateName}" created successfully!`);
            return newTemplate;
        } catch (err) {
            console.error("ADD: Failed:", err);
            const errMsg = err.response?.data?.message || "Failed to create template.";
            setError(errMsg);
            toast.error(`Creation failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);

    const editTemplate = useCallback(async (templateId, templateData) => {
        setIsMutating(true);
        setError(null);
        try {
            const updatedTemplate = await apiUpdateTemplate(templateId, templateData);
            setTemplates(prev =>
                prev.map(t => (t.templateId === templateId ? updatedTemplate : t))
                    .sort((a, b) => a.templateName.localeCompare(b.templateName))
            );
            toast.success(`Template "${updatedTemplate.templateName}" updated successfully!`);
            return updatedTemplate;
        } catch (err) {
            console.error("EDIT: Failed:", err);
            const errMsg = err.response?.data?.message || "Failed to update template.";
            setError(errMsg);
            toast.error(`Update failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);

    const removeTemplate = useCallback(async (templateId, templateName) => {
        setIsMutating(true);
        setError(null);
        try {
            await apiDeleteTemplate(templateId);
            setTemplates(prev => prev.filter(t => t.templateId !== templateId));
            toast.success(`Template "${templateName}" deleted successfully!`);
        } catch (err) {
            console.error("DELETE: Failed:", err);
            let errMsg = err.response?.data?.message || "Failed to delete template.";
            if (err.response?.status === 409 || err.response?.data?.error?.includes('ConstraintViolation')) {
                 errMsg = "Cannot delete: Template is currently in use by a Dunning Rule.";
            }
            setError(errMsg);
            toast.error(`Deletion failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);

    const generateTemplateAi = useCallback(async (requestData) => {
        setIsMutating(true);
        setError(null);
        try {
            const result = await apiGenerateTemplateAi(requestData);
            toast.success("AI content generated successfully!");
            return result;
        } catch (err) {
            console.error("AI Generate: Failed:", err);
            const errMsg = err.response?.data?.message || err.message || "Failed to generate content.";
            setError(errMsg);
            toast.error(`AI generation failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);


    console.log("HOOK Render: Current templates state:", templates);

    // Ensure generateTemplateAi is included in the return object
    return {
        templates,
        loading,
        error,
        isMutating,
        fetchTemplates,
        addTemplate,
        editTemplate,
        removeTemplate,
        generateTemplateAi, // <<< MAKE SURE THIS IS RETURNED
    };
};