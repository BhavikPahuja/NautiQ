import { ScenarioSimulationParams, ScenarioComparisonResult } from '../types';

export const DEFAULT_SCENARIO_PARAMS: ScenarioSimulationParams = {
  fuelPriceMultiplier: 1.0,
  carbonTaxPerTonneUSD: 60,
  cargoDemandMultiplier: 1.0,
  weatherSeverityMultiplier: 1.0,
  deadlineUrgencyHoursDelta: 0,
  electricityPriceMultiplier: 1.0,
  gridCarbonIntensityMultiplier: 1.0,
  methanolSubsidyUSDPerTonne: 0
};

export function simulateScenario(params: ScenarioSimulationParams): ScenarioComparisonResult {
  // Baseline fleet figures
  const baseFuel = 4650;
  const baseCost = 2850000;
  const baseGHG = 13800;
  const baseDelay = 3.5;
  const baseAltFuelShare = 32;

  // Impact calculations
  // Fuel price multiplier directly increases fuel OPEX
  // Carbon tax applies $/tonne on total lifecycle GHG
  const fuelCostFactor = params.fuelPriceMultiplier;
  const carbonTaxTotal = baseGHG * params.carbonTaxPerTonneUSD;
  
  // Weather severity increases resistance via wave/wind drag
  const weatherFuelMarkup = Math.max(0.85, params.weatherSeverityMultiplier) - 1.0;
  const weatherFuelExtra = baseFuel * (weatherFuelMarkup * 0.45);

  // Cargo demand scales payload displacement
  const cargoScale = params.cargoDemandMultiplier;
  const cargoFuelEffect = (cargoScale - 1.0) * baseFuel * 0.35;

  // When carbon tax > $80 or methanol subsidized, alternative fuel share jumps dramatically
  let altFuelShare = baseAltFuelShare;
  if (params.carbonTaxPerTonneUSD > 80) {
    altFuelShare += Math.min(45, (params.carbonTaxPerTonneUSD - 80) * 0.35);
  }
  if (params.methanolSubsidyUSDPerTonne > 100) {
    altFuelShare += Math.min(25, params.methanolSubsidyUSDPerTonne * 0.08);
  }
  altFuelShare = Math.min(92, Math.round(altFuelShare));

  // Scenario Fuel and GHG
  // Higher alt fuel share reduces GHG dramatically
  const ghgReductionFactor = 1.0 - ((altFuelShare - baseAltFuelShare) * 0.008);
  const scenarioFuel = Math.round(baseFuel + weatherFuelExtra + cargoFuelEffect);
  const scenarioGHG = Math.round((baseGHG * ghgReductionFactor) * (scenarioFuel / baseFuel));
  
  // Scenario OPEX
  const rawFuelExpenditure = scenarioFuel * 680 * fuelCostFactor;
  const scenarioCarbonTaxCost = scenarioGHG * params.carbonTaxPerTonneUSD;
  const scenarioCost = Math.round(rawFuelExpenditure + scenarioCarbonTaxCost + (params.electricityPriceMultiplier * 32000));

  // Delays from weather and deadlines
  const weatherDelayExtra = Math.max(0, (params.weatherSeverityMultiplier - 1.0) * 8.5);
  const deadlineStrain = Math.max(0, -params.deadlineUrgencyHoursDelta * 0.25);
  const scenarioDelay = Number((baseDelay + weatherDelayExtra + deadlineStrain).toFixed(1));

  // Deltas
  const deltaFuel = scenarioFuel - baseFuel;
  const deltaCost = scenarioCost - baseCost;
  const deltaGHG = scenarioGHG - baseGHG;
  const deltaDelay = Number((scenarioDelay - baseDelay).toFixed(1));

  // Generated Changed Decisions list
  const changedDecisions = [];

  if (params.carbonTaxPerTonneUSD >= 75) {
    changedDecisions.push({
      category: "Bunker Fuel Substitution",
      voyage: "NQ-2026-0801 (Shanghai to LA)",
      before: "Dual-Fuel LNG / VLSFO mix",
      after: "100% Bio-Methanol bunkering at Shanghai",
      impact: `Avoided $${Math.round(params.carbonTaxPerTonneUSD * 1420).toLocaleString()} carbon penalty under $${params.carbonTaxPerTonneUSD}/t carbon tax.`
    });
  }

  if (params.weatherSeverityMultiplier >= 1.2) {
    changedDecisions.push({
      category: "Weather Routing Divergence",
      voyage: "NQ-2026-0807 (LA to Busan)",
      before: "Great Circle Northern Arc (Significant Wave 4.8m)",
      after: "Southern Rumb Line divert (+140 nm, wave < 2.5m)",
      impact: "Reduced added wave resistance by 14%, averting 38 hours structural delay."
    });
  }

  if (params.fuelPriceMultiplier >= 1.25) {
    changedDecisions.push({
      category: "Eco Slow-Steaming Throttle",
      voyage: "NQ-2026-0802 (Singapore to Rotterdam)",
      before: "Cruising at 16.5 knots",
      after: "De-rated speed to 14.1 knots",
      impact: "Trimmed 240 tonnes bunker consumption, neutralizing fuel price inflation."
    });
  }

  if (params.cargoDemandMultiplier >= 1.15) {
    changedDecisions.push({
      category: "Vessel Upsizing Allocation",
      voyage: "NQ-2026-0805 (Busan to Singapore)",
      before: "Quantum Carrier (12,000 TEU)",
      after: "EcoTitan Express (20,200 TEU)",
      impact: "Absorbed surge demand without triggering charter penalty or spillover backlogs."
    });
  }

  if (changedDecisions.length === 0) {
    changedDecisions.push({
      category: "Operating Envelope Tuning",
      voyage: "All Transoceanic Services",
      before: "Baseline charter schedule",
      after: "Optimized berth arrival sequencing",
      impact: "Preserved schedule integrity within standard tolerance limits."
    });
  }

  // Executive summary
  const executiveSummary = `Scenario analysis reveals a ${deltaCost >= 0 ? '+' : ''}$${(deltaCost / 1_000_000).toFixed(2)}M expenditure shift with a ${deltaGHG >= 0 ? '+' : ''}${Math.round(deltaGHG)} tCO₂e emissions trajectory. Alternative green fuel adoption shifted from ${baseAltFuelShare}% to ${altFuelShare}%.`;

  return {
    params,
    baseline: {
      fuelTonnes: baseFuel,
      costUSD: baseCost,
      ghgTonnes: baseGHG,
      delayHours: baseDelay,
      altFuelSharePct: baseAltFuelShare
    },
    scenario: {
      fuelTonnes: scenarioFuel,
      costUSD: scenarioCost,
      ghgTonnes: scenarioGHG,
      delayHours: scenarioDelay,
      altFuelSharePct: altFuelShare
    },
    delta: {
      fuelTonnes: deltaFuel,
      fuelPct: Number(((deltaFuel / baseFuel) * 100).toFixed(1)),
      costUSD: deltaCost,
      costPct: Number(((deltaCost / baseCost) * 100).toFixed(1)),
      ghgTonnes: deltaGHG,
      ghgPct: Number(((deltaGHG / baseGHG) * 100).toFixed(1)),
      delayHours: deltaDelay
    },
    changedDecisions,
    executiveSummary
  };
}
