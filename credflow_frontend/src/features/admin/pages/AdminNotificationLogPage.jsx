import React from 'react';
import { Flex, Heading, Text, Card, Table, Badge } from '@radix-ui/themes';
import { usePaginatedLogs } from '../hooks/usePaginatedLogs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaginationControls from '@/components/common/PaginationControls';
import { formatDateTime } from '../utils/customerHistoryUtils';

const AdminNotificationLogPage = () => {
    const {
        logContent,
        totalPages,
        currentPage,
        isLoading,
        handlePageChange
    } = usePaginatedLogs('/admin/analytics/logs/notifications', 'sentAt,desc');

    return (
        <Flex direction="column" gap="6">
            <Heading>Notification Logs</Heading>
            <Text color="gray">A record of all notification attempts (emails, etc.) and their outcome.</Text>
            
            <Card>
                {isLoading && !logContent.length ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <Table.Root variant="surface" size="1">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Timestamp</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Channel</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Template</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {logContent.length > 0 ? (
                                    logContent.map(log => (
                                        <Table.Row key={log.logId}>
                                            <Table.Cell>
                                                <Text size="1">{formatDateTime(log.sentAt)}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color="blue">{log.channel}</Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text size="2">{log.templateName}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color={log.status === 'SENT' ? 'green' : 'red'}>
                                                    {log.status}
                                                </Badge>
                                            </Table.Cell>
                                             <Table.Cell>
                                                <Text size="1" color="gray" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.failureReason}>
                                                    {log.failureReason || '--'}
                                                </Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan="5" align="center">
                                            No notification logs found.
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

export default AdminNotificationLogPage;