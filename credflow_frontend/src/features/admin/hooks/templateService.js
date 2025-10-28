import apiClient from '@/services/apiClient';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTemplates = async () => {
    const response = await apiClient.get('/admin/templates', {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const fetchTemplateById = async (templateId) => {
    const response = await apiClient.get(`/admin/templates/${templateId}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const createTemplate = async (templateData) => {
    const response = await apiClient.post('/admin/templates', templateData, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const updateTemplate = async (templateId, templateData) => {
    const response = await apiClient.put(`/admin/templates/${templateId}`, templateData, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const deleteTemplate = async (templateId) => {
    await apiClient.delete(`/admin/templates/${templateId}`, {
        headers: getAuthHeaders(),
    });
};

export const generateTemplateContentAi = async (requestData) => {
    const response = await apiClient.post('/admin/templates/ai/generate', requestData, {
        headers: getAuthHeaders(),
    });
    return response.data;
};