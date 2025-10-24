import React from 'react';
import { Flex, Heading, Text, Card, Table, Badge } from '@radix-ui/themes';
import { usePaginatedLogs } from '../hooks/usePaginatedLogs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaginationControls from '@/components/common/PaginationControls';
import { formatDateTime } from '../utils/customerHistoryUtils'; // We'll reuse this helper

const AdminDunningLogPage = () => {
    const {
        logContent,
        totalPages,
        currentPage,
        isLoading,
        handlePageChange
    } = usePaginatedLogs('/admin/analytics/logs/dunning-actions', 'createdAt,desc');

    return (
        <Flex direction="column" gap="6">
            <Heading>Dunning Action Logs</Heading>
            <Text color="gray">A record of all dunning actions (throttles, emails, BPO tasks) executed by the system.</Text>
            
            <Card>
                {isLoading && !logContent.length ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <Table.Root variant="surface" size="1">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Timestamp</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Action Type</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Invoice ID</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {logContent.length > 0 ? (
                                    logContent.map(log => (
                                        <Table.Row key={log.logId}>
                                            <Table.Cell>
                                                <Text size="1">{formatDateTime(log.createdAt)}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color="gray">{log.actionType}</Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text size="1" color="gray">{log.invoiceId}</Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan="3" align="center">
                                            No dunning action logs found.
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>

                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                        />
                    </>
                )}
            </Card>
        </Flex>
    );
};

export default AdminDunningLogPage;