import { useChat } from '../../context/ChatContext'

function FinanceForm() {
  const { state, updateUserProfile } = useChat()
  const { userProfile } = state

  const formatCurrency = (value) => {
    if (!value) return ''
    return `₹${parseInt(value).toLocaleString()}`
  }

  const calculateMetrics = () => {
    const salary = parseInt(userProfile.salary) || 0
    const rent = parseInt(userProfile.rent) || 0
    const savings = parseInt(userProfile.savings) || 0
    
    const disposableIncome = salary - rent - savings
    const savingsRate = salary > 0 ? ((savings / salary) * 100).toFixed(1) : 0
    const rentToIncomeRatio = salary > 0 ? ((rent / salary) * 100).toFixed(1) : 0
    
    return { disposableIncome, savingsRate, rentToIncomeRatio }
  }

  const metrics = calculateMetrics()

  return (
    <div className="finance-form">
      <h3>Financial Profile</h3>
      
      <div className="form-group">
        <label className="form-label">Monthly Salary (₹)</label>
        <input
          type="number"
          className="form-input"
          value={userProfile.salary}
          onChange={(e) => updateUserProfile('salary', e.target.value)}
          placeholder="e.g., 50000"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Monthly Rent (₹)</label>
        <input
          type="number"
          className="form-input"
          value={userProfile.rent}
          onChange={(e) => updateUserProfile('rent', e.target.value)}
          placeholder="e.g., 15000"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Monthly Savings (₹)</label>
        <input
          type="number"
          className="form-input"
          value={userProfile.savings}
          onChange={(e) => updateUserProfile('savings', e.target.value)}
          placeholder="e.g., 10000"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Financial Goal</label>
        <textarea
          className="form-textarea"
          value={userProfile.goal}
          onChange={(e) => updateUserProfile('goal', e.target.value)}
          placeholder="e.g., Buy ₹50L house in 5 years, Build emergency fund, Retire by 50..."
        />
      </div>

      {(userProfile.salary || userProfile.rent || userProfile.savings) && (
        <div className="profile-summary">
          <h4>Quick Analysis</h4>
          <p>
            <strong>Disposable Income:</strong> {formatCurrency(metrics.disposableIncome)}<br/>
            <strong>Savings Rate:</strong> {metrics.savingsRate}%<br/>
            <strong>Rent Ratio:</strong> {metrics.rentToIncomeRatio}%
          </p>
          {metrics.rentToIncomeRatio > 30 && (
            <p style={{ color: 'var(--warning)', fontSize: '0.75rem', marginTop: '8px' }}>
              ⚠️ Rent exceeds 30% of income - consider optimization
            </p>
          )}
          {metrics.savingsRate < 20 && userProfile.salary && (
            <p style={{ color: 'var(--warning)', fontSize: '0.75rem', marginTop: '8px' }}>
              📈 Consider increasing savings rate to 20%+
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FinanceForm