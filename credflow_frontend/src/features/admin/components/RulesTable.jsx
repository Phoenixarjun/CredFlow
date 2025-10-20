import React from 'react';
import { Pencil1Icon, TrashIcon, CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Table, Flex, Text, Button, Badge, Box, Heading } from '@radix-ui/themes'; 

const formatCondition = (rule) => {
    switch (rule.conditionType) {
        case 'DAYS_OVERDUE':
            return `Days Overdue > ${rule.conditionValueInteger}`;
        case 'MIN_AMOUNT_DUE':
            return `Min. Amount Due >= $${rule.conditionValueDecimal}`;
        case 'ACCOUNT_TYPE':
            return `Account Type = ${rule.conditionValueString}`;
        default:
            return rule.conditionType;
    }
};

const formatAction = (rule) => {
    switch (rule.actionType) {
        case 'SEND_EMAIL':
            return `Send Email: ${rule.templateName || 'N/A'}`; 
        case 'CREATE_BPO_TASK':
            return `Create BPO Task (Priority: ${rule.bpoTaskPriority || 'N/A'})`;
        default:
            return rule.actionType;
    }
};


const RulesTable = ({ rules, onEdit, onDelete }) => {
    
    if (!rules || rules.length === 0) {
        return (
            <Flex direction="column" align="center" justify="center" p="6" gap="3" 
                  className="border-dashed border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/20">
                <InfoCircledIcon width="24" height="24" className="text-gray-500" />
                <Heading size="3">No Rules Found</Heading>
                <Text color="gray">
                    Click "Create New Rule" to get started.
                </Text>
            </Flex>
        );
    }

    return (
        <Box className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Table.Root variant="surface">
                <Table.Header className="bg-gray-50 dark:bg-gray-800/50">
                    <Table.Row>
                        <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Rule Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Condition</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {rules.map((rule) => (
                        <Table.Row key={rule.ruleId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <Table.Cell>
                                <Badge color="gray" variant="soft" radius="full">
                                    {rule.priority}
                                </Badge>
                            </Table.Cell>
                            <Table.RowHeaderCell>
                                <Text weight="bold">{rule.ruleName}</Text>
                                <Text as="p" size="1" color="gray" className="truncate max-w-xs">
                                    {rule.description || 'No description'}
                                </Text>
                            </Table.RowHeaderCell>
                            <Table.Cell>
                                <Text size="2">{formatCondition(rule)}</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text size="2">{formatAction(rule)}</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge color={rule.isActive ? 'green' : 'gray'} variant="soft" radius="full">
                                    {rule.isActive ? <CheckCircledIcon /> : <CrossCircledIcon />}
                                    <Text ml="1">{rule.isActive ? 'Active' : 'Inactive'}</Text>
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                <Flex gap="3">
                                    <Button 
                                        variant="soft" 
                                        size="1" 
                                        onClick={() => onEdit(rule)}
                                    >
                                        <Pencil1Icon /> Edit
                                    </Button>
                                    <Button 
                                        variant="soft" 
                                        color="red" 
                                        size="1"
                                        onClick={() => onDelete(rule.ruleId)}
                                    >
                                        <TrashIcon /> Delete
                                    </Button>
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default RulesTable;