import React, { useState, useRef, useEffect } from 'react'
import { Flex, Box, Text } from '@radix-ui/themes'
import { PaperPlaneIcon } from '@radix-ui/react-icons'

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <Box
      p="4"
      className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <form onSubmit={handleSubmit}>
        <Flex
          align="center"
          justify="between"
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all focus-within:shadow-lg"
          p="2"
          gap="2"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask something..."
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent text-gray-800 dark:text-gray-100 outline-none text-sm px-3 py-2 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PaperPlaneIcon width="20" height="20" />
            )}
          </button>
        </Flex>
      </form>
      <Text size="1" className="text-gray-500 mt-2 dark:text-gray-400 mt-1 text-center block"> Press Enter to send • Shift+Enter for new line </Text>
    </Box>
  )
}

export default ChatInput
