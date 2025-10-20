import { Card, Flex, Text, Heading } from '@radix-ui/themes';

const StatCard = ({ title, value, unit = '', loading = false }) => {
    // Format the display value
    let displayValue;
    if (loading) {
        displayValue = '...';
    } else if (value === null || value === undefined) {
        displayValue = 'N/A';
    } else if (typeof value === 'number' && !Number.isInteger(value)) {
        // Format decimals (like money)
        displayValue = `${unit}${value.toFixed(2)}`;
    } else {
        displayValue = `${unit}${String(value)}`;
    }

    return (
        <Card size="2" className="flex-1 min-w-[200px]">
            <Flex direction="column" gap="1">
                <Text size="2" weight="medium" color="gray">{title}</Text>
                <Heading size="6">
                    {displayValue}
                </Heading>
            </Flex>
        </Card>
    );
};

export default StatCard;