export type VesselType = 'Container' | 'Bulk Carrier' | 'Tanker' | 'Ro-Ro' | 'General Cargo';
export type FuelType = 'Diesel' | 'LNG' | 'Methanol' | 'Hydrogen' | 'Ammonia';
export type VesselStatus = 'At Sea' | 'In Port' | 'Anchored' | 'Maintenance';
export type VoyageStatus = 'Scheduled' | 'En Route' | 'Delayed' | 'Completed';
export type DecisionMode = 'greenest' | 'cheapest' | 'balanced' | 'reliability';
export type OptimizationAlgorithm = 'Greedy' | 'GA' | 'NSGA-II' | 'QPSO' | 'AQPSO';

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  type: VesselType;
  capacityTEUorDWT: number;
  capacityUnit: 'TEU' | 'DWT';
  length: number; // meters
  beam: number; // meters
  draft: number; // meters
  enginePower: number; // kW
  minSpeed: number; // knots
  maxSpeed: number; // knots
  designSpeed: number; // knots
  fuelCapabilities: FuelType[];
  primaryFuel: FuelType;
  fuelConsumptionBaseline: number; // tonnes/day at design speed
  status: VesselStatus;
  currentLat: number;
  currentLng: number;
  currentSpeed: number;
  heading: number;
  destinationPortId: string;
  eta: string;
  currentCargoLoad: number;
  shorePowerCompatible: boolean;
  auxiliaryPowerKW: number;
  ciiRating: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Port {
  id: string;
  name: string;
  code: string;
  country: string;
  latitude: number;
  longitude: number;
  shorePowerAvailable: boolean;
  electricityPriceKWh: number; // USD per kWh
  gridCarbonIntensity: number; // g CO2e / kWh
  fuelAvailability: FuelType[];
  avgPortWaitHours: number;
  berthDepth: number; // meters
}

export interface Voyage {
  id: string;
  voyageNumber: string;
  originPortId: string;
  destinationPortId: string;
  distanceNm: number;
  cargoDemand: number;
  cargoUnit: 'TEU' | 'DWT';
  departureTime: string;
  deadline: string;
  assignedVesselId: string;
  routeName: string;
  routeCoordinates: [number, number][];
  status: VoyageStatus;
  currentProgressPct: number;
  carbonBudgetTonnes: number;
  recommendedSpeedKnots: number;
  selectedFuel: FuelType;
  useShorePower: boolean;
  estimatedDelayHours: number;
}

export interface FuelSpecification {
  id: FuelType;
  name: string;
  pricePerTonne: number; // USD / t
  energyDensityMJkg: number; // MJ / kg
  tankStoragePenaltyPct: number; // % payload reduction
  ttwEmissionFactor: number; // t CO2e / t fuel (Tank-to-Wake)
  wtwEmissionFactor: number; // t CO2e / t fuel (Well-to-Wake)
  availabilityRating: 'High' | 'Medium' | 'Emerging' | 'Low';
  bunkeringInfrastructurePorts: string[];
  description: string;
}

export interface WeatherCondition {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  windSpeedKnots: number;
  windDirectionDeg: number;
  waveHeightMeters: number;
  waveDirectionDeg: number;
  currentSpeedKnots: number;
  seaStateText: 'Calm' | 'Moderate' | 'Rough' | 'Very Rough' | 'Storm';
  resistanceMultiplier: number;
  temperatureC: number;
}

export interface FuelPredictionResult {
  vesselId: string;
  vesselName: string;
  distanceNm: number;
  speedKnots: number;
  fuelType: FuelType;
  cargoLoadPct: number;
  weatherResistanceFactor: number;
  
  // Physics Model
  physicsEnginePowerKW: number;
  physicsDailyFuelTonnes: number;
  physicsTotalFuelTonnes: number;
  travelTimeHours: number;
  
  // ML Model
  mlPredictedFuelTonnes: number;
  fuelPerNauticalMileKg: number;
  uncertaintyIntervalTonnes: [number, number];
  mlResidualCorrectionTonnes: number;
  
  // Cost & Emissions
  fuelCostUSD: number;
  ttwEmissionsTonnes: number;
  wtwEmissionsTonnes: number;
  totalLifecycleGHGTonnes: number;
  
  featureContributions: {
    feature: string;
    importancePct: number;
    impactDescription: string;
  }[];
}

export interface ShorePowerEvaluation {
  portId: string;
  portName: string;
  vesselId: string;
  berthHours: number;
  shorePowerEligible: boolean;
  auxFuelTonnesSaved: number;
  auxFuelCostUSD: number;
  auxGHGTonnes: number;
  shoreElectricityKWh: number;
  shorePowerCostUSD: number;
  shorePowerGHGTonnes: number;
  costDeltaUSD: number; // positive = shore power is more expensive
  ghgSavedTonnes: number; // positive = net GHG reduction
  recommended: boolean;
  rationale: string;
}

export interface SolutionAssignment {
  voyageId: string;
  voyageNumber: string;
  origin: string;
  destination: string;
  vesselId: string;
  vesselName: string;
  vesselType: VesselType;
  assignedCargo: number;
  cargoCapacityRatioPct: number;
  speedKnots: number;
  fuelType: FuelType;
  useShorePower: boolean;
  fuelTonnes: number;
  costUSD: number;
  ghgTonnes: number;
  transitHours: number;
  delayHours: number;
  riskIndex: number;
  feasible: boolean;
}

export interface ParetoSolution {
  id: string;
  name: string;
  decisionTag: DecisionMode | 'pareto';
  algorithm: OptimizationAlgorithm;
  assignments: SolutionAssignment[];
  totalFuelTonnes: number;
  totalCostUSD: number;
  totalLifecycleGHGTonnes: number;
  maxDelayHours: number;
  avgRiskIndex: number; // 0 - 100
  isFeasible: boolean;
  carbonBudgetSatisfied: boolean;
  carbonBudgetTonnes: number;
  usedCarbonPct: number;
  constraintRepairsCount: number;
  constraintRepairs: {
    constraint: string;
    voyageOrVessel: string;
    action: string;
    beforeValue: string;
    afterValue: string;
  }[];
  explanation: {
    headline: string;
    vesselSelectionReason: string;
    speedPolicyReason: string;
    fuelStrategyReason: string;
    shorePowerReason: string;
    tradeoffSummary: string;
  };
}

export interface OptimizationRunResult {
  runId: string;
  algorithm: OptimizationAlgorithm;
  timestamp: string;
  fleetSize: number;
  voyagesCount: number;
  iterationsCompleted: number;
  populationSize: number;
  solutionsEvaluated: number;
  runtimeSeconds: number;
  convergenceHistory: {
    iteration: number;
    bestCostUSD: number;
    bestGHGTonnes: number;
    bestFuelTonnes: number;
    hypervolume: number;
  }[];
  paretoFrontier: ParetoSolution[];
  greenestPlan: ParetoSolution;
  cheapestPlan: ParetoSolution;
  balancedPlan: ParetoSolution;
  reliabilityPlan: ParetoSolution;
}

export interface ScenarioSimulationParams {
  fuelPriceMultiplier: number; // e.g. 1.0 = base, 1.3 = +30%
  carbonTaxPerTonneUSD: number; // e.g. $80/tonne CO2
  cargoDemandMultiplier: number; // e.g. 1.1 = +10%
  weatherSeverityMultiplier: number; // e.g. 1.25 = rougher seas
  deadlineUrgencyHoursDelta: number; // e.g. -12 = tight deadline
  electricityPriceMultiplier: number; // shore power
  gridCarbonIntensityMultiplier: number;
  methanolSubsidyUSDPerTonne: number;
}

export interface ScenarioComparisonResult {
  params: ScenarioSimulationParams;
  baseline: {
    fuelTonnes: number;
    costUSD: number;
    ghgTonnes: number;
    delayHours: number;
    altFuelSharePct: number;
  };
  scenario: {
    fuelTonnes: number;
    costUSD: number;
    ghgTonnes: number;
    delayHours: number;
    altFuelSharePct: number;
  };
  delta: {
    fuelTonnes: number;
    fuelPct: number;
    costUSD: number;
    costPct: number;
    ghgTonnes: number;
    ghgPct: number;
    delayHours: number;
  };
  changedDecisions: {
    category: string;
    voyage: string;
    before: string;
    after: string;
    impact: string;
  }[];
  executiveSummary: string;
}

export interface DisruptionEvent {
  id: string;
  title: string;
  type: 'WEATHER_STORM' | 'PORT_CONGESTION' | 'FUEL_PRICE_SURGE' | 'VESSEL_DEFECT' | 'CARBON_REGULATION';
  severity: 'Moderate' | 'High' | 'Critical';
  affectedVoyageId: string;
  affectedVesselId: string;
  description: string;
  timestamp: string;
}

export interface AlgorithmBenchmarkRow {
  algorithm: OptimizationAlgorithm;
  description: string;
  quantumInspired: boolean;
  runtimeSeconds: number;
  iterations: number;
  solutionsEvaluated: number;
  paretoCount: number;
  minFuelTonnes: number;
  minCostUSD: number;
  minGHGTonnes: number;
  avgDelayHours: number;
  constraintViolationsRepairRatePct: number;
  hypervolumeCoveragePct: number;
  ranking: number;
}
