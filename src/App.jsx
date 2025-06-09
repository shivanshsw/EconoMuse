import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { SimulatorProvider } from './context/SimulatorContext'
import { ChatProvider } from './context/ChatContext'
import Simulator from './components/Simulator/Simulator'
import Chat from './components/Chat/Chat'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ textDecoration: "none" }}>
        <h1>EconoMuse</h1>
        </Link>
        <span>Econ-Sim & AI Mentor</span>
      </div>
      <div className="nav-links">
        <Link 
          to="/simulator" 
          className={`nav-link ${location.pathname === '/simulator' ? 'active' : ''}`}
        >
          📊 Policy Simulator
        </Link>
        <Link 
          to="/chat" 
          className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
        >
          🤖 AI Mentor
        </Link>
      </div>
    </nav>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="welcome-screen">
                  <h2>Welcome to EconoMuse</h2>
                  <p>Explore economic policies and get AI-powered financial guidance</p>
                  <div className="welcome-buttons">
                    <Link to="/simulator" className="welcome-btn primary">
                      Start Simulator
                    </Link>
                    <Link to="/chat" className="welcome-btn secondary">
                      Chat with AI Mentor
                    </Link>
                  </div>
                </div>
              } />
              <Route path="/simulator" element={
                <SimulatorProvider>
                  <Simulator />
                </SimulatorProvider>
              } />
              <Route path="/chat" element={
                <ChatProvider>
                  <Chat />
                </ChatProvider>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App