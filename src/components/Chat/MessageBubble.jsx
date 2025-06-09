function MessageBubble({ message }) {
  const formatContent = (content) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--primary-gold); text-decoration: underline;">$1</a>')
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`message-bubble ${message.type}`}>
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatContent(message.content) 
        }} 
      />
      <div className="message-timestamp">
        {formatTimestamp(message.timestamp)}
      </div>
    </div>
  )
}

export default MessageBubble