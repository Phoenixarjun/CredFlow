import React from 'react';
import { Box, Text, Flex, Card } from '@radix-ui/themes';
import { FiClock } from 'react-icons/fi';

const DailySchedulePlaceholder = () => {
  return (
    <Card variant="surface">
      <Flex direction="column" align="center" gap="3" p="5">
        <FiClock size={24} className="text-[var(--gray-9)]" />
        <Text size="3" weight="medium" color="gray">
          Today's Dunning Schedule
        </Text>
        <Text size="2" color="gray" align="center">
          This feature is under development. It will show dunning actions scheduled to run today.
        </Text>
        <Text size="1" color="gray" align="center">
          (Requires backend endpoint to fetch daily scheduled tasks)
        </Text>
      </Flex>
    </Card>
  );
};

export default DailySchedulePlaceholder;