import { Flex, Heading, Text, Card, Box, Table, Badge, Avatar } from '@radix-ui/themes';
import { useBpoAgents } from '../hooks/useBpoAgents';
import { useAllBpoTasks } from '../hooks/useAllBpoTasks';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const getStatusColor = (status) => {
    switch (status) {
        case 'NEW': return 'orange';
        case 'IN_PROGRESS': return 'blue';
        case 'RESOLVED_PAYMENT_MADE': return 'green';
        default: return 'gray';
    }
};

const AdminBpoPage = () => {
    const { agents, isLoadingAgents } = useBpoAgents();
    const { tasks, isLoadingTasks } = useAllBpoTasks();

    if (isLoadingAgents || isLoadingTasks) {
        return <LoadingSpinner />;
    }

    return (
        <Flex direction="column" gap="6">
            <Heading>BPO Agent Management</Heading>

            {/* --- Section 1: Agent List --- */}
            <Box>
                <Heading size="4" mb="3">Active BPO Agents</Heading>
                <Card>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Agent</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {agents.map(agent => (
                                <Table.Row key={agent.userId}>
                                    <Table.RowHeaderCell>
                                        <Flex gap="3" align="center">
                                            <Avatar
                                                fallback={agent.fullName?.charAt(0) || 'A'}
                                                size="2"
                                                radius="full"
                                            />
                                            {agent.fullName}
                                        </Flex>
                                    </Table.RowHeaderCell>
                                    <Table.Cell>{agent.email}</Table.Cell>
                                    <Table.Cell>{agent.phoneNumber || 'N/A'}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Card>
            </Box>

            {/* --- Section 2: All Tasks List --- */}
            <Box>
                <Heading size="4" mb="3">All System Tasks</Heading>
                <Card>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Invoice</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Assigned To</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tasks.map(task => (
                                <Table.Row key={task.taskId}>
                                    <Table.Cell>{task.invoiceNumber || 'N/A'}</Table.Cell>
                                    <Table.Cell>{task.taskDescription}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={getStatusColor(task.status)}>
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>{task.assignedToName || <Text color="gray">Unclaimed</Text>}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Card>
            </Box>
        </Flex>
    );
};

export default AdminBpoPage;