export function runSimulation(policies, currentSimulation) {
  const { minimumWage, incomeTaxRate, commodityPrices, employmentRate } = policies
  const { regions } = currentSimulation

  // Calculate economic impacts
  const wageImpact = (minimumWage - 15000) / 1000 // Base wage ₹15k
  const taxImpact = (incomeTaxRate - 20) / 10 // Base tax 20%
  const costOfLivingImpact = (commodityPrices.food + commodityPrices.housing + commodityPrices.transport) / 100
  const employmentImpact = (employmentRate - 70) / 10 // Base employment 70%

  // Calculate new regional data
  const newRegions = {}
  
  Object.keys(regions).forEach(regionName => {
    const region = regions[regionName]
    
    // Base regional characteristics
    const baseCharacteristics = {
      village: { basePoor: 65, baseMiddle: 30, baseRich: 5, baseHappiness: 65, baseEmployment: 60 },
      town: { basePoor: 52, baseMiddle: 40, baseRich: 8, baseHappiness: 70, baseEmployment: 75 },
      city: { basePoor: 40, baseMiddle: 45, baseRich: 15, baseHappiness: 60, baseEmployment: 80 }
    }
    
    const base = baseCharacteristics[regionName]
    
    // Calculate wealth redistribution effects
    const wealthRedistribution = wageImpact * 2 - taxImpact * 1.5
    const livingCostPressure = costOfLivingImpact * -15
    const jobAvailability = employmentImpact * 3
    
    // Calculate population shifts
    let newPoor = Math.max(10, Math.min(80, base.basePoor + livingCostPressure - wealthRedistribution))
    let newMiddle = Math.max(15, Math.min(60, base.baseMiddle + wealthRedistribution * 0.8 + jobAvailability))
    let newRich = Math.max(5, Math.min(25, base.baseRich + wealthRedistribution * 0.3))
    
    // Normalize percentages to sum to 100
    const total = newPoor + newMiddle + newRich
    newPoor = Math.round((newPoor / total) * 100)
    newMiddle = Math.round((newMiddle / total) * 100)
    newRich = 100 - newPoor - newMiddle
    
    // Calculate happiness based on economic conditions
    const happinessFromWages = wageImpact * 2
    const happinessFromTax = -taxImpact * 1.5
    const happinessFromCosts = livingCostPressure * 0.8
    const happinessFromJobs = jobAvailability * 1.2
    
    const newHappiness = Math.max(20, Math.min(95, 
      base.baseHappiness + happinessFromWages + happinessFromTax + happinessFromCosts + happinessFromJobs
    ))
    
    // Calculate employment
    const newEmployment = Math.max(30, Math.min(95, 
      base.baseEmployment + jobAvailability * 1.5 + wageImpact * 0.5
    ))
    
    newRegions[regionName] = {
      population: {
        poor: Math.round(newPoor),
        middle: Math.round(newMiddle),
        rich: Math.round(newRich)
      },
      happiness: Math.round(newHappiness),
      employment: Math.round(newEmployment)
    }
  })
  
  // Calculate migration patterns
  const housingCostPressure = commodityPrices.housing / 10
  const wageMagnet = wageImpact * 1.5
  const employmentPull = employmentImpact * 2
  
  const migration = {
    villageToTown: Math.max(0, Math.min(20, housingCostPressure + wageMagnet + employmentPull - 5)),
    townToCity: Math.max(0, Math.min(15, wageMagnet * 1.2 + employmentPull - housingCostPressure * 0.5)),
    cityToTown: Math.max(0, Math.min(10, housingCostPressure * 1.5 - wageMagnet - employmentPull + 3))
  }
  
  return {
    regions: newRegions,
    migration: {
      villageToTown: Math.round(migration.villageToTown),
      townToCity: Math.round(migration.townToCity),
      cityToTown: Math.round(migration.cityToTown)
    }
  }
}