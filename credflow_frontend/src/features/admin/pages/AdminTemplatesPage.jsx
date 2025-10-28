import React, { useState, useEffect } from 'react';
import { Flex, Heading, Text, Box, Button, Callout, Card } from '@radix-ui/themes';
import { PlusIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useNotificationTemplates } from '../hooks/useNotificationTemplates';
import TemplatesTable from '../components/TemplatesTable';
import TemplateFormModal from '../components/TemplateFormModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminTemplatesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Destructure ALL needed values from the hook, including generateTemplateAi
    const {
        templates,
        loading,
        error,
        isMutating,
        fetchTemplates,
        addTemplate,
        editTemplate,
        removeTemplate,
        generateTemplateAi, // <<< ENSURE THIS IS DESTRUCTURED
    } = useNotificationTemplates();

    useEffect(() => {
        console.log("AdminTemplatesPage: useEffect mounting, calling fetchTemplates.");
        fetchTemplates();
    }, [fetchTemplates]);

    useEffect(() => {
        console.log("AdminTemplatesPage: templates state updated:", templates);
    }, [templates]);

    const handleOpenModal = (template = null) => {
        console.log("Opening modal for template:", template);
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    const handleSaveTemplate = async (formData) => {
        try {
            if (selectedTemplate && selectedTemplate.templateId) {
                await editTemplate(selectedTemplate.templateId, formData);
            } else {
                await addTemplate(formData);
            }
            handleCloseModal();
        } catch (saveError) {
            console.error("Failed to save template (caught in page):", saveError);
        }
    };

    const handleDeleteTemplate = async (templateId, templateName) => {
        if (window.confirm(`Are you sure you want to delete "${templateName}"? This might affect Dunning Rules.`)) {
            try {
                await removeTemplate(templateId, templateName);
            } catch (deleteError) {
                console.error("Failed to delete template (caught in page):", deleteError);
            }
        }
    };

    const isBusy = loading || isMutating;

    console.log('AdminTemplatesPage Render - Loading:', loading, 'Error:', error, 'Templates:', templates);
    // Add a log to check the function reference being passed
    console.log('AdminTemplatesPage Render - generateTemplateAi type:', typeof generateTemplateAi);

    return (
        <Flex direction="column" gap="6">
            <Flex justify="between" align="center">
                <Box>
                    <Heading size="7">Notification Templates</Heading>
                    <Text color="gray">
                        Manage Email and SMS templates used for automated notifications.
                    </Text>
                </Box>
                <Button size="3" onClick={() => handleOpenModal(null)} disabled={isBusy}>
                    <PlusIcon /> Create New Template
                </Button>
            </Flex>

            {loading && <LoadingSpinner text="Loading templates..." />}

            {error && !loading && (
                <Callout.Root color="red" role="alert">
                    <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                    <Callout.Text>Error loading templates: {error}</Callout.Text>
                </Callout.Root>
            )}

            {!loading && !error && (
                 <Card>
                    <TemplatesTable
                        templates={templates}
                        onEdit={handleOpenModal}
                        onDelete={handleDeleteTemplate}
                    />
                 </Card>
            )}

            {/* Pass the actual generateTemplateAi function from the hook */}
            <TemplateFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTemplate}
                template={selectedTemplate}
                isSaving={isMutating}
                generateTemplateAi={generateTemplateAi} // <<< PASS THE FUNCTION
            />
        </Flex>
    );
};

export default AdminTemplatesPage;