import React, { useState } from 'react';
import { Flex, Heading, Text, Box, Card, Grid, Button, Badge, IconButton, Tooltip } from '@radix-ui/themes';
import { useCustomerData } from '../hooks/useCustomerData';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import AccountSummary from '../components/AccountSummary.jsx';
import InvoiceTable from '../components/InvoiceTable';
import PaymentHistoryModal from '../components/PaymentHistoryModal';
import ChatWindow from '../components/ChatWindow'; // Import ChatWindow
import { Link } from 'react-router-dom';
import {
    CheckCircledIcon,
    CrossCircledIcon,
    RocketIcon,
    LightningBoltIcon,
    IdCardIcon,
    ChatBubbleIcon // Import ChatBubbleIcon
} from '@radix-ui/react-icons';

const getStatusColor = (status) => {
    switch (status) {
        case 'ACTIVE': return 'green';
        case 'THROTTLED': return 'orange';
        case 'SUSPENDED': return 'red';
        case 'RESTRICTED': return 'red';
        default: return 'gray';
    }
};

const getSpeedColor = (speed) => {
    if (!speed) return 'gray';
    if (speed.includes('mbps') || speed.includes('gbps')) return 'green';
    if (speed.includes('kbps')) return 'orange';
    // Use includes('0') to catch '0mbps', '0 kbps' etc. more broadly
    if (speed.includes('0')) return 'red';
    return 'gray';
};

const StatusPage = () => {
    const {
        profile, accounts, loading, error,
        invoices, invoiceLoading, invoiceError, fetchInvoicesForAccount,
        payments, paymentLoading, paymentError, fetchPaymentsForInvoice
    } = useCustomerData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleViewPayments = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
        fetchPaymentsForInvoice(invoice.invoiceId);
    };

    if (loading) {
        return <LoadingSpinner text="Loading your dashboard..." />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!profile) {
        return <ErrorDisplay message="Could not load customer profile." />;
    }

    const activeAccounts = accounts.filter(acc => acc.status === 'ACTIVE').length;
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);
    // Ensure accurate overdue check using the correct status string from your enum/data
    const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE').length;
    const primaryAccount = accounts.length > 0 ? accounts[0] : null;

    return (
        <>
            <Flex direction="column" gap="6">

                <Flex direction="column" gap="2">
                    <Flex align="center" gap="3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                       <Heading size="7" >
                            Welcome, {profile.companyName || profile.user?.fullName || 'Customer'}
                        </Heading>
                    </Flex>
                    <Text color="gray" size="3">
                        Here's your complete financial overview and account status.
                    </Text>
                </Flex>

                <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700/50">
                        <Flex direction="column" gap="2">
                            <Flex align="center" gap="2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <CheckCircledIcon width="16" height="16" className="text-white" />
                                </div>
                                <Text size="2" color="gray">Active Accounts</Text>
                            </Flex>
                            <Text size="5" weight="bold" className="text-blue-700 dark:text-blue-300">
                                {activeAccounts}
                            </Text>
                            <Text size="1" color="gray">out of {accounts.length} total</Text>
                        </Flex>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700/50">
                        <Flex direction="column" gap="2">
                            <Flex align="center" gap="2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                                <Text size="2" color="gray">Total Balance</Text>
                            </Flex>
                            <Text size="5" weight="bold" className="text-green-700 dark:text-green-300">
                                ${totalBalance.toFixed(2)}
                            </Text>
                            <Text size="1" color="gray">across all accounts</Text>
                        </Flex>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700/50">
                        <Flex direction="column" gap="2">
                            <Flex align="center" gap="2">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <CrossCircledIcon width="16" height="16" className="text-white" />
                                </div>
                                <Text size="2" color="gray">Overdue Invoices</Text>
                            </Flex>
                            <Text size="5" weight="bold" className="text-red-700 dark:text-red-300">
                                {overdueInvoices}
                            </Text>
                            <Text size="1" color="gray">require attention</Text>
                        </Flex>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700/50">
                        <Flex direction="column" gap="2">
                            <Flex align="center" gap="2">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                                </div>
                                <Text size="2" color="gray">Account Health</Text>
                            </Flex>
                            <Text size="5" weight="bold" className="text-purple-700 dark:text-purple-300">
                                {activeAccounts === accounts.length ? 'Good' : 'Needs Review'}
                            </Text>
                            <Text size="1" color="gray">
                                {activeAccounts === accounts.length ? 'All accounts active' : 'Some issues detected'}
                            </Text>
                        </Flex>
                    </Card>
                </Grid>

                <Box>
                    <Heading size="4" mb="3">My Plan & Service</Heading>
                    {primaryAccount ? (
                        <>
                            {!primaryAccount.planName && (
                                <Card size="3" style={{ backgroundColor: 'var(--blue-2)' }}>
                                    <Flex direction="column" gap="4" align="start">
                                        <Heading size="4">You have no active plan!</Heading>
                                        <Text color="gray">
                                            Select a plan to activate your service and get the best speeds.
                                        </Text>
                                        <Button asChild size="3">
                                            <Link to="/customer/plans">
                                                <RocketIcon /> Browse Plans
                                            </Link>
                                        </Button>
                                    </Flex>
                                </Card>
                            )}
                            {primaryAccount.planName && (
                                <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4">
                                    <Card>
                                        <Flex direction="column" gap="2" height="100%">
                                            <Text size="2" color="gray" weight="medium">Account Status</Text>
                                            <Flex gap="2" align="center" mt="1">
                                                {primaryAccount.status === 'ACTIVE' ? <CheckCircledIcon color="var(--green-9)" /> : <CrossCircledIcon color="var(--red-9)" />}
                                                <Badge size="2" color={getStatusColor(primaryAccount.status)}>
                                                    {primaryAccount.status}
                                                </Badge>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                    <Card>
                                        <Flex direction="column" gap="2" height="100%">
                                            <Text size="2" color="gray" weight="medium">Current Plan</Text>
                                            <Heading size="4">{primaryAccount.planName}</Heading>
                                        </Flex>
                                    </Card>
                                    <Card>
                                        <Flex direction="column" gap="2" height="100%">
                                            <Text size="2" color="gray" weight="medium">Plan Type</Text>
                                            <Flex gap="2" align="center" mt="1">
                                                <IdCardIcon />
                                                <Badge size="2" color={primaryAccount.planType === 'POSTPAID' ? 'crimson' : 'teal'}>
                                                    {primaryAccount.planType}
                                                </Badge>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                    <Card>
                                        <Flex direction="column" gap="2" height="100%">
                                            <Text size="2" color="gray" weight="medium">Current Speed</Text>
                                            <Flex gap="2" align="center" mt="1">
                                                <LightningBoltIcon color={`var(--${getSpeedColor(primaryAccount.currentSpeed)}-9)`} />
                                                <Badge size="2" color={getSpeedColor(primaryAccount.currentSpeed)}>
                                                    {primaryAccount.currentSpeed || 'N/A'}
                                                </Badge>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <Card>
                            <Text>No account information found to display plan details.</Text>
                        </Card>
                    )}
                </Box>

                <AccountSummary accounts={accounts} />

                <InvoiceTable
                    accounts={accounts}
                    invoices={invoices}
                    invoiceLoading={invoiceLoading}
                    invoiceError={invoiceError}
                    fetchInvoicesForAccount={fetchInvoicesForAccount}
                    onViewPayments={handleViewPayments}
                />
            </Flex>

            <PaymentHistoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                invoice={selectedInvoice}
                payments={payments}
                loading={paymentLoading}
                error={paymentError}
            />

           {!isChatOpen && (
                <Button
                    size="4"
                    className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-110 z-[999]"
                    onClick={() => setIsChatOpen(true)}
                    aria-label="Open AI Chat Assistant"
                >
                    <ChatBubbleIcon width="30" height="30" className="text-white" />
                </Button>
            )}

            {/* Chat Window */}
            <ChatWindow
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </>
    );
};

export default StatusPage;