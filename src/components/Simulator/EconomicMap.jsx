import { useSimulator } from '../../context/SimulatorContext'

function EconomicMap() {
  const { state } = useSimulator()
  const { simulation } = state

  const getHappinessEmoji = (level) => {
    if (level >= 80) return '😊'
    if (level >= 60) return '😐'
    return '😡'
  }

  const getSegmentIcon = (segment) => {
    switch (segment) {
      case 'rich': return '🥇'
      case 'middle': return '🥈'
      case 'poor': return '🥉'
      default: return '👤'
    }
  }

  const getMigrationIntensity = (value) => {
    if (Math.abs(value) > 10) return 'active'
    return ''
  }

  return (
    <div className="economic-map">
      <h3>Economic Impact Visualization</h3>
      
      <div className="regions-container">
        {Object.entries(simulation.regions).map(([regionName, regionData]) => (
          <div key={regionName} className="region-card">
            <div className="region-name">{regionName}</div>
            
            <div className="population-segments">
              {Object.entries(regionData.population).map(([segment, percentage]) => (
                <div key={segment} className={`segment segment-${segment}`}>
                  <div className="segment-label">
                    <span className="segment-icon">{getSegmentIcon(segment)}</span>
                    <span>{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
                  </div>
                  <span className="segment-value">{percentage}%</span>
                </div>
              ))}
            </div>
            
            <div className="region-metrics">
              <div className="metric">
                <div className="metric-label">Happiness</div>
                <div className="happiness-meter">
                  <span className="metric-value">{regionData.happiness}%</span>
                  <span>{getHappinessEmoji(regionData.happiness)}</span>
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">Employment</div>
                <div className="metric-value">{regionData.employment}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="migration-indicators">
        <h4>Migration Patterns</h4>
        <div className="migration-arrows">
          <div className={`migration-arrow ${getMigrationIntensity(simulation.migration.villageToTown)}`}>
            <div className="arrow-icon">🏘️ → 🏙️</div>
            <span>Village to Town</span>
            <strong>{Math.abs(simulation.migration.villageToTown)}%</strong>
          </div>
          
          <div className={`migration-arrow ${getMigrationIntensity(simulation.migration.townToCity)}`}>
            <div className="arrow-icon">🏙️ → 🌆</div>
            <span>Town to City</span>
            <strong>{Math.abs(simulation.migration.townToCity)}%</strong>
          </div>
          
          <div className={`migration-arrow ${getMigrationIntensity(simulation.migration.cityToTown)}`}>
            <div className="arrow-icon">🌆 → 🏙️</div>
            <span>City to Town</span>
            <strong>{Math.abs(simulation.migration.cityToTown)}%</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EconomicMap