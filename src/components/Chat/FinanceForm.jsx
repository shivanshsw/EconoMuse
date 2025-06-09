import { useChat } from '../../context/ChatContext'

function FinanceForm() {
    const { state, updateUserProfile } = useChat()
    const { userProfile } = state

    // Improved currency formatting
    const formatCurrency = (value) => {
        const number = parseInt(value) || 0
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(number)
    }

    // Safer calculations with error handling
    const calculateMetrics = () => {
        try {
            const salary = parseInt(userProfile.salary) || 0
            const rent = parseInt(userProfile.rent) || 0
            const food = parseInt(userProfile.food) || 0
            const transport = parseInt(userProfile.transports) || 0 // Consider renaming to 'transport'
            const other = parseInt(userProfile.other) || 0
            const savings = parseInt(userProfile.savings) || 0

            const monthlyExpenses = rent + food + transport + other
            const monthlySavings = salary - monthlyExpenses
            const savingsRate = salary > 0 ?
                ((monthlySavings / salary) * 100).toFixed(1) : 0 // Fixed: Now uses monthly savings
            const rentToIncomeRatio = salary > 0 ?
                ((rent / salary) * 100).toFixed(1) : 0

            return {
                "salary":salary,
                "rent": rent,
                "food": food,
                "transport": transport,
                "other": other,
                "savings": savings,

                monthlySavings,
                savingsRate,
                rentToIncomeRatio,
                isValid: monthlySavings >= 0
            }
        } catch (error) {
            console.error('Calculation error:', error)
            return {
                monthlySavings: 0,
                savingsRate: 0,
                rentToIncomeRatio: 0,
                isValid: false
            }
        }
    }

    const metrics = calculateMetrics()

    // Add input validation
    const handleInputChange = (field, value) => {
        if (value < 0) return  // Prevent negative numbers
        if (value > 100000000) return  // Add reasonable upper limit
        updateUserProfile(field, value)
    }

    return (
        <div className="finance-form">
            <h3>Financial Profile</h3>

            {/* Salary Input */}
            <div className="form-group">
                <label className="form-label">Monthly Salary (₹)</label>
                <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={userProfile.salary || ''}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="e.g., 50000"
                />
            </div>

            {/* Expense Inputs */}
            {['rent', 'food', 'transports', 'other'].map((field) => (
                <div className="form-group" key={field}>
                    <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1).replace('transports', 'Transport')} (₹)
                    </label>
                    <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={userProfile[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        placeholder={`e.g., ${field === 'food' ? '8000' : '15000'}`}
                    />
                </div>
            ))}

            {/* Savings Input */}
            <div className="form-group">
                <label className="form-label">Current Savings (₹)</label>
                <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={userProfile.savings || ''}
                    onChange={(e) => handleInputChange('savings', e.target.value)}
                    placeholder="e.g., 100000"
                />
            </div>

            {/* Financial Goal */}
            <div className="form-group">
                <label className="form-label">Financial Goal</label>
                <textarea
                    className="form-textarea"
                    value={userProfile.goal || ''}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    placeholder="e.g., Buy ₹50L house in 5 years, Build emergency fund..."
                    maxLength="200"
                />
            </div>

            {/* Analysis Section */}
            {metrics.isValid ? (
                <div className="profile-summary">
                    <h4>Financial Health Check</h4>
                    <div className="metric-grid">
                        <div className="metric-item">
                            <span className="metric-label">Monthly Savings</span>
                            <span className={`metric-value ${metrics.monthlySavings < 0 ? 'negative' : ''}`}>
                {formatCurrency(metrics.monthlySavings)}
              </span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Savings Rate</span>
                            <span className={`metric-value ${metrics.savingsRate < 20 ? 'warning' : ''}`}>
                {metrics.savingsRate}%
              </span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Rent Ratio</span>
                            <span className={`metric-value ${metrics.rentToIncomeRatio > 30 ? 'warning' : ''}`}>
                {metrics.rentToIncomeRatio}%
              </span>
                        </div>
                    </div>

                    {/* Warnings */}
                    {metrics.rentToIncomeRatio > 30 && (
                        <div className="warning-banner">
                            ⚠️ Rent exceeds 30% of income - consider cost optimization
                        </div>
                    )}
                    {metrics.savingsRate < 20 && (
                        <div className="warning-banner">
                            📈 Aim for 20%+ savings rate for better financial health
                        </div>
                    )}
                </div>
            ) : (
                <div className="warning-banner">
                    ⚠️ Income doesn't cover expenses - review your budget
                </div>
            )}
        </div>
    )
}

export default FinanceForm
