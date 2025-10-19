import React from 'react';
import { Dialog, Flex, Text, Heading, Table, Badge, Button, Box } from '@radix-ui/themes';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { InfoCircledIcon } from '@radix-ui/react-icons';


const getPaymentStatusColor = (status) => {
    switch (status) {
        case 'SUCCESS':
            return 'green';
        case 'FAILED':
            return 'red';
        case 'PENDING':
            return 'orange';
        default:
            return 'gray';
    }
};


const PaymentHistoryModal = ({ isOpen, onClose, invoice, payments, loading, error }) => {
    if (!invoice) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content style={{ maxWidth: 650 }}>
                <Dialog.Title>Payment History</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Showing payments for Invoice #{invoice.invoiceNumber}
                </Dialog.Description>

                {/* --- Content Area --- */}
                {loading && (
                    <Flex align="center" justify="center" p="6" gap="2">
                        <div className="w-5 h-5 border-2 border-dashed border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <Text color="gray">Loading payment history...</Text>
                    </Flex>
                )}

                {!loading && error && <ErrorDisplay message={error} />}
                
                {!loading && !error && payments.length === 0 && (
                    <Flex align="center" justify="center" p="6" gap="2" direction="column">
                        <InfoCircledIcon width="24" height="24" className="text-gray-500" />
                        <Text color="gray">No payments found for this invoice.</Text>
                    </Flex>
                )}

                {!loading && !error && payments.length > 0 && (
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Payment Date</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Amount Paid</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Method</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {payments.map((payment) => (
                                <Table.Row key={payment.paymentId}>
                                    <Table.Cell>{payment.paymentDate}</Table.Cell>
                                    <Table.Cell>${payment.amountPaid.toFixed(2)}</Table.Cell>
                                    <Table.Cell>{payment.paymentMethod.replace('_', ' ')}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={getPaymentStatusColor(payment.status)}>
                                            {payment.status}
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
                {/* --- End Content Area --- */}

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Close
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default PaymentHistoryModal;