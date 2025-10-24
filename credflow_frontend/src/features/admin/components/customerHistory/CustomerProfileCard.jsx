import React from 'react';
import { Card, Heading, Text, Grid, Badge } from '@radix-ui/themes';
import InfoItem from '@/components/common/InfoItem'; 

const CustomerProfileCard = ({ profile }) => {
    if (!profile) return null;

    return (
        <Card>
            <Heading size="4" mb="3">Customer Profile</Heading>
            <Grid columns={{ initial: '1', sm: '2' }} gap="3">
                <InfoItem label="Customer ID" value={profile.customerId} />
                <InfoItem label="Full Name" value={profile.fullName || 'N/A'} />
                <InfoItem label="Email" value={profile.email} />
                <InfoItem label="Phone Number" value={profile.phoneNumber || 'N/A'} />
                <InfoItem label="Company Name" value={profile.companyName || 'N/A'} />
                <InfoItem label="Address" value={profile.address || 'N/A'} />
            </Grid>
        </Card>
    );
};

export default CustomerProfileCard;