import { useState, useCallback } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useTemplateActions = (setTemplates) => {
    const [isMutating, setIsMutating] = useState(false);
    const [mutationError, setMutationError] = useState(null);

    const addTemplate = useCallback(async (templateData) => {
        setIsMutating(true);
        setMutationError(null);
        try {
            const response = await apiClient.post('/admin/templates', templateData, {
                headers: getAuthHeaders(),
            });
            const newTemplate = response.data;
            setTemplates(prev => [...prev, newTemplate].sort((a, b) => a.templateName.localeCompare(b.templateName)));
            toast.success(`Template "${newTemplate.templateName}" created successfully!`);
            return newTemplate;
        } catch (err) {
            console.error("Failed to add template:", err);
            const errMsg = err.response?.data?.message || "Failed to create template.";
            setMutationError(errMsg);
            toast.error(`Creation failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, [setTemplates]);

    const editTemplate = useCallback(async (templateId, templateData) => {
        setIsMutating(true);
        setMutationError(null);
        try {
            const response = await apiClient.put(`/admin/templates/${templateId}`, templateData, {
                headers: getAuthHeaders(),
            });
            const updatedTemplate = response.data;
            setTemplates(prev =>
                prev.map(t => (t.templateId === templateId ? updatedTemplate : t))
                    .sort((a, b) => a.templateName.localeCompare(b.templateName))
            );
            toast.success(`Template "${updatedTemplate.templateName}" updated successfully!`);
            return updatedTemplate;
        } catch (err) {
            console.error("Failed to update template:", err);
            const errMsg = err.response?.data?.message || "Failed to update template.";
            setMutationError(errMsg);
            toast.error(`Update failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, [setTemplates]);

    const removeTemplate = useCallback(async (templateId, templateName) => {
        setIsMutating(true);
        setMutationError(null);
        try {
            await apiClient.delete(`/admin/templates/${templateId}`, {
                headers: getAuthHeaders(),
            });
            setTemplates(prev => prev.filter(t => t.templateId !== templateId));
            toast.success(`Template "${templateName}" deleted successfully!`);
        } catch (err) {
            console.error("Failed to delete template:", err);
            let errMsg = err.response?.data?.message || "Failed to delete template.";
            if (err.response?.status === 409 || err.response?.data?.error?.includes('ConstraintViolation')) {
                 errMsg = "Cannot delete: Template is currently in use by a Dunning Rule.";
            }
            setMutationError(errMsg);
            toast.error(`Deletion failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, [setTemplates]);

    const generateTemplateAi = useCallback(async (requestData) => {
        setIsMutating(true);
        setMutationError(null);
        try {
            const response = await apiClient.post('/admin/templates/ai/generate', requestData, {
                headers: getAuthHeaders(),
            });
            toast.success("AI content generated!");
            return response.data;
        } catch (err) {
            console.error("AI Generation failed:", err);
            const errMsg = err.response?.data?.message || err.message || "Failed to generate content.";
            setMutationError(errMsg);
            toast.error(`AI generation failed: ${errMsg}`);
            throw err;
        } finally {
            setIsMutating(false);
        }
    }, []);


    return {
        isMutatingTemplate: isMutating,
        templateMutationError: mutationError,
        addTemplate,
        editTemplate,
        removeTemplate,
        generateTemplateAi,
    };
};