import React from 'react';
import { Card, Flex, Text, Heading, Badge, Grid, Box } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon, CalendarIcon, IdCardIcon } from '@radix-ui/react-icons';

const AccountCard = ({ account }) => {
    const isActive = account.status === 'ACTIVE';

    return (
        <Card 
            size="2" 
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600"
        >
            <Flex direction="column" gap="4">
                <Flex justify="between" align="start">
                    <Flex direction="column" gap="1">
                        <Heading size="3" weight="bold" className="capitalize">
                            {account.accountType.replace('_', ' ')}
                        </Heading>
                        <Flex align="center" gap="2" className="text-text-secondary">
                            <IdCardIcon width="16" height="16" />
                            <Text size="2">{account.accountNumber}</Text>
                        </Flex>
                    </Flex>
                    <Badge 
                        color={isActive ? 'green' : 'red'} 
                        variant="soft" 
                        radius="full"
                        className="transform hover:scale-105 transition-transform"
                    >
                        {isActive ? <CheckCircledIcon /> : <CrossCircledIcon />}
                        <Text ml="1" size="1">{account.status}</Text>
                    </Badge>
                </Flex>
                
                {/* Additional Account Info */}
                <Flex justify="between" className="pt-2 border-t border-border">
                    <Flex direction="column" align="center" gap="1">
                        <Text size="1" color="gray">Balance</Text>
                        <Text size="2" weight="medium" className="text-green-600">
                            ${account.currentBalance?.toFixed(2) || '0.00'}
                        </Text>
                    </Flex>
                    <Flex direction="column" align="center" gap="1">
                        <Text size="1" color="gray">Due Date</Text>
                        <Flex align="center" gap="1">
                            <CalendarIcon width="12" height="12" />
                            <Text size="2">15th</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

const AccountSummary = ({ accounts }) => {
    const activeAccounts = accounts.filter(acc => acc.status === 'ACTIVE').length;
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);

    return (
        <Flex direction="column" gap="4">
            <Flex justify="between" align="end">
                <Flex direction="column" gap="1">
                    <Heading size="5">Your Accounts</Heading>
                    <Text size="2" color="gray">
                        Manage and monitor your telecom accounts
                    </Text>
                </Flex>
                
                {/* Summary Stats */}
                <Flex gap="4">
                    <Flex direction="column" align="end">
                        <Text size="1" color="gray">Active Accounts</Text>
                        <Text size="3" weight="bold" className="text-blue-600">
                            {activeAccounts}/{accounts.length}
                        </Text>
                    </Flex>
                    <Flex direction="column" align="end">
                        <Text size="1" color="gray">Total Balance</Text>
                        <Text size="3" weight="bold" className="text-green-600">
                            ${totalBalance.toFixed(2)}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            {accounts.length > 0 ? (
                <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
                    {accounts.map((account) => (
                        <AccountCard key={account.accountId} account={account} />
                    ))}
                </Grid>
            ) : (
                <Card className="text-center py-8 border-dashed border-2 border-border">
                    <Flex direction="column" align="center" gap="3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <IdCardIcon width="24" height="24" className="text-gray-400" />
                        </div>
                        <Text color="gray">You do not have any accounts set up yet.</Text>
                        <Text size="2" color="gray">
                            Contact support to get started with your first account.
                        </Text>
                    </Flex>
                </Card>
            )}
        </Flex>
    );
};

export default AccountSummary;