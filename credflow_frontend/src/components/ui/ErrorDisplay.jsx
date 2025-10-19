import React from 'react';
import { Callout, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';


const ErrorDisplay = ({ message }) => {
    if (!message) {
        return null;
    }

    return (
        <Callout.Root color="red" role="alert" my="3">
            <Callout.Icon>
                <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>
                {message}
            </Callout.Text>
        </Callout.Root>
    );
};

export default ErrorDisplay;