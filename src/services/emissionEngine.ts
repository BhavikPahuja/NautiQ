import { FuelType } from '../types';
import { FUELS_DATA } from '../data/mockData';

export interface EmissionCalculationResult {
  fuelType: FuelType;
  fuelConsumedTonnes: number;
  energyConsumedMJ: number;
  ttwEmissionsTonnes: number;
  wtwEmissionsTonnes: number;
  totalLifecycleGHGTonnes: number;
  ghgIntensityGPerMJ: number;
  fuelEuTarget2026GPerMJ: number;
  fuelEuComplianceStatus: 'COMPLIANT' | 'PENALTY_EXPOSURE';
  ciiRatingProjected: 'A' | 'B' | 'C' | 'D' | 'E';
}

/**
 * Lifecycle Emission Engine (IMO MEPC 80 & FuelEU Maritime Standards)
 * Separates combustion TTW from full upstream supply chain WTW
 */
export function calculateLifecycleEmissions(
  fuelType: FuelType,
  fuelConsumedTonnes: number,
  cargoDistanceTonnesNm: number
): EmissionCalculationResult {
  const spec = FUELS_DATA[fuelType] || FUELS_DATA.Diesel;

  // Energy consumed in MegaJoules (MJ)
  const energyConsumedMJ = fuelConsumedTonnes * 1000 * spec.energyDensityMJkg;

  // Emissions (tonnes CO2 equivalent)
  const ttwEmissionsTonnes = Number((fuelConsumedTonnes * spec.ttwEmissionFactor).toFixed(2));
  const wtwEmissionsTonnes = Number((fuelConsumedTonnes * spec.wtwEmissionFactor).toFixed(2));
  const totalLifecycleGHGTonnes = wtwEmissionsTonnes;

  // GHG Intensity per MJ of energy: (t CO2e * 1,000,000 g) / MJ
  const ghgIntensityGPerMJ = energyConsumedMJ > 0 
    ? Number(((wtwEmissionsTonnes * 1_000_000) / energyConsumedMJ).toFixed(2))
    : 89.3;

  // FuelEU Maritime 2026 reference benchmark target: ~89.34 gCO2e/MJ with 2% mandated cut = 87.5 gCO2e/MJ
  const fuelEuTarget2026GPerMJ = 87.5;
  const fuelEuComplianceStatus = ghgIntensityGPerMJ <= fuelEuTarget2026GPerMJ ? 'COMPLIANT' : 'PENALTY_EXPOSURE';

  // Projected IMO Carbon Intensity Indicator (CII in gCO2 / (dwt * nm))
  // Grams CO2 / (cargo payload * nautical miles)
  const ciiValue = cargoDistanceTonnesNm > 0 
    ? (ttwEmissionsTonnes * 1_000_000) / cargoDistanceTonnesNm 
    : 8.5;

  let ciiRatingProjected: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
  if (ciiValue < 4.5) ciiRatingProjected = 'A';
  else if (ciiValue < 6.8) ciiRatingProjected = 'B';
  else if (ciiValue < 9.5) ciiRatingProjected = 'C';
  else if (ciiValue < 12.0) ciiRatingProjected = 'D';
  else ciiRatingProjected = 'E';

  return {
    fuelType,
    fuelConsumedTonnes,
    energyConsumedMJ,
    ttwEmissionsTonnes,
    wtwEmissionsTonnes,
    totalLifecycleGHGTonnes,
    ghgIntensityGPerMJ,
    fuelEuTarget2026GPerMJ,
    fuelEuComplianceStatus,
    ciiRatingProjected
  };
}

/**
 * Fuel Comparison Matrix for all alternative marine fuels
 */
export function getFuelComparisonMatrix() {
  const list = Object.values(FUELS_DATA);
  const baselineConsumption = 100; // 100 tonnes diesel energy equivalent: 4,270 GJ

  return list.map(fuel => {
    const energyRequiredMJ = baselineConsumption * 1000 * FUELS_DATA.Diesel.energyDensityMJkg;
    const requiredTonnage = energyRequiredMJ / (fuel.energyDensityMJkg * 1000);
    const costUSD = requiredTonnage * fuel.pricePerTonne;
    const ttwEmissions = requiredTonnage * fuel.ttwEmissionFactor;
    const wtwEmissions = requiredTonnage * fuel.wtwEmissionFactor;
    const ghgIntensity = (wtwEmissions * 1_000_000) / energyRequiredMJ;

    return {
      fuelType: fuel.id,
      name: fuel.name,
      pricePerTonne: fuel.pricePerTonne,
      energyDensity: fuel.energyDensityMJkg,
      storagePenaltyPct: fuel.tankStoragePenaltyPct,
      requiredTonnageForSameEnergy: Number(requiredTonnage.toFixed(1)),
      costUSD: Math.round(costUSD),
      ttwEmissionsTonnes: Number(ttwEmissions.toFixed(1)),
      wtwEmissionsTonnes: Number(wtwEmissions.toFixed(1)),
      ghgIntensityGPerMJ: Number(ghgIntensity.toFixed(1)),
      availability: fuel.availabilityRating,
      bunkerPortsCount: fuel.bunkeringInfrastructurePorts.length,
      description: fuel.description
    };
  });
}
