import React from 'react';
import { Card, Heading, Text, Grid, Badge, Box, Separator } from '@radix-ui/themes';
import InfoItem from '@/components/common/InfoItem';

const AccountDetailsCard = ({ accounts }) => {
    if (!accounts || accounts.length === 0) {
        return <Card><Text color="gray">No accounts found for this customer.</Text></Card>;
    }

    return (
        <Card>
            <Heading size="4" mb="3">Account Details</Heading>
            {accounts.map((acc, index) => (
                <Box key={acc.accountId} mt={index > 0 ? '4' : '0'}>
                    {index > 0 && <Separator my="3" size="4" />}
                    <Grid columns={{ initial: '1', sm: '2' }} gap="3">
                        <InfoItem label="Account Number" value={acc.accountNumber} />
                         <InfoItem label="Status">
                            <Badge
                                color={
                                    acc.status === 'ACTIVE' ? 'green' :
                                    acc.status === 'SUSPENDED' ? 'red' :
                                    acc.status === 'THROTTLED' ? 'orange' : 'gray'
                                }
                            >
                                {acc.status}
                            </Badge>
                        </InfoItem>
                         <InfoItem label="Current Balance" value={`$${acc.currentBalance?.toFixed(2) ?? '0.00'}`} />
                         <InfoItem label="Plan Type" value={acc.planType || 'N/A'} />
                         <InfoItem label="Current Plan" value={acc.planName || 'N/A'} />
                         <InfoItem label="Current Speed" value={acc.currentSpeed || 'Default'} />
                    </Grid>
                </Box>
            ))}
        </Card>
    );
};

export default AccountDetailsCard;