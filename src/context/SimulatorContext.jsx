import { createContext, useContext, useReducer } from 'react'

const SimulatorContext = createContext()

const initialState = {
  policies: {
    minimumWage: 15000, // ₹15k/month
    incomeTaxRate: 20, // 20%
    commodityPrices: {
      food: 0, // ±50%
      housing: 0, // ±200%
      transport: 0 // ±75%
    },
    employmentRate: 70 // 70%
  },
  simulation: {
    isRunning: false,
    regions: {
      village: {
        population: { rich: 5, middle: 30, poor: 65 },
        happiness: 65,
        employment: 60
      },
      town: {
        population: { rich: 8, middle: 40, poor: 52 },
        happiness: 70,
        employment: 75
      },
      city: {
        population: { rich: 15, middle: 45, poor: 40 },
        happiness: 60,
        employment: 80
      }
    },
    migration: {
      villageToTown: 0,
      townToCity: 0,
      cityToTown: 0
    }
  }
}

function simulatorReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_POLICY':
      return {
        ...state,
        policies: {
          ...state.policies,
          [action.policy]: action.value
        }
      }
    case 'UPDATE_COMMODITY_PRICE':
      return {
        ...state,
        policies: {
          ...state.policies,
          commodityPrices: {
            ...state.policies.commodityPrices,
            [action.commodity]: action.value
          }
        }
      }
    case 'START_SIMULATION':
      return {
        ...state,
        simulation: {
          ...state.simulation,
          isRunning: true
        }
      }
    case 'STOP_SIMULATION':
      return {
        ...state,
        simulation: {
          ...state.simulation,
          isRunning: false
        }
      }
    case 'UPDATE_SIMULATION_DATA':
      return {
        ...state,
        simulation: {
          ...state.simulation,
          ...action.data
        }
      }
    default:
      return state
  }
}

export function SimulatorProvider({ children }) {
  const [state, dispatch] = useReducer(simulatorReducer, initialState)

  const updatePolicy = (policy, value) => {
    dispatch({ type: 'UPDATE_POLICY', policy, value })
  }

  const updateCommodityPrice = (commodity, value) => {
    dispatch({ type: 'UPDATE_COMMODITY_PRICE', commodity, value })
  }

  const startSimulation = () => {
    dispatch({ type: 'START_SIMULATION' })
  }

  const stopSimulation = () => {
    dispatch({ type: 'STOP_SIMULATION' })
  }

  const updateSimulationData = (data) => {
    dispatch({ type: 'UPDATE_SIMULATION_DATA', data })
  }

  return (
    <SimulatorContext.Provider value={{
      state,
      updatePolicy,
      updateCommodityPrice,
      startSimulation,
      stopSimulation,
      updateSimulationData
    }}>
      {children}
    </SimulatorContext.Provider>
  )
}

export function useSimulator() {
  const context = useContext(SimulatorContext)
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider')
  }
  return context
}