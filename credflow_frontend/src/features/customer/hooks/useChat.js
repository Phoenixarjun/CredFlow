import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/services/apiClient'; // Use your apiClient
import { toast } from 'sonner'; // For notifications

export const useChat = () => {
    const [messages, setMessages] = useState([]); // Stores { sender: 'user'/'ai', text: 'message' }
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatId, setChatId] = useState(null); // Stores the chatId from the backend

    // Optional: Add a welcome message when the chat initializes
    useEffect(() => {
        setMessages([
            { sender: 'ai', text: 'Hello! How can I help you with your CredFlow account today?' }
        ]);
    }, []);

    const sendMessage = useCallback(async (messageText) => {
        if (!messageText || messageText.trim() === '') return;

        // Add user message immediately to the UI
        const userMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            // Send message to backend
            const response = await apiClient.post('/customer/chat/message', { message: messageText });

            const aiResponse = response.data;

            if (aiResponse && aiResponse.response) {
                // Add AI response
                setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.response }]);
                // Store chatId if received (might be useful later, e.g., for clearing)
                if (aiResponse.chatId && !chatId) {
                    setChatId(aiResponse.chatId);
                }
            } else {
                throw new Error("Received an empty response from the assistant.");
            }

        } catch (err) {
            console.error("Chat error:", err);
            const errorMessage = err.response?.data?.response || err.message || "Sorry, I couldn't get a response. Please try again.";
            setError(errorMessage);
            // Add error message to chat UI
            setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${errorMessage}`, isError: true }]);
            toast.error("Chat error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [chatId]); // Include chatId in dependencies if needed later

    // Function to clear chat (basic version, just resets frontend state)
    const clearChat = useCallback(() => {
        setMessages([
             { sender: 'ai', text: 'Chat history cleared. How can I help?' }
        ]);
        setError(null);
        // We might need to call a backend endpoint to clear server-side memory if implemented
        // apiClient.delete(`/customer/chat/clear/${chatId}`);
        // setChatId(null); // Reset chatId if clearing server-side
    }, []);


    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat // Expose clear function
    };
};