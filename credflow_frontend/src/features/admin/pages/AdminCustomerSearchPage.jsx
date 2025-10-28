import React, { useState } from 'react';
import { Flex, Heading, TextField, Button, Box, Grid, Text, Card, Table, Link, Tooltip, Badge, Container } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PersonIcon, Cross1Icon, CheckCircledIcon, MagicWandIcon } from '@radix-ui/react-icons';
import { useAdminCustomerSearch } from '../hooks/useAdminCustomerSearch';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CustomerProfileCard from '../components/customerHistory/CustomerProfileCard';
import AccountDetailsCard from '../components/customerHistory/AccountDetailsCard';
import HistoryTable from '../components/customerHistory/HistoryTable';
import ManualCureModal from '../components/customerHistory/ManualCureModal';
import AiSummaryModal from '../components/customerHistory/AiSummaryModal';
import {
  invoiceColumns,
  paymentColumns,
  notificationColumns,
  dunningActionColumns,
  formatDateTime
} from '../utils/customerHistoryUtils.jsx';

const AdminCustomerSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCureModalOpen, setIsCureModalOpen] = useState(false);
  
  const {
    searchResults,
    customerHistory,
    isLoadingSearch,
    isLoadingHistory,
    isLoadingCure,
    searchCustomers,
    fetchCustomerHistory,
    manuallyCureCustomer,
    clearSearchResultsAndHistory,
    searchedQuery,
    viewingHistoryFor,
    isLoadingSummary,
    aiSummary,
    isSummaryModalOpen,
    fetchAiSummary,
    closeSummaryModal
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

  const openCureModal = () => setIsCureModalOpen(true);
  const closeCureModal = () => setIsCureModalOpen(false);

  const handleConfirmCure = async (customerId, reason) => {
    const success = await manuallyCureCustomer(customerId, reason);
    if (success) {
      closeCureModal();
    }
  };
  
  const isLoading = isLoadingSearch || isLoadingHistory || isLoadingCure || isLoadingSummary;

  const canManuallyCure = customerHistory?.accounts?.some(
    acc => acc.status === 'THROTTLED' || acc.status === 'SUSPENDED'
  );

  return (
    <Container size="4">
      <Flex direction="column" gap="6" py="6">
        {/* Header Section */}
        <Card size="3">
          <Flex justify="between" align="center" wrap="wrap" gap="4">
            <Box>
              <Heading size="6" mb="1">Customer Lookup & History</Heading>
              <Text size="2" color="gray">Search and manage customer accounts and payment history</Text>
            </Box>

            {customerHistory && viewingHistoryFor && (
              <Flex gap="3" wrap="wrap">
                <Tooltip content="Generate an AI-powered summary of this customer">
                  <Button
                    color="violet"
                    variant="soft"
                    size="3"
                    onClick={() => fetchAiSummary(viewingHistoryFor.id)}
                    disabled={isLoading}
                  >
                    <MagicWandIcon />
                    {isLoadingSummary ? 'Generating...' : 'AI Summary'}
                  </Button>
                </Tooltip>
                
                <Tooltip content={!canManuallyCure ? "Customer has no restricted accounts" : "Restore services manually"}>
                  <Button
                    color="red"
                    variant="soft"
                    size="3"
                    onClick={openCureModal}
                    disabled={isLoading || !canManuallyCure}
                  >
                    <CheckCircledIcon />
                    Manually Cure
                  </Button>
                </Tooltip>
              </Flex>
            )}
          </Flex>
        </Card>

        {/* Search Bar */}
        <Card size="3">
          <form onSubmit={handleSearchSubmit}>
            <Flex direction="column" gap="3">
              <Box>
                <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                  Search by Name, Email, Phone, or Account #
                </Text>
                <Flex gap="3" align="end">
                  <Box style={{ flexGrow: 1 }}>
                    <TextField.Root
                      id="customer-search"
                      placeholder="Enter search term (minimum 2 characters)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="3"
                    >
                      <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>
                  <Button 
                    type="submit" 
                    size="3" 
                    disabled={isLoadingSearch || searchTerm.length < 2}
                    style={{ minWidth: '120px' }}
                  >
                    {isLoadingSearch ? 'Searching...' : 'Search'}
                  </Button>
                  {(searchedQuery || viewingHistoryFor) && (
                    <Button 
                      type="button" 
                      size="3" 
                      variant="soft" 
                      color="gray" 
                      onClick={handleClear} 
                      disabled={isLoading}
                    >
                      <Cross1Icon /> Clear
                    </Button>
                  )}
                </Flex>
              </Box>
            </Flex>
          </form>
        </Card>

        {/* Loading State */}
        {(isLoadingSearch || isLoadingHistory) && (
          <Card size="3">
            <LoadingSpinner />
          </Card>
        )}

        {/* Search Results Display */}
        {!isLoading && searchResults.length > 0 && !customerHistory && (
          <Card size="3">
            <Flex direction="column" gap="4">
              <Flex justify="between" align="center">
                <Heading size="4">Search Results</Heading>
                <Badge size="2" variant="soft" color="blue" radius="full">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                </Badge>
              </Flex>
              <Box style={{ 
                border: '1px solid var(--gray-a5)', 
                borderRadius: 'var(--radius-3)',
                overflow: 'hidden'
              }}>
                <Table.Root variant="surface" size="2">
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
                        <Table.Cell>
                          <Text weight="medium">{customer.fullName || 'N/A'}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="gray">{customer.email}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="gray">{customer.phoneNumber || 'N/A'}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Button 
                            size="2" 
                            variant="soft" 
                            onClick={() => handleViewHistory(customer)}
                          >
                            <PersonIcon /> View History
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Flex>
          </Card>
        )}

        {/* History Display */}
        {customerHistory && !isLoadingHistory && viewingHistoryFor && (
          <Flex direction="column" gap="5">
            <Card size="3">
              <Flex align="center" gap="3">
                <Box 
                  p="2" 
                  style={{ 
                    background: 'var(--accent-3)', 
                    borderRadius: 'var(--radius-2)' 
                  }}
                >
                  <PersonIcon width="20" height="20" />
                </Box>
                <Box>
                  <Heading size="5" mb="1">Customer Details</Heading>
                  <Text size="2" color="gray" weight="medium">
                    {viewingHistoryFor.name} • ID: {viewingHistoryFor.id}
                  </Text>
                </Box>
              </Flex>
            </Card>

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
          </Flex>
        )}

        {/* No Search Results / Not Found */}
        {!isLoading && searchResults.length === 0 && searchedQuery && !customerHistory && (
          <Card size="3">
            <Flex 
              align="center" 
              justify="center" 
              direction="column" 
              gap="3" 
              py="8"
              style={{ textAlign: 'center' }}
            >
              <Box 
                p="3" 
                style={{ 
                  background: 'var(--gray-a3)', 
                  borderRadius: 'var(--radius-3)' 
                }}
              >
                <MagnifyingGlassIcon width="32" height="32" color="var(--gray-a9)" />
              </Box>
              <Box>
                <Text size="3" weight="medium" color="gray">No customers found</Text>
                <Text size="2" color="gray" mt="1">
                  No results matching "{searchedQuery}"
                </Text>
              </Box>
            </Flex>
          </Card>
        )}

        {/* Modals */}
        {viewingHistoryFor && (
          <>
            <ManualCureModal
              isOpen={isCureModalOpen}
              onClose={closeCureModal}
              onConfirm={handleConfirmCure}
              customerName={viewingHistoryFor.name}
              customerId={viewingHistoryFor.id}
              isLoading={isLoadingCure}
            />
            <AiSummaryModal
              isOpen={isSummaryModalOpen}
              onClose={closeSummaryModal}
              summary={aiSummary}
              isLoading={isLoadingSummary}
              customerName={viewingHistoryFor.name}
            />
          </>
        )}
      </Flex>
    </Container>
  );
};

export default AdminCustomerSearchPage;