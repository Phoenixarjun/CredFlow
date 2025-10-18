import React from 'react';
import { Heading, Text, Flex } from '@radix-ui/themes';
import { useAuth } from '@/features/authentication/context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <Flex direction="column" gap="4" className="text-text-primary">
            <Heading as="h2" size="7">
                Welcome, {user?.email}!
            </Heading>
            <Text size="4">
                This is your {user?.role} dashboard. You can navigate using the sidebar or navbar.
            </Text>
            <Text size="3">
                Try logging in with: admin@example.com / password (Role: ADMIN), customer@example.com / password (Role: CUSTOMER), or bpo@example.com / password (Role: BPO).
            </Text>
        </Flex>
    );
};

export default DashboardPage;