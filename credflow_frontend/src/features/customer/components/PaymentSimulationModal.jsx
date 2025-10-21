import { useState } from 'react';
import { Dialog, Flex, Heading, Text, Button, Box } from '@radix-ui/themes';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

// Placeholder QR Code Image URL (replace with an actual generic QR image)
const QR_CODE_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; // Example

const PaymentSimulationModal = ({ isOpen, onClose, method, invoice, onPaymentSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        try {
            // Call the backend endpoint
            await apiClient.post(`/customer/payments/invoices/${invoice.invoiceId}/mark-paid?method=${method}`);
            toast.success("Payment confirmed! Invoice marked as paid.");
            onPaymentSuccess(); // Trigger callback to refresh list and close modals
            onClose(); // Close this modal
        } catch (error) {
            console.error("Failed to simulate payment:", error);
            toast.error(error.response?.data?.message || "Payment simulation failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Content based on method ---
    let title = "Simulate Payment";
    let content = null;
    let confirmButtonText = "Confirm Payment";

    switch (method) {
        case 'QR_CODE':
            title = "Pay with QR Code";
            content = (
                <Flex direction="column" align="center" gap="3">
                    <Text size="2">Scan the QR code with your payment app.</Text>
                    <img src={QR_CODE_IMAGE_URL} alt="QR Code" width="150" height="150" />
                    <Text size="2" weight="bold">Amount: ${invoice.amountDue.toFixed(2)}</Text>
                </Flex>
            );
            confirmButtonText = "I Have Scanned & Paid";
            break;
        case 'UPI':
            title = "Pay with UPI";
            content = (
                 <Flex direction="column" gap="3">
                    <Text size="2">Send payment to the following UPI ID:</Text>
                    <Text weight="bold" size="4" align="center">invoice-{invoice.invoiceNumber}@credflow.bank</Text>
                    <Text size="2" weight="bold" align="center">Amount: ${invoice.amountDue.toFixed(2)}</Text>
                </Flex>
            );
            confirmButtonText = "I Have Sent Payment via UPI";
            break;
        case 'CARD':
             title = "Pay with Card";
             content = (
                 <Box p="4" style={{ border: '1px dashed var(--gray-7)', borderRadius: 'var(--radius-3)'}}>
                    <Text color="gray" size="2">Simulated card payment form would appear here.</Text>
                 </Box>
             );
            confirmButtonText = "Confirm Card Payment";
            break;
        case 'NET_BANKING':
             title = "Pay with Net Banking";
              content = (
                 <Box p="4" style={{ border: '1px dashed var(--gray-7)', borderRadius: 'var(--radius-3)'}}>
                    <Text color="gray" size="2">Simulated net banking selection would appear here.</Text>
                 </Box>
             );
            confirmButtonText = "Confirm Net Banking Payment";
            break;
        default:
             content = <Text color="red">Unknown payment method.</Text>;
    }


    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>
                    Invoice: {invoice.invoiceNumber} | Amount: ${invoice.amountDue.toFixed(2)}
                </Dialog.Description>

                <Box mt="4" mb="5">
                    {content}
                </Box>

                <Flex gap="3" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" disabled={isProcessing}>
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button onClick={handleConfirmPayment} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : confirmButtonText}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default PaymentSimulationModal;