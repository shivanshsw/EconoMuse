import { useChat } from '../../context/ChatContext'


export function ModeToggle() {
  const { state, setMode } = useChat()

  return (
    <div className="mode-toggle">
      <button
        className={`mode-btn ${state.mode === 'goal-oriented' ? 'active' : ''}`}
        onClick={() => setMode('goal-oriented')}
      >
        🎯 Goal-Oriented
      </button>
      <button
        className={`mode-btn ${state.mode === 'learning' ? 'active' : ''}`}
        onClick={() => setMode('learning')}
      >
        📚 Learning Mode
      </button>
    </div>
  )

}
export default ModeToggle;


