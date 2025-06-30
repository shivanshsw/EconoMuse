
  import { createContext, useContext, useReducer } from 'react'

  const ChatContext = createContext()

  const initialState = {
    messages: [
      {
        id: 0,
        type: 'ai',
        content: '👋 Hello! I\'m your AI Financial Mentor. I can help you with budgeting, *investment planning*, and achieving your financial goals. How can I assist you today? 💰',
        timestamp: new Date().toISOString()
      }
    ],
    isTyping: false,
    mode: 'learning', // 'learning' or 'goal-oriented'
    userProfile: {
      salary: '',
      rent: '',
      savings: '',
      goal: ''
    }

  }

  function chatReducer(state, action) {
    switch (action.type) {
      case 'ADD_MESSAGE':
        return {
          ...state,
          messages: [...state.messages, {
            id: Date.now(),
            ...action.message,
            timestamp: new Date().toISOString()
          }]
        }
      case 'SET_TYPING':
        return {
          ...state,
          isTyping: action.isTyping
        }
      case 'SET_MODE':
        return {
          ...state,
          mode: action.mode
        }
      case 'UPDATE_USER_PROFILE':
        return {
          ...state,
          userProfile: {
            ...state.userProfile,
            [action.field]: action.value
          }
        }
      case 'CLEAR_CHAT':
        return {
          ...state,
          messages: [state.messages[0]] // Keep welcome message
        }
      default:
        return state
    }
  }

  // eslint-disable-next-line react/prop-types
  export function ChatProvider({ children }) {
    const [state, dispatch] = useReducer(chatReducer, initialState)

    const addMessage = (message) => {
      dispatch({ type: 'ADD_MESSAGE', message })
    }

    const setTyping = (isTyping) => {
      dispatch({ type: 'SET_TYPING', isTyping })
    }

    const setMode = (mode) => {
      dispatch({ type: 'SET_MODE', mode })
    }

    const updateUserProfile = (field, value) => {
      dispatch({ type: 'UPDATE_USER_PROFILE', field, value })
    }

    const clearChat = () => {
      dispatch({ type: 'CLEAR_CHAT' })
    }

    return (
        <ChatContext.Provider value={{
          state,
          addMessage,
          setTyping,
          setMode,
          updateUserProfile,
          clearChat
        }}>
          {children}
        </ChatContext.Provider>
    )
  }

  // eslint-disable-next-line react-refresh/only-export-components
  export function useChat() {
    const context = useContext(ChatContext)
    if (!context) {
      throw new Error('useChat must be used within a ChatProvider')
    }
    return context
  }