import React, { useState } from 'react';
import { Dialog, Flex, Button, Text, TextArea, Heading } from '@radix-ui/themes';
import FormRow from '@/components/common/FormRow'; // Use your FormRow component

const ManualCureModal = ({ isOpen, onClose, onConfirm, customerName, customerId, isLoading }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError('Reason is required.');
            return;
        }
        setError('');
        onConfirm(customerId, reason);
        // Don't close here, let the parent close on success
    };

    const handleClose = () => {
        setReason(''); // Reset reason on close
        setError('');
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Confirm Manual Cure</Dialog.Title>
                <Dialog.Description>
                    Manually curing customer{' '}
                    <Text weight="bold">{customerName || customerId}</Text>
                    will restore their services (Active status, default speed) regardless of remaining overdue invoices.
                    This action should only be used for exceptions.
                </Dialog.Description>

                <Flex direction="column" gap="4" mt="4">
                    <FormRow label="Reason for Manual Cure" error={error}>
                        <TextArea
                            placeholder="e.g., Payment confirmed via alternative channel, goodwill gesture..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            disabled={isLoading}
                             color={error ? 'red' : undefined}
                        />
                    </FormRow>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" onClick={handleClose} disabled={isLoading}>
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Button onClick={handleConfirm} disabled={isLoading || !reason.trim()} color="red">
                            {isLoading ? 'Processing...' : 'Confirm Cure'}
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default ManualCureModal;