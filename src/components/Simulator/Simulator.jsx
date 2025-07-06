import { useEffect } from 'react'
import PolicyControls from './PolicyControls'
import EconomicMap from './EconomicMap'
import { useSimulator } from '../../context/SimulatorContext'
import { runSimulation } from './SimulationEngine'
import './Simulator.css'

function Simulator() {
  const { state, updateSimulationData } = useSimulator()

  useEffect(() => {
    let interval
    if (state.simulation.isRunning) {
      interval = setInterval(() => {
        const newData = runSimulation(state.policies, state.simulation)
        updateSimulationData(newData)
      }, 500)
    }
    return () => clearInterval(interval)
  }, [state.simulation.isRunning, state.policies, updateSimulationData])

  return (
    <div className="simulator">
      <div className="simulator-header">
        <h2>Community Policy Simulator</h2>
        <p>Adjust economic policies and observe real-time impacts on different regions and population segments</p>
      </div>
      
      <div className="simulator-content">
        <div className="simulator-left">
          <PolicyControls />
        </div>
        
        <div className="simulator-right">
          <EconomicMap />
        </div>
      </div>
    </div>
  )
}

export default Simulator