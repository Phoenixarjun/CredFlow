import React from 'react';
import { Flex, Button, Text } from '@radix-ui/themes';
import { LightningBoltIcon, FileTextIcon, RocketIcon, PersonIcon } from '@radix-ui/react-icons';

const QuickActions = ({ onActionClick, disabled }) => {
    const actions = [
        {
            icon: <FileTextIcon width="14" height="14" />,
            label: 'My Invoices',
            message: 'Show me my invoice summary',
            color: 'blue'
        },
        {
            icon: <RocketIcon width="14" height="14" />,
            label: 'My Plan',
            message: 'What is my current plan?',
            color: 'purple'
        },
        {
            icon: <PersonIcon width="14" height="14" />,
            label: 'Account Status',
            message: 'Show me my account summary',
            color: 'green'
        }
    ];

    return (
        <Flex direction="column" gap="2">
            <Text size="1" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1">
                Quick Actions:
            </Text>
            <Flex gap="2" wrap="wrap">
                {actions.map((action, idx) => (
                    <Button
                        key={idx}
                        variant="soft"
                        size="2"
                        onClick={() => onActionClick(action.message)}
                        disabled={disabled}
                        className="flex-1 min-w-[140px] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        color={action.color}
                    >
                        {action.icon}
                        <Text size="2">{action.label}</Text>
                    </Button>
                ))}
            </Flex>
        </Flex>
    );
};

export default QuickActions;