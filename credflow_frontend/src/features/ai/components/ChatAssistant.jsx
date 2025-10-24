import React, { useState, useRef, useEffect } from 'react';
import { Flex, Box, Button, TextField, Text, Card, Badge, Heading } from '@radix-ui/themes';
import { PaperPlaneIcon, Cross2Icon, LightningBoltIcon, ReloadIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { toast } from 'sonner';

// API Service
const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await axios.post('/api/customer/chat/message', { message });
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }
};

// Quick Action Button Component
const QuickActionButton = ({ icon, label, onClick, disabled }) => (
  <Button
    variant="soft"
    size="2"
    onClick={onClick}
    disabled={disabled}
    className="flex-1 min-w-[140px] transition-all hover:scale-105"
  >
    {icon}
    <Text size="2">{label}</Text>
  </Button>
);

// Message Component
const Message = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  
  return (
    <Flex 
      direction="column" 
      gap="1"
      align={isUser ? 'end' : 'start'}
      className="animate-fade-in"
    >
      <Flex 
        gap="2" 
        align="center"
        style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        }`}>
          {isUser ? 'U' : 'AI'}
        </div>
        <Badge color={isUser ? 'blue' : 'purple'} variant="soft" size="1">
          {timestamp}
        </Badge>
      </Flex>
      
      <Card 
        className={`max-w-[80%] ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        }`}
      >
        <Text size="2" style={{ whiteSpace: 'pre-wrap' }}>
          {content}
        </Text>
      </Card>
    </Flex>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <Flex gap="2" align="center" className="animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
      <Text size="1" weight="bold" className="text-white">AI</Text>
    </div>
    <Card className="bg-gray-100 dark:bg-gray-800 px-4 py-2">
      <Flex gap="1" align="center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </Flex>
    </Card>
  </Flex>
);

// Main Chat Assistant Component
const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your CredFlow AI Assistant. I can help you with:\n\n• Invoice summaries\n• Plan details\n• Account status\n• Payment information\n\nHow can I assist you today?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await chatService.sendMessage(message);
      
      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response?.status === 401) {
        errorContent = 'Your session has expired. Please log in again.';
        toast.error('Session expired');
      } else if (error.response?.status === 500) {
        errorContent = 'Server error. Our team has been notified.';
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { 
      label: 'My Invoices', 
      message: 'Show me my invoice summary', 
      icon: <LightningBoltIcon />,
      description: 'View all your invoices and overdue amounts'
    },
    { 
      label: 'My Plan', 
      message: 'What is my current plan?', 
      icon: <LightningBoltIcon />,
      description: 'Check your active plan details'
    },
    { 
      label: 'Account Status', 
      message: 'Show me my account summary', 
      icon: <LightningBoltIcon />,
      description: 'View your account balance and status'
    },
    { 
      label: 'Payment Help', 
      message: 'How can I make a payment?', 
      icon: <LightningBoltIcon />,
      description: 'Get help with making payments'
    },
  ];

  const handleClearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared. How can I help you today?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
    toast.success('Chat history cleared');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          size="4"
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-110 z-50"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Chat Assistant"
        >
          <Text size="6" weight="bold">💬</Text>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
        >
          {/* Header */}
          <Flex 
            justify="between" 
            align="center" 
            p="4" 
            className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"
          >
            <Flex align="center" gap="3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Text size="5">🤖</Text>
              </div>
              <Flex direction="column">
                <Heading size="4" className="text-white">AI Assistant</Heading>
                <Flex align="center" gap="1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Text size="1" className="text-white/80">Online</Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex gap="2">
              <Button
                variant="ghost"
                size="1"
                onClick={handleClearChat}
                className="text-white hover:bg-white/20"
                title="Clear chat history"
              >
                <ReloadIcon />
              </Button>
              <Button
                variant="ghost"
                size="1"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
                title="Close chat"
              >
                <Cross2Icon />
              </Button>
            </Flex>
          </Flex>

          {/* Quick Actions */}
          <Box p="3" className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <Text size="1" weight="medium" className="text-gray-600 dark:text-gray-400 mb-2 block">
              Quick Actions:
            </Text>
            <Flex gap="2" wrap="wrap">
              {quickActions.map((action, idx) => (
                <QuickActionButton
                  key={idx}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => handleSendMessage(action.message)}
                  disabled={isLoading}
                />
              ))}
            </Flex>
          </Box>

          {/* Messages */}
          <Box 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
            }}
          >
            {messages.map((msg, idx) => (
              <Message key={idx} {...msg} />
            ))}
            {isLoading && <TypingIndicator />}
            
            {messages.length === 1 && !isLoading && (
              <Box className="text-center py-4">
                <Text size="1" className="text-gray-500 dark:text-gray-400">
                  Try clicking a quick action above or type your question below
                </Text>
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box p="3" className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
            <Flex gap="2">
              <TextField.Root
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
                size="2"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                size="2"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <ReloadIcon className="animate-spin" />
                ) : (
                  <PaperPlaneIcon />
                )}
              </Button>
            </Flex>
            <Text size="1" className="text-gray-500 dark:text-gray-400 mt-1 block text-center">
              Press Enter to send • Shift+Enter for new line
            </Text>
          </Box>
        </Card>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Custom scrollbar for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </>
  );
};

export default ChatAssistant;