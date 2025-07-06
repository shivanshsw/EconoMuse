import { useEffect, useRef } from 'react'
import { useChat } from '../../context/ChatContext'
import MessageBubble from './MessageBubble'

function ChatHistory() {
  const { state } = useChat()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [state.messages, state.isTyping])

  return (
      <div className="chat-history" ref={scrollRef}>
        {state.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
        ))}

        {state.isTyping && (
            <div className="typing-indicator">
              <span>AI is thinking</span>
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
        )}
      </div>
  )
}

export default ChatHistory