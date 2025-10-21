import { useState } from 'react';
import { Dialog, Flex, Heading, Text, Button, Box } from '@radix-ui/themes';
// Import icons from react-icons (one import per icon pack)
import { BsQrCode, BsCreditCard, BsLaptop } from 'react-icons/bs';
import { AiOutlineScan } from 'react-icons/ai'; // Using this for UPI
import PaymentSimulationModal from './PaymentSimulationModal'; // We'll create this next

const PaymentMethodModal = ({ isOpen, onClose, invoice, onPaymentSuccess }) => {
    const [simulationMethod, setSimulationMethod] = useState(null); // 'QR_CODE', 'UPI', 'CARD', 'NET_BANKING'
    const [isSimModalOpen, setIsSimModalOpen] = useState(false);

    const handleMethodSelect = (method) => {
        setSimulationMethod(method);
        setIsSimModalOpen(true);
    };

    const handleSimModalClose = () => {
        setIsSimModalOpen(false);
        setSimulationMethod(null);
    };

    return (
        <>
            <Dialog.Root open={isOpen} onOpenChange={onClose}>
                <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>Pay Invoice: {invoice.invoiceNumber}</Dialog.Title>
                    <Dialog.Description mb="4">
                        Amount Due: <Text weight="bold">${invoice.amountDue.toFixed(2)}</Text><br/>
                        Choose your simulated payment method:
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        {/* --- Buttons updated with react-icons --- */}
                        <Button size="3" variant="soft" onClick={() => handleMethodSelect('QR_CODE')}>
                            <BsQrCode /> Pay with QR Code
                        </Button>
                        <Button size="3" variant="soft" onClick={() => handleMethodSelect('UPI')}>
                            <AiOutlineScan /> Pay with UPI
                        </Button>
                        <Button size="3" variant="soft" onClick={() => handleMethodSelect('CARD')}>
                            <BsCreditCard /> Pay with Card
                        </Button>
                        <Button size="3" variant="soft" onClick={() => handleMethodSelect('NET_BANKING')}>
                            <BsLaptop /> Pay with Net Banking
                        </Button>
                    </Flex>

                    <Flex mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="ghost" color="gray">Cancel</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            {/* --- The Simulation Modal (QR, UPI, etc.) --- */}
            {simulationMethod && (
                <PaymentSimulationModal
                    isOpen={isSimModalOpen}
                    onClose={handleSimModalClose}
                    method={simulationMethod}
                    invoice={invoice}
                    onPaymentSuccess={onPaymentSuccess} // Pass the callback through
                />
            )}
        </>
    );
};

export default PaymentMethodModal;