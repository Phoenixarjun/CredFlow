import React, { useState } from 'react';
import { Flex, Heading, Button, Box } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { useAdminPlans } from '../hooks/useAdminPlans';
import PlanFormModal from '../components/PlanFormModal';
import PlanTable from '../components/PlanTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminPlansPage = () => {
    const { 
        plans, 
        isLoadingPlans, 
        isSubmittingPlan, 
        createPlan, 
        updatePlan 
    } = useAdminPlans();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null); // null for 'Create', plan object for 'Edit'

    const handleOpenCreate = () => {
        setSelectedPlan(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    // Single save handler for both create and update
    const handleSavePlan = async (data) => {
        let success;
        if (selectedPlan) {
            // Update existing plan
            success = await updatePlan(selectedPlan.planId, data);
        } else {
            // Create new plan
            success = await createPlan(data);
        }

        if (success) {
            handleCloseModal();
        }
    };

    return (
        <>
            <Flex direction="column" gap="6">
                <Flex justify="between" align="center">
                    <Heading>Plan Management</Heading>
                    <Button onClick={handleOpenCreate}>
                        <PlusIcon /> Create New Plan
                    </Button>
                </Flex>

                <Box>
                    {isLoadingPlans ? (
                        <LoadingSpinner />
                    ) : (
                        <PlanTable plans={plans} onEdit={handleOpenEdit} />
                    )}
                </Box>
            </Flex>

            {/* The Modal for Creating/Editing */}
            <PlanFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePlan}
                plan={selectedPlan}
                isSubmitting={isSubmittingPlan}
            />
        </>
    );
};

export default AdminPlansPage;