import React, { useState } from 'react';
import { Flex, Heading, Text, Box, Button, Callout, Card, SegmentedControl } from '@radix-ui/themes';
import { PlusIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

// --- Import Hooks ---
import { useDunningRules } from '../hooks/useDunningRules';
import { useNotificationTemplates } from '../hooks/useNotificationTemplates';

// --- Import Components ---
import RulesTable from '../components/RulesTable';
import RuleFormModal from '../components/RuleFormModal';
import DunningTimeline from '../components/DunningTimeline';
import DailySchedulePlaceholder from '../components/DailySchedulePlaceholder';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay'; // Assuming you have ErrorDisplay

const RulesManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [viewMode, setViewMode] = useState('timeline');

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
    } = useNotificationTemplates();

    const handleOpenModal = (rule = null) => {
        setSelectedRule(rule);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRule(null);
    };

    const handleSaveRule = async (formData) => {
        try {
            if (selectedRule && selectedRule.ruleId) {
                await updateRule(selectedRule.ruleId, formData);
            } else {
                await addRule(formData);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save rule:", error);
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

    const isLoading = rulesLoading || templatesLoading;
    const combinedError = rulesError || templatesError;

    return (
        <Flex direction="column" gap="6">
            <Flex justify="between" align="center">
                <Box>
                    <Heading size="7">Dunning Rules Management</Heading>
                    <Text color="gray">
                        Configure and visualize automated actions for overdue invoices.
                    </Text>
                </Box>
                <Button size="3" onClick={() => handleOpenModal(null)}>
                    <PlusIcon /> Create New Rule
                </Button>
            </Flex>

            {/* --- Visualization Section with Toggle --- */}
            <Card>
                <Flex direction="column" gap="4">
                    <Flex justify="between" align="center">
                        <Heading size="4">Rule Visualization</Heading>
                        <SegmentedControl.Root
                            value={viewMode}
                            onValueChange={setViewMode}
                            size="2"
                        >
                            <SegmentedControl.Item value="timeline">Full Timeline</SegmentedControl.Item>
                            <SegmentedControl.Item value="daily">Daily Schedule</SegmentedControl.Item>
                        </SegmentedControl.Root>
                    </Flex>

                    {/* Conditional Rendering based on viewMode */}
                     {/* Show loading/error specific to visualization */}
                     {isLoading && <LoadingSpinner text="Loading visualization..."/>}
                     {combinedError && !isLoading && <Text color="red" size="2">Could not load visualization data: {combinedError}</Text>}
                     {!isLoading && !combinedError && (!rules || rules.length === 0) && (
                         <Text color="gray" size="2">No rules available to visualize.</Text>
                     )}
                    {!isLoading && !combinedError && rules?.length > 0 && (
                        viewMode === 'timeline' ? (
                            <DunningTimeline rules={rules} />
                        ) : (
                            <DailySchedulePlaceholder />
                        )
                    )}
                </Flex>
            </Card>
            {/* ------------------------------------------- */}


            {/* --- Rules Table Section --- */}
            <Heading size="5">All Configured Rules</Heading>
            {/* Table Loading/Error is handled implicitly by the visualization check above */}
            {isLoading && <LoadingSpinner text="Loading rules table..." />}

            {combinedError && !isLoading && ( // Show table error only if loading finished
                <Callout.Root color="red" role="alert">
                    <Callout.Icon> <ExclamationTriangleIcon /> </Callout.Icon>
                    <Callout.Text> Error loading rules table: {combinedError} </Callout.Text>
                </Callout.Root>
            )}

            {!isLoading && !combinedError && (
                <RulesTable
                    rules={rules}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteRule}
                />
            )}
            {/* --------------------------- */}


            <RuleFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRule}
                rule={selectedRule}
                templates={templates}
            />
        </Flex>
    );
};

export default RulesManagementPage;