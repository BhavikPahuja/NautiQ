import { Port, Vessel, ShorePowerEvaluation } from '../types';

/**
 * Onshore Power Supply (OPS) / Cold Ironing Evaluation Model
 * Evaluates whether plugging into port electricity beats burning auxiliary diesel at berth
 */
export function evaluateShorePowerOption(
  vessel: Vessel,
  port: Port,
  berthHours: number = 24
): ShorePowerEvaluation {
  // Check physical compatibility
  const shorePowerEligible = vessel.shorePowerCompatible && port.shorePowerAvailable;

  // Auxiliary power requirement while berthed (hoteling load: reefer containers, lighting, pumps)
  const auxKW = vessel.auxiliaryPowerKW || 1500;

  // 1. Baseline: Auxiliary engine burning MGO at berth
  // SFOC for medium-speed 4-stroke auxiliary genset ~ 205 g/kWh
  const auxSfocGPerKWh = 205;
  const auxHourlyFuelTonnes = (auxKW * auxSfocGPerKWh) / 1_000_000;
  const auxFuelTonnes = Number((auxHourlyFuelTonnes * berthHours).toFixed(2));
  // MGO marine gasoil price approx $780/tonne
  const auxFuelCostUSD = Math.round(auxFuelTonnes * 780);
  // MGO TTW emission factor 3.206 tCO2/t
  const auxGHGTonnes = Number((auxFuelTonnes * 3.206).toFixed(2));

  // 2. Shore Power alternative: Grid electricity
  const totalElectricityKWh = auxKW * berthHours;
  const shorePowerCostUSD = Math.round(totalElectricityKWh * port.electricityPriceKWh);
  // Grid emissions = (kWh * gCO2/kWh) / 1,000,000 g/t
  const shorePowerGHGTonnes = Number(((totalElectricityKWh * port.gridCarbonIntensity) / 1_000_000).toFixed(2));

  // Net deltas
  const costDeltaUSD = shorePowerCostUSD - auxFuelCostUSD;
  const ghgSavedTonnes = Number((auxGHGTonnes - shorePowerGHGTonnes).toFixed(2));

  // Recommendation logic:
  // Recommended if technically feasible AND (GHG saved > 0 and cost delta <= +$800 or cheaper)
  let recommended = false;
  let rationale = "";

  if (!shorePowerEligible) {
    recommended = false;
    rationale = !vessel.shorePowerCompatible
      ? `Vessel ${vessel.name} lacks high-voltage cold-ironing transformer and switchboard.`
      : `Port ${port.name} does not offer OPS shore-side power connection.`;
  } else if (ghgSavedTonnes > 0 && costDeltaUSD <= 400) {
    recommended = true;
    rationale = `OPS recommended: Abates ${ghgSavedTonnes} tCO₂e (${Math.round((ghgSavedTonnes / auxGHGTonnes) * 100)}% cut) at clean ${port.gridCarbonIntensity} g/kWh grid.`;
  } else if (ghgSavedTonnes > 0 && costDeltaUSD > 400) {
    // Green recommendation with cost premium
    recommended = true;
    rationale = `Recommended for Green compliance: Cuts ${ghgSavedTonnes} tCO₂e with $${costDeltaUSD} premium over auxiliary bunker fuel.`;
  } else {
    recommended = false;
    rationale = `Grid carbon intensity (${port.gridCarbonIntensity} g/kWh) exceeds auxiliary generator efficiency. Grid emissions would be higher.`;
  }

  return {
    portId: port.id,
    portName: port.name,
    vesselId: vessel.id,
    berthHours,
    shorePowerEligible,
    auxFuelTonnesSaved: auxFuelTonnes,
    auxFuelCostUSD,
    auxGHGTonnes,
    shoreElectricityKWh: totalElectricityKWh,
    shorePowerCostUSD,
    shorePowerGHGTonnes,
    costDeltaUSD,
    ghgSavedTonnes,
    recommended,
    rationale
  };
}
