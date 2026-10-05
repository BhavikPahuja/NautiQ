import { Vessel, FuelType } from '../types';
import { FUELS_DATA } from '../data/mockData';

export interface PhysicsParams {
  vessel: Vessel;
  speedKnots: number;
  distanceNm: number;
  cargoLoadRatio: number; // 0.0 to 1.0
  waveHeightMeters?: number;
  windSpeedKnots?: number;
  fuelType?: FuelType;
}

export interface PhysicsOutput {
  estimatedPowerKW: number;
  dailyFuelConsumptionTonnes: number;
  totalFuelTonnes: number;
  fuelPerNmKg: number;
  travelTimeHours: number;
  weatherResistanceFactor: number;
  admiraltyCoefficient: number;
  displacementTonnes: number;
}

/**
 * Baseline Physics-Informed Maritime Propulsion Model
 * Based on the Admiralty Law: P = (Displacement^(2/3) * Speed^3) / C_adm
 * Enhanced with cargo draft displacement and sea-state resistance.
 */
export function calculatePhysicsPropulsion(params: PhysicsParams): PhysicsOutput {
  const { vessel, speedKnots, distanceNm, cargoLoadRatio, waveHeightMeters = 1.5, windSpeedKnots = 12, fuelType } = params;

  // 1. Estimate displacement based on lightweight + cargo payload
  const maxPayload = vessel.capacityTEUorDWT * (vessel.capacityUnit === 'TEU' ? 14.0 : 1.0); // approx 14t per TEU
  const lightweightEstimate = vessel.length * vessel.beam * vessel.draft * 0.18;
  const currentPayload = maxPayload * Math.max(0.1, Math.min(1.0, cargoLoadRatio));
  const displacementTonnes = lightweightEstimate + currentPayload;

  // 2. Base Admiralty Coefficient (higher for modern sleek container, lower for blunt bulk)
  let baseAdmiralty = 580;
  if (vessel.type === 'Container') baseAdmiralty = 620;
  else if (vessel.type === 'Tanker') baseAdmiralty = 540;
  else if (vessel.type === 'Bulk Carrier') baseAdmiralty = 510;
  else if (vessel.type === 'Ro-Ro') baseAdmiralty = 590;

  // 3. Environmental resistance factor (wind + wave quadratic resistance)
  // R_aw proportional to wave_height^2
  const waveResistance = 1.0 + 0.022 * Math.pow(Math.max(0, waveHeightMeters), 1.8);
  const windResistance = 1.0 + 0.0018 * Math.pow(Math.max(0, windSpeedKnots), 1.4);
  const weatherResistanceFactor = Number((waveResistance * windResistance).toFixed(3));

  // 4. Power requirement P (kW) proportional to displacement^(2/3) and speed^3
  // P = (Displacement^(2/3) * v^3 / C_adm) * weather_factor
  const dispTerm = Math.pow(displacementTonnes, 2 / 3);
  const speedTerm = Math.pow(speedKnots, 3);
  const rawPowerKW = ((dispTerm * speedTerm) / baseAdmiralty) * weatherResistanceFactor;

  // Clamp within vessel engine limits with 85% MCR normal operating margin
  const maxContinuousRating = vessel.enginePower * 0.95;
  const estimatedPowerKW = Math.min(maxContinuousRating, Math.max(vessel.enginePower * 0.12, rawPowerKW));

  // 5. Fuel Energy Density & Specific Fuel Oil Consumption (SFOC)
  // Baseline modern 2-stroke low-speed diesel engine SFOC ~ 168 g/kWh
  const selectedFuel = fuelType || vessel.primaryFuel;
  const fuelSpec = FUELS_DATA[selectedFuel] || FUELS_DATA.Diesel;
  
  // Adjust SFOC by fuel lower heating value (LHV) ratio against standard marine diesel (42.7 MJ/kg)
  const energyFactor = 42.7 / fuelSpec.energyDensityMJkg;
  const effectiveSfocGPerKWh = 172 * energyFactor;

  // Daily fuel consumption in tonnes
  const hourlyFuelTonnes = (estimatedPowerKW * effectiveSfocGPerKWh) / 1_000_000;
  const dailyFuelConsumptionTonnes = Number((hourlyFuelTonnes * 24).toFixed(2));

  // 6. Transit time and total fuel
  const safeSpeed = Math.max(5.0, speedKnots);
  const travelTimeHours = Number((distanceNm / safeSpeed).toFixed(1));
  const totalFuelTonnes = Number((hourlyFuelTonnes * travelTimeHours).toFixed(2));
  const fuelPerNmKg = Number(((totalFuelTonnes * 1000) / distanceNm).toFixed(2));

  return {
    estimatedPowerKW: Math.round(estimatedPowerKW),
    dailyFuelConsumptionTonnes,
    totalFuelTonnes,
    fuelPerNmKg,
    travelTimeHours,
    weatherResistanceFactor,
    admiraltyCoefficient: baseAdmiralty,
    displacementTonnes: Math.round(displacementTonnes)
  };
}
