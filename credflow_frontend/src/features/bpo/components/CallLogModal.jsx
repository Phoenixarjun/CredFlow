import { useState, useEffect } from 'react';
import { Dialog, Flex, Heading, Text, Button, TextArea, TextField, Box, Separator, Badge } from '@radix-ui/themes';
import { useCallLogs } from '../hooks/useCallLogs';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const formatDateTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const CallLogModal = ({ isOpen, onClose, task }) => {
    const taskId = task ? task.taskId : null;
    const { logs, isLoadingLogs, fetchLogs, createLog } = useCallLogs(taskId);
    
    const [callOutcome, setCallOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && taskId) {
            fetchLogs();
            // Also clear form when opening for a new task
            setCallOutcome('');
            setNotes('');
        }
    }, [isOpen, fetchLogs, taskId]);

    const handleSubmitLog = async (e) => {
        // e.preventDefault(); // No longer needed as it's not a form submit
        console.log("Submit button clicked!"); // <-- 1. ADD THIS to debug

        if (!callOutcome || !notes) {
            toast.error("Please fill out both outcome and notes."); // Give user feedback
            return;
        }
        
        setIsSubmitting(true);
        const success = await createLog({ callOutcome, notes });
        if (success) {
            setCallOutcome('');
            setNotes('');
            // fetchLogs(); // The hook already adds to state, so this isn't strictly needed
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            {task && (
                <Dialog.Content style={{ maxWidth: 600 }}>
                    <Dialog.Title>Call Logs: {task.invoiceNumber}</Dialog.Title>
                    <Dialog.Description>Log a new call or review past activity.</Dialog.Description>

                    {/* --- 1. New Log Form --- */}
                    {/* 2. REMOVED as="form" and onSubmit */}
                    <Box mt="4"> 
                        <Flex direction="column" gap="3">
                            <Heading size="3">Log New Call</Heading>
                            <TextField.Root
                                placeholder="Call Outcome (e.g., No Answer, Promised Payment)"
                                value={callOutcome}
                                onChange={(e) => setCallOutcome(e.target.value)}
                                required
                            />
                            <TextArea
                                placeholder="Detailed notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                required
                                rows={4}
                            />
                            {/* 3. CHANGED type="button" and ADDED onClick */}
                            <Button 
                                type="button" 
                                disabled={isSubmitting} 
                                className="w-fit-content"
                                onClick={handleSubmitLog} 
                            >
                                {isSubmitting ? "Submitting..." : "Submit Log"}
                            </Button>
                        </Flex>
                    </Box>

                    <Separator size="4" my="5" />

                    {/* --- 2. Past Logs List --- */}
                    <Box>
                        <Heading size="3" mb="3">Call History</Heading>
                        {isLoadingLogs ? (
                            <LoadingSpinner />
                        ) : logs.length === 0 ? (
                            <Text as="p" size="2" color="gray">No call logs found for this task.</Text>
                        ) : (
                            <Flex direction="column" gap="4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {logs.map(log => (
                                    <Box key={log.logId} p="3" style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-3)'}}>
                                        <Flex justify="between" align="center" mb="2">
                                            <Badge>{log.callOutcome}</Badge>
                                            <Text size="1" color="gray">{formatDateTime(log.createdAt)}</Text>
                                        </Flex>
                                        <Text as="p" size="2">{log.notes}</Text>
                                    </Box>
                                ))}
                            </Flex>
                        )}
                    </Box>

                    <Flex gap="3" mt="6" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Close
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            )}
        </Dialog.Root>
    );
};

export default CallLogModal;