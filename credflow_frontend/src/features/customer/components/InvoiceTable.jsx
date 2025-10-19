import React from 'react';
import { Card, Flex, Text, Heading, Select, Table, Badge, Box, Button } from '@radix-ui/themes';
import { InfoCircledIcon, DownloadIcon, CalendarIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

const getStatusColor = (status) => {
    switch (status) {
        case 'PAID':
            return 'green';
        case 'OVERDUE':
            return 'red';
        case 'PENDING':
            return 'orange';
        default:
            return 'gray';
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
    const totalDue = safeInvoices.reduce((sum, invoice) => sum + (invoice.amountDue || 0), 0);
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
                    {safeInvoices.length > 0 && (
                        <Box className="pt-4 border-t border-border">
                            <Flex gap="6">
                                <Flex direction="column" gap="1">
                                    <Text size="1" color="gray" weight="medium">Total Due</Text>
                                    <Text size="4" weight="bold" className="text-red-600">
                                        ${totalDue.toFixed(2)}
                                    </Text>
                                </Flex>
                                <Flex direction="column" gap="1">
                                    <Text size="1" color="gray" weight="medium">Overdue</Text>
                                    <Text size="4" weight="bold" className="text-red-600">
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
                {invoiceLoading && (
                    <Flex align="center" justify="center" py="12" gap="3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <Text size="2" color="gray">Loading invoice data...</Text>
                    </Flex>
                )}

                {!invoiceLoading && invoiceError && (
                    <ErrorDisplay message={invoiceError} />
                )}

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
                        <Table.Root variant="ghost" size="2">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>
                                        <Text weight="medium">Invoice #</Text>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <Text weight="medium">Due Date</Text>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <Text weight="medium">Amount</Text>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <Text weight="medium">Status</Text>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>
                                        <Text weight="medium">Actions</Text>
                                    </Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {safeInvoices.map((invoice) => (
                                    <Table.Row key={invoice.invoiceId} className="group hover:bg-gray-50 transition-colors">
                                        <Table.Cell>
                                            <Text weight="medium" size="2">
                                                {invoice.invoiceNumber}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Flex align="center" gap="2">
                                                <CalendarIcon width="14" height="14" className="text-gray-500" />
                                                <Text size="2">
                                                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                                                </Text>
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text 
                                                weight="medium" 
                                                size="2"
                                                className={invoice.status === 'OVERDUE' ? 'text-red-600' : 'text-text-primary'}
                                            >
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
                                                <Button 
                                                    size="1" 
                                                    variant="soft"
                                                    onClick={() => onViewPayments(invoice)}
                                                    className="hover:bg-blue-100 transition-colors"
                                                >
                                                    <EyeOpenIcon width="14" height="14" />
                                                    View
                                                </Button>
                                                <Button 
                                                    size="1" 
                                                    variant="ghost"
                                                    className="hover:bg-gray-100 transition-colors"
                                                >
                                                    <DownloadIcon width="14" height="14" />
                                                    PDF
                                                </Button>
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Flex>
                )}
            </Card>
        </Flex>
    );
};

export default InvoiceTable;