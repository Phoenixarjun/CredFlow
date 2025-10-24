import React from 'react';
import { Pencil1Icon, TrashIcon, CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Table, Flex, Text, Button, Badge, Box, Heading, Tooltip } from '@radix-ui/themes';

const formatCondition = (rule) => {
    switch (rule.conditionType) {
        case 'DAYS_OVERDUE':
            return `Days Overdue >= ${rule.conditionValueInteger}`;
        case 'MIN_AMOUNT_DUE':
            return `Min Amount >= $${rule.conditionValueDecimal}`;
        case 'ACCOUNT_TYPE':
            return `Acct Type = ${rule.conditionValueString}`;
        default:
            return rule.conditionType;
    }
};

const formatAction = (rule) => {
    switch (rule.actionType) {
        case 'SEND_EMAIL':
            const templateName = rule.template?.templateName || rule.templateName || 'N/A';
            return `Send Email (${templateName.substring(0, 15)}...)`;
        case 'CREATE_BPO_TASK':
            return `Create BPO (Prio: ${rule.bpoTaskPriority || 'N/A'})`;
        case 'THROTTLE_SPEED':
            return `Throttle Speed`;
        case 'RESTRICT_SERVICE':
            return `Restrict Service`;
        default:
            return rule.actionType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
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

    const sortedRules = [...rules].sort((a, b) => (a.priority || Infinity) - (b.priority || Infinity));

    return (
        <Box className="rounded-lg border border-[var(--gray-a6)] overflow-hidden">
            <Box className="overflow-x-auto">
                <Table.Root variant="surface" size="1" style={{ width: '100%', minWidth: '800px' }}>
                    <Table.Header className="bg-gray-50 dark:bg-[var(--gray-a3)]">
                        <Table.Row>
                            <Table.ColumnHeaderCell align="center" style={{ width: '60px' }}>Prio.</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ minWidth: '200px' }}>Rule Name</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: '100px' }}>Applies To</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: '150px' }}>Condition</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ minWidth: '180px' }}>Action</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell align="center" style={{ width: '100px' }}>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{ width: '150px' }}>Actions</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {sortedRules.map((rule) => (
                            <Table.Row key={rule.ruleId} className="hover:bg-gray-50/50 dark:hover:bg-[var(--gray-a2)] transition-colors duration-150 align-middle">
                                <Table.Cell align="center">
                                    <Badge color="gray" variant="soft" radius="full" size="1">
                                        {rule.priority}
                                    </Badge>
                                </Table.Cell>
                                <Table.RowHeaderCell>
                                    <Text weight="medium" size="2" className="block">{rule.ruleName}</Text>
                                    <Tooltip content={rule.description || 'No description'}>
                                        <Text as="p" size="1" color="gray" className="truncate max-w-[200px] mt-0.5">
                                            {rule.description || <span className="italic">No description</span>}
                                        </Text>
                                    </Tooltip>
                                </Table.RowHeaderCell>
                                <Table.Cell>
                                    {rule.appliesToPlanType && rule.appliesToPlanType !== 'ALL' ? (
                                        <Badge color="cyan" variant="soft" size="1">{rule.appliesToPlanType}</Badge>
                                    ) : (
                                        <Text size="1" color="gray">All</Text>
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Text size="1">{formatCondition(rule)}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text size="1">{formatAction(rule)}</Text>
                                </Table.Cell>
                                <Table.Cell align="center">
                                    <Badge color={rule.isActive ? 'green' : 'gray'} variant="soft" radius="full" size="1">
                                        {rule.isActive ? <CheckCircledIcon /> : <CrossCircledIcon />}
                                        <Text ml="1">{rule.isActive ? 'Active' : 'Inactive'}</Text>
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Flex gap="2">
                                        <Button
                                            variant="outline"
                                            size="1"
                                            onClick={() => onEdit(rule)}
                                            aria-label={`Edit rule ${rule.ruleName}`}
                                        >
                                            <Pencil1Icon /> Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            color="red"
                                            size="1"
                                            onClick={() => onDelete(rule.ruleId)}
                                            aria-label={`Delete rule ${rule.ruleName}`}
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
        </Box>
    );
};

export default RulesTable;