import { Flex, Heading, Text, Card, Box, Table, Badge } from '@radix-ui/themes';
import { useMyCallLogs } from '../hooks/useMyCallLogs';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const BpoCallLogsPage = () => {
    const { logs, isLoadingLogs } = useMyCallLogs();

    if (isLoadingLogs) {
        return <LoadingSpinner />;
    }

    return (
        <Flex direction="column" gap="6">
            <Heading>My Call Log History</Heading>

            <Card>
                {logs.length === 0 ? (
                    <Text>You have not logged any calls.</Text>
                ) : (
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Task ID</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Outcome</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {logs.map(log => (
                                <Table.Row key={log.logId}>
                                    <Table.Cell>
                                        <Text size="2" color="gray">{formatDateTime(log.createdAt)}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text size="2" highContrast>{log.taskId.substring(0, 8)}...</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge>{log.callOutcome}</Badge>
                                    </Table.Cell>
                                    <Table.Cell>{log.notes}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
            </Card>
        </Flex>
    );
};

export default BpoCallLogsPage;