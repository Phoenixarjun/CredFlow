import React from 'react';
import { Box, Flex, Badge, Text } from '@radix-ui/themes';
import { PersonIcon, RocketIcon } from '@radix-ui/react-icons';

const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';
    const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <Flex
            direction="column"
            gap="1"
            align={isUser ? 'end' : 'start'}
            className="mb-4 animate-fade-in"
        >
            {/* Avatar and Timestamp */}
            <Flex
                gap="2"
                align="center"
                style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUser 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                    {isUser ? (
                        <PersonIcon width="16" height="16" className="text-white" />
                    ) : (
                        <RocketIcon width="16" height="16" className="text-white" />
                    )}
                </div>
                <Badge 
                    color={isUser ? 'blue' : 'purple'} 
                    variant="soft" 
                    size="1"
                >
                    {message.timestamp || timestamp}
                </Badge>
            </Flex>

            {/* Message Bubble */}
            <Box
                className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                    message.isError
                        ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700'
                        : isUser
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700'
                }`}
                style={{
                    borderBottomRightRadius: isUser ? '4px' : '16px',
                    borderBottomLeftRadius: isUser ? '16px' : '4px',
                }}
            >
                <Text 
                    size="2" 
                    style={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: message.isError 
                            ? 'var(--red-11)' 
                            : isUser 
                                ? 'white' 
                                : 'inherit'
                    }}
                >
                    {message.text}
                </Text>
            </Box>
        </Flex>
    );
};

export default ChatMessage;