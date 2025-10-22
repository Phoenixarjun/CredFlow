import React from 'react';
import { Table, Badge, Button, Flex } from '@radix-ui/themes';
import { Pencil1Icon } from '@radix-ui/react-icons';

const PlanTable = ({ plans, onEdit }) => {
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Plan Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Plan Type</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Service</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Speed</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="right">Price</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {plans.length > 0 ? (
                    plans.map(plan => (
                        <Table.Row key={plan.planId}>
                            <Table.RowHeaderCell>{plan.planName}</Table.RowHeaderCell>
                            <Table.Cell>
                                {/* --- Must be 'plan.active' --- */}
                                <Badge color={plan.active ? 'green' : 'gray'}>
                                    {plan.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge color={plan.planType === 'POSTPAID' ? 'crimson' : 'teal'}>
                                    {plan.planType}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge color={plan.type === 'BROADBAND' ? 'blue' : 'green'} variant="soft">
                                    {plan.type}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>{plan.defaultSpeed}</Table.Cell>
                            <Table.Cell align="right">${plan.price.toFixed(2)}</Table.Cell>
                            <Table.Cell>
                                <Button variant="soft" onClick={() => onEdit(plan)}>
                                    <Pencil1Icon />
                                    Edit
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))
                ) : (
                    <Table.Row>
                        <Table.Cell colSpan="7" align="center">
                            No plans found. Create one to get started.
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    );
};

export default PlanTable;