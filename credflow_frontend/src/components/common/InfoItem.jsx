import React from 'react';
import { Flex, Text } from '@radix-ui/themes';

/**
 * A simple component to display a label and its corresponding value or children.
 * Handles null/undefined values gracefully.
 */
const InfoItem = ({ label, value, children }) => {
    return (
        <Flex direction="column" gap="1">
            <Text size="1" color="gray">{label}</Text>
            <Text size="2" weight="medium">
                {/* Render children if provided, otherwise render the value, fallback to 'N/A' */}
                {children ? children : (value ?? 'N/A')}
            </Text>
        </Flex>
    );
};

export default InfoItem;