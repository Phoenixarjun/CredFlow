import React, { useRef, useEffect } from 'react';
import { Box, Flex, ScrollArea, IconButton, Heading, Badge, Card } from '@radix-ui/themes';
import { Cross1Icon, ReloadIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import { useChat } from '../hooks/useChat';

const ChatWindow = ({ isOpen, onClose }) => {
    const { messages, isLoading, error, sendMessage, clearChat } = useChat();
    const scrollAreaRef = useRef(null);
    const viewportRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        const viewport = viewportRef.current;
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, isLoading]);

    if (!isOpen) return null;

    const handleQuickAction = (message) => {
        sendMessage(message);
    };

    return (
        <Card
            className="fixed bottom-5 right-6 w-[400px] h-[500px] shadow-2xl z-[1000] flex flex-col border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
            style={{
                animation: 'slideUp 0.3s ease-out'
            }}
        >
            {/* Header */}
            <Flex
                align="center"
                justify="between"
                p="4"
                className="border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"
            >
                <Flex align="center" gap="3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <ChatBubbleIcon width="20" height="20" className="text-white" />
                    </div>
                    <Flex direction="column">
                        <Heading size="4" className="text-white font-bold">
                            CredFlow Assistant
                        </Heading>
                        <Flex align="center" gap="1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-white/80">Online</span>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex gap="2">
                    <IconButton
                        size="2"
                        variant="ghost"
                        onClick={clearChat}
                        className="text-white hover:bg-white/20 transition-colors"
                        title="Clear chat history"
                    >
                        <ReloadIcon width="18" height="18" />
                    </IconButton>
                    <IconButton
                        size="2"
                        variant="ghost"
                        onClick={onClose}
                        className="text-white hover:bg-white/20 transition-colors"
                        title="Close chat"
                    >
                        <Cross1Icon width="18" height="18" />
                    </IconButton>
                </Flex>
            </Flex>

            {/* Quick Actions */}
            {messages.length <= 1 && !isLoading && (
                <Box className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 flex-shrink-0">
                    <QuickActions onActionClick={handleQuickAction} disabled={isLoading} />
                </Box>
            )}

            {/* Messages Area */}
            <ScrollArea
                type="auto"
                scrollbars="vertical"
                className="flex-1 bg-gray-50 dark:bg-gray-900/50"
                style={{
                    '--scrollbar-size': '6px',
                }}
            >
                <Box p="4" ref={viewportRef} className="min-h-full">
                    {messages.length === 0 && (
                        <Flex direction="column" align="center" justify="center" className="h-full py-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                <ChatBubbleIcon width="32" height="32" className="text-white" />
                            </div>
                            <Heading size="4" className="text-gray-900 dark:text-white mb-2">
                                Welcome to CredFlow AI
                            </Heading>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-[280px]">
                                I can help you with invoices, plans, account status, and payments. Try the quick actions below!
                            </p>
                        </Flex>
                    )}
                    
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    
                    {isLoading && (
                        <Flex gap="2" align="center" className="animate-pulse mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-xs text-white font-bold">AI</span>
                            </div>
                            <Card className="bg-gray-100 dark:bg-gray-800 px-4 py-2">
                                <Flex gap="1" align="center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </Flex>
                            </Card>
                        </Flex>
                    )}

                    {error && (
                        <Card className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 mb-3">
                            <Flex gap="2" align="center">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Cross1Icon width="12" height="12" className="text-white" />
                                </div>
                                <span className="text-sm text-red-900 dark:text-red-200">{error}</span>
                            </Flex>
                        </Card>
                    )}
                </Box>
            </ScrollArea>

            {/* Input Area */}
            <Box className="border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </Box>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Card>
    );
};

export default ChatWindow;