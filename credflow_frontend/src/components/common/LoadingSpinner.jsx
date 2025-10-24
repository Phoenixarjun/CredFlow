import React from 'react';
import { Flex, Text } from '@radix-ui/themes';

const LoadingSpinner = ({ text = 'Loading...' }) => {
    return (
        <Flex 
            direction="column" 
            gap="4" 
            align="center" 
            justify="center" 
            className="w-full h-screen"
        >
            <div 
                className="w-12 h-12 border-4 border-dashed border-blue-600 border-t-transparent rounded-full animate-spin"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
            
            {text && <Text size="4" color="gray" className="tracking-wide">{text}</Text>}
        </Flex>
    );
};

export default LoadingSpinner;