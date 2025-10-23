import React from 'react';
import { Table, Badge, Button, Flex, Text } from '@radix-ui/themes';
import { Pencil1Icon } from '@radix-ui/react-icons';

// Helper to format role names nicely
const formatRole = (roleName) => {
    if (!roleName) return 'N/A';
    switch (roleName) {
        case 'BPO_AGENT': return 'BPO Agent';
        case 'ADMIN': return 'Admin';
        case 'CUSTOMER': return 'Customer';
        default: return roleName;
    }
};

// Helper to format date/time
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};


const UsersTable = ({ users, onEdit }) => {
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Full Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Created On</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {users.length > 0 ? (
                    users.map(user => (
                        <Table.Row key={user.userId}>
                            <Table.RowHeaderCell>{user.fullName || 'N/A'}</Table.RowHeaderCell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>
                                <Badge
                                    color={
                                        user.roleName === 'ADMIN' ? 'red' :
                                        user.roleName === 'BPO_AGENT' ? 'blue' : 'gray'
                                    }
                                    variant="soft"
                                >
                                    {formatRole(user.roleName)}
                                </Badge>
                            </Table.Cell>
                             <Table.Cell>
                                <Badge color={user.isActive ? 'green' : 'gray'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </Table.Cell>
                             <Table.Cell>{user.phoneNumber || '--'}</Table.Cell>
                             <Table.Cell>
                                <Text size="2" color="gray">
                                    {formatDateTime(user.createdAt)}
                                </Text>
                             </Table.Cell>
                            <Table.Cell>
                                <Button variant="soft" size="2" onClick={() => onEdit(user)}>
                                    <Pencil1Icon />
                                    Edit
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))
                ) : (
                    <Table.Row>
                        <Table.Cell colSpan="7" align="center">
                            No users found.
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
};

export default UsersTable;