import React, { useState } from 'react';
import { Flex, Heading, Button, Box } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { useAdminUsers } from '../hooks/useAdminUsers';
import UserFormModal from '../components/UserFormModal';
import UsersTable from '../components/UsersTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminUsersPage = () => {
    const {
        users,
        isLoadingUsers,
        isSubmittingUser,
        createUser,
        updateUser
    } = useAdminUsers();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // null for 'Create', user object for 'Edit'

    const handleOpenCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null); // Clear selected user on close
    };

    // Single save handler
    const handleSaveUser = async (data) => {
        let success;
        if (selectedUser) {
            // Update mode - pass userId and data
            success = await updateUser(selectedUser.userId, data);
        } else {
            // Create mode - just pass data
            success = await createUser(data);
        }

        if (success) {
            handleCloseModal(); // Close modal only on successful save
        }
    };

    return (
        <>
            <Flex direction="column" gap="6">
                <Flex justify="between" align="center">
                    <Heading>User Management</Heading>
                    <Button onClick={handleOpenCreate}>
                        <PlusIcon /> Create New User
                    </Button>
                </Flex>

                <Box>
                    {isLoadingUsers ? (
                        <LoadingSpinner />
                    ) : (
                        <UsersTable users={users} onEdit={handleOpenEdit} />
                    )}
                </Box>
            </Flex>

            {/* --- The Modal --- */}
            <UserFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUser}
                user={selectedUser}
                isSubmitting={isSubmittingUser}
            />
        </>
    );
};

export default AdminUsersPage;