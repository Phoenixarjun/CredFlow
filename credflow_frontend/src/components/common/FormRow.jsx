import React from 'react';
import { Flex, Text } from '@radix-ui/themes';


const FormRow = ({ label, htmlFor, error, children }) => (
    <Flex direction="column" gap="1">
        <Text as="label" size="2" weight="medium" mb="1" htmlFor={htmlFor}>
            {label}
        </Text>
        {children}
        {error && (
            <Text size="1" color="red" mt="1">
                {error}
            </Text>
        )}
    </Flex>
);

export default FormRow;