import { useState } from 'react';
import { Flex, Heading, Text, Card, Button, Badge, Dialog, TextArea, Select } from '@radix-ui/themes';
import { useBpoTasks } from '../hooks/useBpoTasks';
import { BpoResolvableStatuses } from '@/enums/bpoEnums';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CallLogModal from '../components/CallLogModal';

// Helper to get a color for the status badge
const getStatusColor = (status) => {
    switch (status) {
        case 'NEW': return 'orange';
        case 'IN_PROGRESS': return 'blue';
        case 'RESOLVED_PAYMENT_MADE': return 'green';
        default: return 'gray';
    }
};

const BpoTaskQueue = () => {
    const { tasks, isLoading, claimTask, updateTask } = useBpoTasks();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskData, setTaskData] = useState({ status: 'IN_PROGRESS', resolutionNotes: '' });

    // Open the "Update Status" modal
    const handleOpenUpdateModal = (task) => {
        setSelectedTask(task);
        setTaskData({
            status: task.status || 'IN_PROGRESS',
            resolutionNotes: task.resolutionNotes || ''
        });
        setIsUpdateModalOpen(true);
    };
    
    // Open the "Call Log" modal
    const handleOpenLogModal = (task) => {
        setSelectedTask(task);
        setIsLogModalOpen(true);
    };

    // Handle saving the update modal
    const handleSaveChanges = async () => {
        if (!selectedTask) return;
        
        const success = await updateTask(selectedTask.taskId, taskData);
        if (success) {
            setIsUpdateModalOpen(false);
            setSelectedTask(null); // Deselect task *after* modal is closed
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Flex direction="column" gap="6">
                <Heading>My Task Queue</Heading>
                
                {tasks.length === 0 ? (
                    <Card>
                        <Text>No tasks in your queue. Great job! 🥳</Text>
                    </Card>
                ) : (
                    <Flex direction="column" gap="4">
                        {tasks.map(task => (
                            <Card key={task.taskId}>
                                <Flex direction="column" gap="3">
                                    <Flex justify="between" align="center">
                                        <Heading size="3">Invoice: {task.invoiceNumber}</Heading>
                                        <Badge color={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</Badge>
                                    </Flex>
                                    <Text size="2" color="gray">Customer: {task.customerName}</Text>
                                    <Text size="2">Task: {task.taskDescription}</Text>
                                    <Flex justify="between" align="center" mt="3">
                                        <Text size="2" color="gray">Priority: <Badge color={task.priority === 'HIGH' ? 'red' : 'gray'}>{task.priority}</Badge></Text>
                                        
                                        <Flex gap="3">
                                            {task.status === 'NEW' && (
                                                <Button onClick={() => claimTask(task.taskId)}>
                                                    Claim Task
                                                </Button>
                                            )}
                                            {task.status === 'IN_PROGRESS' && (
                                                <>
                                                    <Button onClick={() => handleOpenLogModal(task)} variant="outline">
                                                        Log Call
                                                    </Button>
                                                    <Button onClick={() => handleOpenUpdateModal(task)} variant="soft">
                                                        Update Status
                                                    </Button>
                                                </>
                                            )}
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Card>
                        ))}
                    </Flex>
                )}
            </Flex>

            {/* --- Update Task Modal (FIX APPLIED) --- */}
            {/* * FIX: Dialog.Root is ALWAYS rendered.
              * The *content* is conditionally rendered inside.
              * This keeps React's component tree stable.
            */}
            <Dialog.Root open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                {selectedTask && (
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title>Update Task: {selectedTask.invoiceNumber}</Dialog.Title>
                        <Dialog.Description>
                            Update the status and add resolution notes.
                        </Dialog.Description>

                        <Flex direction="column" gap="4" mt="4">
                            <Flex direction="column" gap="1">
                                <Text as="label" size="2" weight="medium" htmlFor="status">New Status</Text>
                                <Select.Root 
                                    value={taskData.status} 
                                    onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value }))}
                                >
                                    <Select.Trigger id="status" />
                                    <Select.Content>
                                        {BpoResolvableStatuses.map(status => (
                                            <Select.Item key={status.value} value={status.value}>
                                                {status.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                            </Flex>

                            <Flex direction="column" gap="1">
                                <Text as="label" size="2" weight="medium" htmlFor="notes">Resolution Notes</Text>
                                <TextArea
                                    id="notes"
                                    value={taskData.resolutionNotes}
                                    onChange={(e) => setTaskData(prev => ({ ...prev, resolutionNotes: e.target.value }))}
                                    placeholder="e.g., Customer agreed to pay by Friday..."
                                    rows={5}
                                />
                            </Flex>
                        </Flex>

                        <Flex gap="3" mt="6" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </Flex>
                    </Dialog.Content>
                )}
            </Dialog.Root>
            
            {/* --- Call Log Modal --- */}
            <CallLogModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                task={selectedTask}
            />
        </>
    );
};

export default BpoTaskQueue;