import React from 'react';
import { Card, Flex, Text, Heading, Select, Table, Badge, Box, Button } from '@radix-ui/themes';
import { InfoCircledIcon, DownloadIcon, CalendarIcon, EyeOpenIcon, ClockIcon } from '@radix-ui/react-icons'; // Added ClockIcon
import ErrorDisplay from '@/components/ui/ErrorDisplay';

// ... getStatusColor, getStatusVariant functions ...
const getStatusColor = (status) => {
    switch (status) {
        case 'PAID': return 'green';
        case 'OVERDUE': return 'red';
        case 'PENDING': return 'orange';
        default: return 'gray';
    }
};
const getStatusVariant = (status) => {
    return status === 'OVERDUE' ? 'solid' : 'soft';
};

const InvoiceTable = ({
    accounts,
    invoices,
    invoiceLoading,
    invoiceError,
    fetchInvoicesForAccount,
    onViewPayments
}) => {
    const safeInvoices = Array.isArray(invoices) ? invoices : [];
    // Calculate totalDue only for non-paid invoices
    const totalDue = safeInvoices
        .filter(inv => inv.status !== 'PAID')
        .reduce((sum, invoice) => sum + (invoice.amountDue || 0), 0);
    const overdueInvoices = safeInvoices.filter(inv => inv.status === 'OVERDUE').length;

    return (
        <Flex direction="column" gap="6">
            {/* Header Section */}
            <Flex direction="column" gap="1">
                <Heading size="5" weight="bold">Invoice Management</Heading>
                <Text size="2" color="gray">
                    Review and manage your account invoices
                </Text>
            </Flex>

            {/* Account Selection & Stats Section */}
            <Card className="border-border bg-surface">
                <Flex direction="column" gap="4">
                    {/* Account Selection */}
                    <Flex direction="column" gap="3">
                        <Text size="2" weight="medium" className="text-text-primary">
                            Select Account
                        </Text>
                        <Select.Root onValueChange={(value) => fetchInvoicesForAccount(value)}>
                            <Select.Trigger
                                placeholder="Choose account to view invoices..."
                                className="max-w-md"
                            />
                            <Select.Content>
                                {accounts.map((account) => (
                                    <Select.Item key={account.accountId} value={account.accountId}>
                                        <Flex align="center" gap="2">
                                            <Text>{account.accountType.replace('_', ' ')}</Text>
                                            <Text size="1" color="gray">({account.accountNumber})</Text>
                                        </Flex>
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </Flex>

                    {/* Stats Overview */}
                    {/* Display stats even if only one invoice exists */}
                    {(safeInvoices.length > 0 || invoiceLoading) && !invoiceError && (
                        <Box className="pt-4 border-t border-border">
                            <Flex gap={{ initial: '4', sm: '6' }} wrap="wrap">
                                <Flex direction="column" gap="1">
                                    <Text size="1" color="gray" weight="medium">Total Due (Unpaid)</Text>
                                    <Text size="4" weight="bold" color={totalDue > 0 ? 'red' : 'green'}>
                                        ${totalDue.toFixed(2)}
                                    </Text>
                                </Flex>
                                <Flex direction="column" gap="1">
                                    <Text size="1" color="gray" weight="medium">Overdue Invoices</Text>
                                    <Text size="4" weight="bold" color={overdueInvoices > 0 ? 'red' : 'gray'}>
                                        {overdueInvoices}
                                    </Text>
                                </Flex>
                                <Flex direction="column" gap="1">
                                    <Text size="1" color="gray" weight="medium">Total Invoices</Text>
                                    <Text size="4" weight="bold" className="text-text-primary">
                                        {safeInvoices.length}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>
                    )}
                </Flex>
            </Card>

            {/* Invoices Table Section */}
            <Card className="border-border bg-surface">
                {/* ... Loading state ... */}
                {invoiceLoading && (
                     <Flex align="center" justify="center" py="12" gap="3">
                         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                         <Text size="2" color="gray">Loading invoice data...</Text>
                     </Flex>
                 )}

                {/* ... Error state ... */}
                 {!invoiceLoading && invoiceError && (
                     <ErrorDisplay message={invoiceError} />
                 )}

                {/* ... No invoices found state ... */}
                 {!invoiceLoading && !invoiceError && safeInvoices.length === 0 && (
                     <Flex direction="column" align="center" justify="center" py="12" gap="3">
                         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                             <InfoCircledIcon width="24" height="24" className="text-gray-400" />
                         </div>
                         <Text size="3" color="gray" weight="medium">No invoices found</Text>
                         <Text size="2" color="gray" align="center">
                             Select an account to view invoice history
                         </Text>
                     </Flex>
                 )}

                {/* Table display */}
                {!invoiceLoading && !invoiceError && safeInvoices.length > 0 && (
                    <Flex direction="column" gap="4">
                        {/* Table Header */}
                        <Flex justify="between" align="center">
                            <Flex direction="column" gap="1">
                                <Text size="3" weight="bold">Invoice History</Text>
                                <Text size="1" color="gray">
                                    {safeInvoices.length} invoice{safeInvoices.length !== 1 ? 's' : ''} • ${totalDue.toFixed(2)} total due
                                </Text>
                            </Flex>
                            <Button variant="soft" size="2">
                                <DownloadIcon width="16" height="16" />
                                Export Report
                            </Button>
                        </Flex>

                        {/* Table */}
                         {/* Responsive: Scroll horizontally on small screens */}
                         <Box className="overflow-x-auto">
                            <Table.Root variant="surface" size="1" style={{ minWidth: '600px' }}> {/* Adjusted size, added minWidth */}
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Invoice #</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
                                        {/* --- ADD Overdue Header --- */}
                                        <Table.ColumnHeaderCell>Days Overdue</Table.ColumnHeaderCell>
                                        {/* --- END --- */}
                                        <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {safeInvoices.map((invoice) => (
                                        <Table.Row key={invoice.invoiceId} align="center">
                                            <Table.Cell>
                                                <Text weight="medium" size="1">{invoice.invoiceNumber}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Flex align="center" gap="1"> {/* Reduced gap */}
                                                    <CalendarIcon width="12" height="12" className="text-gray-500" />
                                                    <Text size="1">
                                                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                                                    </Text>
                                                </Flex>
                                            </Table.Cell>

                                            {/* --- ADD Overdue Cell --- */}
                                            <Table.Cell>
                                                {invoice.status === 'OVERDUE' && invoice.overdueDays != null ? (
                                                     <Flex align="center" gap="1">
                                                        <ClockIcon width="12" height="12" className="text-red-600" />
                                                        <Text color="red" size="1" weight="medium">
                                                            {invoice.overdueDays} days
                                                        </Text>
                                                    </Flex>
                                                ) : (
                                                    <Text color="gray" size="1">--</Text>
                                                )}
                                            </Table.Cell>
                                            {/* --- END --- */}

                                            <Table.Cell>
                                                <Text weight="medium" size="1" color={invoice.status === 'OVERDUE' ? 'red' : undefined}>
                                                    ${(invoice.amountDue || 0).toFixed(2)}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge
                                                    color={getStatusColor(invoice.status)}
                                                    variant={getStatusVariant(invoice.status)}
                                                    radius="full"
                                                    size="1"
                                                >
                                                    {invoice.status}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Flex gap="2">
                                                    {/* Consider adding a Pay Now button if status is OVERDUE/PENDING */}
                                                     {/* <Button size="1" variant="soft" className="hover:bg-blue-100 transition-colors">
                                                        <EyeOpenIcon width="14" height="14" /> View
                                                    </Button> */}
                                                    <Button size="1" variant="ghost" className="hover:bg-gray-100 transition-colors">
                                                        <DownloadIcon width="14" height="14" /> PDF
                                                    </Button>
                                                </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Flex>
                )}
            </Card>
        </Flex>
    );
};

export default InvoiceTable;