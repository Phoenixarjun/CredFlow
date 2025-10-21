import { useState } from 'react';
import { Flex, Heading, Text, Card, Button, Badge, Box } from '@radix-ui/themes';
import { useCustomerInvoices } from '../hooks/useCustomerInvoices';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaymentMethodModal from '../components/PaymentMethodModal'; // We'll create this next

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const CustomerPaymentsPage = () => {
    // Fetch only OVERDUE invoices for this page
    const { invoices, isLoadingInvoices, refetchInvoices } = useCustomerInvoices('OVERDUE');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);

    const handlePayNowClick = (invoice) => {
        setSelectedInvoice(invoice);
        setIsPayModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPayModalOpen(false); // Close modal
        setSelectedInvoice(null);
        refetchInvoices(); // Refresh the list
    };

    if (isLoadingInvoices) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Flex direction="column" gap="6">
                <Heading>Outstanding Payments</Heading>

                {invoices.length === 0 ? (
                    <Card>
                        <Text>You have no overdue invoices. 👍</Text>
                    </Card>
                ) : (
                    <Flex direction="column" gap="4">
                        {invoices.map(invoice => (
                            <Card key={invoice.invoiceId}>
                                <Flex direction={{ initial: 'column', sm: 'row' }} justify="between" gap="3">
                                    <Box>
                                        <Heading size="3" mb="1">Invoice: {invoice.invoiceNumber}</Heading>
                                        <Text size="2" color="gray">Due Date: {invoice.dueDate}</Text><br/>
                                        <Text size="2" color="gray">Amount Due: <Text weight="bold">{formatCurrency(invoice.amountDue)}</Text></Text>
                                    </Box>
                                    <Flex align="center" gap="3">
                                        <Badge color="orange">{invoice.status}</Badge>
                                        <Button onClick={() => handlePayNowClick(invoice)}>
                                            Pay Now
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Card>
                        ))}
                    </Flex>
                )}
            </Flex>

            {/* --- Payment Method Modal Triggered by Pay Now --- */}
            {selectedInvoice && (
                <PaymentMethodModal
                    isOpen={isPayModalOpen}
                    onClose={() => setIsPayModalOpen(false)}
                    invoice={selectedInvoice}
                    onPaymentSuccess={handlePaymentSuccess} // Callback to refresh list
                />
            )}
        </>
    );
};

export default CustomerPaymentsPage;