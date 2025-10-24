import React from 'react';
import { Button, Flex, Text } from '@radix-ui/themes';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';


const PaginationControls = ({ currentPage, totalPages, onPageChange, isLoading }) => {
    const handlePrevious = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null; 
    }

    return (
        <Flex justify="between" align="center" mt="4">
            <Button
                variant="soft"
                onClick={handlePrevious}
                disabled={currentPage === 0 || isLoading}
            >
                <ChevronLeftIcon />
                Previous
            </Button>
            <Text size="2" color="gray">
                Page {currentPage + 1} of {totalPages}
            </Text>
            <Button
                variant="soft"
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1 || isLoading}
            >
                Next
                <ChevronRightIcon />
            </Button>
        </Flex>
    );
};

export default PaginationControls;