import React, { useState } from 'react';
import { Flex, Heading, TextField, Button, Box, Grid, Text, Card, Table, Link, Tooltip } from '@radix-ui/themes'; // Added Tooltip
import { MagnifyingGlassIcon, PersonIcon, Cross1Icon, CheckCircledIcon } from '@radix-ui/react-icons'; // Added CheckCircledIcon
import { useAdminCustomerSearch } from '../hooks/useAdminCustomerSearch';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CustomerProfileCard from '../components/customerHistory/CustomerProfileCard';
import AccountDetailsCard from '../components/customerHistory/AccountDetailsCard';
import HistoryTable from '../components/customerHistory/HistoryTable';
import ManualCureModal from '../components/customerHistory/ManualCureModal'; // <-- 1. Import Modal
import {
    invoiceColumns,
    paymentColumns,
    notificationColumns,
    dunningActionColumns,
    formatDateTime
} from '../utils/customerHistoryUtils.jsx';

const AdminCustomerSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCureModalOpen, setIsCureModalOpen] = useState(false); // <-- 2. Add modal state
    const {
        searchResults,
        customerHistory,
        isLoadingSearch,
        isLoadingHistory,
        isLoadingCure, // <-- Get cure loading state
        searchCustomers,
        fetchCustomerHistory,
        manuallyCureCustomer, // <-- Get cure function
        clearSearchResultsAndHistory,
        searchedQuery,
        viewingHistoryFor
    } = useAdminCustomerSearch();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchCustomers(searchTerm);
    };

    const handleViewHistory = (customer) => {
        fetchCustomerHistory(customer.customerId, customer.fullName || customer.email);
    };

    const handleClear = () => {
        setSearchTerm('');
        clearSearchResultsAndHistory();
    };

    // --- 3. Handlers for Manual Cure Modal ---
    const openCureModal = () => {
        setIsCureModalOpen(true);
    };

    const closeCureModal = () => {
        setIsCureModalOpen(false);
    };

    const handleConfirmCure = async (customerId, reason) => {
        const success = await manuallyCureCustomer(customerId, reason);
        if (success) {
            closeCureModal(); // Close modal only on success
            // History refresh is handled within the hook now
        }
    };

    // Determine loading state
    const isLoading = isLoadingSearch || isLoadingHistory || isLoadingCure; // Include cure loading

    // Check if the current customer viewing history has restricted accounts
    const canManuallyCure = customerHistory?.accounts?.some(
        acc => acc.status === 'THROTTLED' || acc.status === 'SUSPENDED'
    );

    return (
        <Flex direction="column" gap="6">
            <Flex justify="between" align="center"> {/* <-- Wrap Heading and Button */}
                <Heading>Customer Lookup & History</Heading>

                {/* --- 4. Add Manual Cure Button (only when viewing history) --- */}
                {customerHistory && viewingHistoryFor && (
                    <Tooltip content={!canManuallyCure ? "Customer has no restricted accounts" : "Restore services manually"}>
                         <Button
                            color="red"
                            variant="soft"
                            onClick={openCureModal}
                            disabled={isLoading || !canManuallyCure} // Disable if no restricted accounts
                        >
                            <CheckCircledIcon />
                            Manually Cure
                        </Button>
                    </Tooltip>
                )}
            </Flex>

            {/* Search Bar */}
            {/* ... form remains the same ... */}
            <form onSubmit={handleSearchSubmit}>
                 <Flex gap="3" align="end">
                     <Box style={{ flexGrow: 1 }}>
                         <Text as="label" size="2" weight="medium" htmlFor="customer-search">
                             Search by Name, Email, Phone, or Account #
                         </Text>
                         <TextField.Root
                             id="customer-search"
                             placeholder="Enter search term (min 2 chars)..."
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             size="3"
                         >
                             <TextField.Slot>
                                 <MagnifyingGlassIcon height="16" width="16" />
                             </TextField.Slot>
                         </TextField.Root>
                     </Box>
                     <Button type="submit" size="3" disabled={isLoading || searchTerm.length < 2}>
                         {isLoadingSearch ? 'Searching...' : 'Search'}
                     </Button>
                     {(searchedQuery || viewingHistoryFor) && (
                         <Button type="button" size="3" variant="soft" color="gray" onClick={handleClear} disabled={isLoading}>
                             <Cross1Icon /> Clear
                         </Button>
                     )}
                 </Flex>
             </form>

            {/* Loading State */}
            {isLoading && <LoadingSpinner />}

            {/* Search Results Display */}
            {/* ... remains the same ... */}
             {!isLoading && searchResults.length > 0 && !customerHistory && (
                 <Card mt="4">
                      <Heading size="3" mb="3">Search Results ({searchResults.length})</Heading>
                     <Table.Root variant="surface" size="1">
                         <Table.Header>
                             <Table.Row>
                                 <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                 <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                                 <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                                 <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                             </Table.Row>
                         </Table.Header>
                         <Table.Body>
                             {searchResults.map(customer => (
                                 <Table.Row key={customer.customerId}>
                                     <Table.Cell>{customer.fullName || 'N/A'}</Table.Cell>
                                     <Table.Cell>{customer.email}</Table.Cell>
                                     <Table.Cell>{customer.phoneNumber || 'N/A'}</Table.Cell>
                                     <Table.Cell>
                                         <Button size="1" variant="soft" onClick={() => handleViewHistory(customer)}>
                                             <PersonIcon /> View History
                                         </Button>
                                     </Table.Cell>
                                 </Table.Row>
                             ))}
                         </Table.Body>
                     </Table.Root>
                 </Card>
             )}


            {/* History Display */}
            {/* ... remains the same ... */}
            {customerHistory && !isLoadingHistory && viewingHistoryFor && (
                 <>
                    <Heading size="4" mt="4">
                        Viewing History for: {viewingHistoryFor.name} ({viewingHistoryFor.id})
                    </Heading>
                    <Grid columns="1" gap="5">
                        <Grid columns={{initial: '1', md: '2'}} gap="5">
                            <CustomerProfileCard profile={customerHistory.customerProfile} />
                            <AccountDetailsCard accounts={customerHistory.accounts} />
                        </Grid>
                        <HistoryTable
                            title="Invoices"
                            items={customerHistory.invoices}
                            columns={invoiceColumns}
                            emptyMessage="No invoices found."
                        />
                        <HistoryTable
                            title="Payment History"
                            items={customerHistory.payments}
                            columns={paymentColumns}
                            emptyMessage="No payments found."
                        />
                        <HistoryTable
                            title="Dunning Action Log"
                            items={customerHistory.dunningActionLogs}
                            columns={dunningActionColumns}
                            emptyMessage="No dunning actions logged."
                        />
                        <HistoryTable
                            title="Notification Log"
                            items={customerHistory.notificationLogs}
                            columns={notificationColumns}
                            emptyMessage="No notifications logged."
                        />
                    </Grid>
                </>
            )}

            {/* No Search Results / Not Found */}
            {/* ... remains the same ... */}
             {!isLoading && searchResults.length === 0 && searchedQuery && !customerHistory && (
                  <Box mt="5" p="4" style={{border: '1px dashed var(--gray-a7)', borderRadius: 'var(--radius-3)'}}>
                      <Text align="center" color="gray">No customers found matching "{searchedQuery}".</Text>
                  </Box>
             )}

            {/* --- 5. Render the Modal --- */}
            {viewingHistoryFor && (
                <ManualCureModal
                    isOpen={isCureModalOpen}
                    onClose={closeCureModal}
                    onConfirm={handleConfirmCure}
                    customerName={viewingHistoryFor.name}
                    customerId={viewingHistoryFor.id}
                    isLoading={isLoadingCure}
                />
            )}
        </Flex>
    );
};

export default AdminCustomerSearchPage;