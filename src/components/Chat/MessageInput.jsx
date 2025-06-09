import { useState, useRef, useEffect } from 'react'

function MessageInput({ value, onChange, onSend, onQuickAction, disabled }) {
  const textareaRef = useRef(null)

  const quickActions = [
    { id: 'budget', label: '📊 Budget Plan' },
    { id: 'investment', label: '📈 Investments' },
    { id: 'savings', label: '💰 Savings' },
    { id: 'debt', label: '💳 Debt Help' },
    { id: 'emergency', label: '🚨 Emergency Fund' },
    { id: 'retirement', label: '🏖️ Retirement' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSend(value.trim())
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [value])

  return (
    <div className="message-input-container">
      <div className="quick-actions">
        {quickActions.map(action => (
          <button
            key={action.id}
            className="quick-action-btn"
            onClick={() => onQuickAction(action.id)}
            disabled={disabled}
          >
            {action.label}
          </button>
        ))}
      </div>
      
      <form className="message-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="message-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about budgeting, investments, savings, or any financial topic..."
          disabled={disabled}
          rows={1}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={disabled || !value.trim()}
        >
          {disabled ? <div className="loading" /> : '🚀'}
        </button>
      </form>
    </div>
  )
}

export default MessageInput