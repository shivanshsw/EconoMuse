import { useState } from 'react'
import ChatHistory from './ChatHistory'
import MessageInput from './MessageInput'

import { useChat } from '../../context/ChatContext'
import { getAIResponse } from './GeminiService'
import './Chat.css'

function Chat() {
  const { state, addMessage, setTyping } = useChat()
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to UI immediately
    addMessage({
      type: 'user',
      content: message
    });

    setInputValue('');
    setTyping(true);

    try {
// Get AI response
      const historyBeforeNewMessage = state.messages;

      // Get AI response with OLD history + new message
      const aiResponse = await getAIResponse(
          historyBeforeNewMessage,
          message,
          () => state.userProfile, // Function wrapper
          state.mode
      );

      // Add AI response
      addMessage({
        type: 'ai',
        content: aiResponse
      });
    } catch (error) {
      console.error('Error getting AI response:', error)
      addMessage({
        type: 'ai',
        content: '⚠️ I\'m having trouble connecting right now. Please check your **Gemini API key** and try again. You can get one at [Google AI Studio](https://aistudio.google.com/app/apikey) 🔑'
      })
    } finally {
      setTyping(false)
    }
  }

  const handleQuickAction = (action) => {
    const quickActions = {
      'budget': 'Show me a detailed budget plan based on my current finances',
      'investment': 'What are the best investment options for my risk profile?',
      'savings': 'How can I optimize my savings strategy?',
      'debt': 'Help me create a debt payoff plan',
      'emergency': 'How much should I keep in emergency fund?',
      'retirement': 'What should be my retirement planning strategy?'
    }

    if (quickActions[action]) {
      handleSendMessage(quickActions[action])
    }
  }

  return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>AI Financial Mentor</h2>
          <p>Get personalized financial advice from your AI CFP with 15+ years experience</p>
        </div>

        <div className="chat-content learning-mode">
          <div className="chat-main">
            <ChatHistory />
            <MessageInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                onQuickAction={handleQuickAction}
                disabled={state.isTyping}
            />
          </div>
        </div>
      </div>
  )
}
export default Chat