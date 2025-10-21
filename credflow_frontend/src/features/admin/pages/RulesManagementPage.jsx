import React, { useState } from 'react';
import { Flex, Heading, Text, Box, Button, Callout } from '@radix-ui/themes';
import { PlusIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

// --- Import Hooks ---
import { useDunningRules } from '../hooks/useDunningRules';
import { useNotificationTemplates } from '../hooks/useNotificationTemplates'; // <-- Import new hook

// --- Import Components ---
import RulesTable from '../components/RulesTable';
import RuleFormModal from '../components/RuleFormModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

const RulesManagementPage = () => {
    // --- State for the modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null); // null = new rule, object = edit rule

    // --- Data fetching hooks ---
    const { 
        rules, 
        loading: rulesLoading, 
        error: rulesError, 
        addRule, 
        updateRule, 
        deleteRule 
    } = useDunningRules();
    
    const { 
        templates, 
        loading: templatesLoading, 
        error: templatesError 
    } = useNotificationTemplates(); // <-- Use new hook
    // console.log('Templates in Page:', templates);
    // --- Handlers ---
    const handleOpenModal = (rule = null) => {
        setSelectedRule(rule);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRule(null);
    };

    const handleSaveRule = async (formData) => {
        // Use a try-catch to handle errors from the hook
        try {
            if (selectedRule && selectedRule.ruleId) {
                // Update existing rule
                await updateRule(selectedRule.ruleId, formData);
            } else {
                // Create new rule
                await addRule(formData);
            }
            handleCloseModal(); // Close modal only on success
        } catch (error) {
            // Error is already logged by the hook
            // You could show a toast notification here
            console.error("Failed to save rule:", error);
            // Don't close modal, so user can see and fix errors
        }
    };

    const handleDeleteRule = async (ruleId) => {
        if (window.confirm('Are you sure you want to delete this rule? This action cannot be undone.')) {
            try {
                await deleteRule(ruleId);
            } catch (error) {
                console.error("Failed to delete rule:", error);
            }
        }
    };

    // --- Loading & Error States ---
    const isLoading = rulesLoading || templatesLoading;
    const combinedError = rulesError || templatesError;

    return (
        <Flex direction="column" gap="6">
            {/* --- 1. Header --- */}
            <Flex justify="between" align="center">
                <Box>
                    <Heading size="7">Dunning Rules Management</Heading>
                    <Text color="gray">
                        Configure automated actions for overdue invoices.
                    </Text>
                </Box>
                <Button size="3" onClick={() => handleOpenModal(null)}>
                    <PlusIcon /> Create New Rule
                </Button>
            </Flex>

            {/* --- 2. Content Area --- */}
            {isLoading && <LoadingSpinner text="Loading rules data..." />}
            
            {combinedError && (
                <Callout.Root color="red" role="alert">
                    <Callout.Icon>
                        <ExclamationTriangleIcon />
                    </Callout.Icon>
                    <Callout.Text>
                        Error: {combinedError}
                    </Callout.Text>
                </Callout.Root>
            )}
            
            {!isLoading && !combinedError && (
                // --- Render the table ---
                <RulesTable 
                    rules={rules} 
                    onEdit={handleOpenModal} 
                    onDelete={handleDeleteRule} 
                />
            )}

            {/* --- 3. Modal --- */}
            {/* Render modal (it's hidden by default via Radix Dialog) */}
            <RuleFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRule}
                rule={selectedRule}
                templates={templates} // <-- Pass templates to the form
            />
        </Flex>
    );
};

export default RulesManagementPage;