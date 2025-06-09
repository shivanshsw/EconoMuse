import { useSimulator } from '../../context/SimulatorContext'

function PolicyControls() {
  const { state, updatePolicy, updateCommodityPrice, startSimulation, stopSimulation } = useSimulator()
  const { policies, simulation } = state

  const formatCurrency = (amount) => {
    return `₹${(amount / 1000).toFixed(0)}k`
  }

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value}%`
  }

  const getHappinessEmoji = (level) => {
    if (level >= 80) return '😊'
    if (level >= 60) return '😐'
    return '😡'
  }

  return (
    <div className="policy-controls">
      <h3>Policy Controls</h3>
      
      <div className="control-group">
        <label className="control-label">
          Minimum Wage: <span className="control-value">{formatCurrency(policies.minimumWage)}/month</span>
        </label>
        <div className="slider-container">
          <input
            type="range"
            min="5000"
            max="50000"
            step="1000"
            value={policies.minimumWage}
            onChange={(e) => updatePolicy('minimumWage', parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">
          Income Tax Rate: <span className="control-value">{policies.incomeTaxRate}%</span>
        </label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={policies.incomeTaxRate}
            onChange={(e) => updatePolicy('incomeTaxRate', parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Employment Rate: <span className="control-value">{policies.employmentRate}%</span></label>
        <div className="slider-container">
          <input
            type="range"
            min="30"
            max="95"
            step="5"
            value={policies.employmentRate}
            onChange={(e) => updatePolicy('employmentRate', parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Commodity Price Adjusters</label>
        <div className="commodity-controls">
          <div className="commodity-control">
            <span className="commodity-name">🍕 Food</span>
            <span className="commodity-value">{formatPercentage(policies.commodityPrices.food)}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={policies.commodityPrices.food}
            onChange={(e) => updateCommodityPrice('food', parseInt(e.target.value))}
            className="slider"
          />
          
          <div className="commodity-control">
            <span className="commodity-name">🏠 Housing</span>
            <span className="commodity-value">{formatPercentage(policies.commodityPrices.housing)}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="200"
            step="10"
            value={policies.commodityPrices.housing}
            onChange={(e) => updateCommodityPrice('housing', parseInt(e.target.value))}
            className="slider"
          />
          
          <div className="commodity-control">
            <span className="commodity-name">🚗 Transport</span>
            <span className="commodity-value">{formatPercentage(policies.commodityPrices.transport)}</span>
          </div>
          <input
            type="range"
            min="-75"
            max="75"
            step="5"
            value={policies.commodityPrices.transport}
            onChange={(e) => updateCommodityPrice('transport', parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <button
        className={`run-simulation-btn ${simulation.isRunning ? 'running' : ''}`}
        onClick={simulation.isRunning ? stopSimulation : startSimulation}
      >
        {simulation.isRunning ? '⏹️ Stop Simulation' : '▶️ Run Simulation'}
      </button>

      {simulation.isRunning && (
        <div style={{ 
          marginTop: 'var(--spacing-md)', 
          padding: 'var(--spacing-sm)', 
          background: 'rgba(74, 222, 128, 0.1)', 
          borderRadius: 'var(--border-radius)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          fontSize: '0.875rem',
          color: 'var(--success)',
          textAlign: 'center'
        }}>
          ✅ Simulation running - updating every 500ms
        </div>
      )}
    </div>
  )
}

export default PolicyControls