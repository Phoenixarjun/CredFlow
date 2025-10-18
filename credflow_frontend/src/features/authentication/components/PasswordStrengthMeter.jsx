import React from 'react';
import { Flex, Text } from '@radix-ui/themes';

export const PasswordStrengthMeter = ({ strength }) => {
    if (!strength || !strength.label) {
        return null; 
    }

    return (
        <Flex direction="column" gap="1" width="100%" mt="1">
            <Flex gap="1" width="100%">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Flex 
                        key={index}
                        flexGrow="1"
                        height="4px"
                        style={{
                            backgroundColor: index < strength.score ? `var(--${strength.color}-9)` : `var(--gray-5)`,
                            borderRadius: '2px',
                            transition: 'background-color 0.3s ease'
                        }}
                    />
                ))}
            </Flex>
            <Text size="1" color={strength.color ? strength.color : 'gray'}>
                {strength.label}
            </Text>
        </Flex>
    );
};