import { DisruptionEvent } from '../types';

export interface ReoptimizationPlanDiff {
  event: DisruptionEvent;
  timestamp: string;
  triggerCause: string;
  digitalTwinImpacts: string[];
  oldPlan: {
    assignedVessel: string;
    speedKnots: number;
    fuelType: string;
    route: string;
    eta: string;
    voyageCostUSD: number;
    voyageGHGTonnes: number;
    delayHours: number;
    shorePower: boolean;
  };
  newPlan: {
    assignedVessel: string;
    speedKnots: number;
    fuelType: string;
    route: string;
    eta: string;
    voyageCostUSD: number;
    voyageGHGTonnes: number;
    delayHours: number;
    shorePower: boolean;
  };
  deltaMetrics: {
    costChangeUSD: number;
    ghgChangeTonnes: number;
    delayMitigatedHours: number;
  };
  correctiveActions: {
    step: number;
    action: string;
    reason: string;
  }[];
}

export const PRESET_DISRUPTIONS: DisruptionEvent[] = [
  {
    id: "EVT-STORM-PACIFIC",
    title: "Pacific Superstorm Front (Wave Height 5.4m)",
    type: "WEATHER_STORM",
    severity: "Critical",
    affectedVoyageId: "VOY-801",
    affectedVesselId: "VES-103",
    description: "Intense low pressure system moving across 42°N Great Circle corridor. Wave resistance expected to increase fuel burn by +42% and delay arrival by 36 hours if course maintained.",
    timestamp: "2026-09-30 08:30"
  },
  {
    id: "EVT-PORT-ROTTERDAM",
    title: "Rotterdam OPS Shore-Power Substation Fault",
    type: "PORT_CONGESTION",
    severity: "Moderate",
    affectedVoyageId: "VOY-802",
    affectedVesselId: "VES-101",
    description: "Grid transformer maintenance at Maasvlakte terminal disables cold-ironing high voltage connection for next 72 hours.",
    timestamp: "2026-09-30 09:15"
  },
  {
    id: "EVT-BUNKER-SPIKE",
    title: "Singapore VLSFO Price Surge (+38%)",
    type: "FUEL_PRICE_SURGE",
    severity: "High",
    affectedVoyageId: "VOY-805",
    affectedVesselId: "VES-105",
    description: "Bunker fuel supply squeeze spikes conventional VLSFO to $890/tonne, rendering alternative Bio-Methanol economically favorable.",
    timestamp: "2026-09-30 10:00"
  },
  {
    id: "EVT-ENGINE-DERATE",
    title: "Main Engine Turbocharger Derating (VES-102)",
    type: "VESSEL_DEFECT",
    severity: "High",
    affectedVoyageId: "VOY-803",
    affectedVesselId: "VES-102",
    description: "High exhaust gas temperature triggers engine safety governor on Nordic Voyager, capping max continuous speed at 11.2 knots.",
    timestamp: "2026-09-30 11:20"
  }
];

export function executeDynamicReoptimization(event: DisruptionEvent): ReoptimizationPlanDiff {
  if (event.id === "EVT-STORM-PACIFIC") {
    return {
      event,
      timestamp: new Date().toISOString(),
      triggerCause: "Wave height > 5.0m breached safe hydro-structural limit on Great Circle track.",
      digitalTwinImpacts: [
        "Vessel EcoTitan Express encountering Sea State 7 (Significant Wave 5.4m).",
        "Calculated added wave drag Raw jumped from 1.08x to 1.44x baseline resistance.",
        "Deterministic delay projection: +34.5 hours breach of LA container terminal delivery window."
      ],
      oldPlan: {
        assignedVessel: "EcoTitan Express (VES-103)",
        speedKnots: 17.8,
        fuelType: "Methanol",
        route: "Northern Great Circle via Aleutians",
        eta: "2026-10-06 22:30 (+34h delay)",
        voyageCostUSD: 1420000,
        voyageGHGTonnes: 4120,
        delayHours: 34.5,
        shorePower: true
      },
      newPlan: {
        assignedVessel: "EcoTitan Express (VES-103)",
        speedKnots: 16.2,
        fuelType: "Methanol",
        route: "Southern Rhumb Line Weather Bypass (via Hawaii corridor)",
        eta: "2026-10-05 14:00 (On-Time / +0h delay)",
        voyageCostUSD: 1365000,
        voyageGHGTonnes: 3840,
        delayHours: 0.0,
        shorePower: true
      },
      deltaMetrics: {
        costChangeUSD: -55000,
        ghgChangeTonnes: -280,
        delayMitigatedHours: 34.5
      },
      correctiveActions: [
        {
          step: 1,
          action: "Waypoint Waymark Alteration",
          reason: "Rerouted vessel south of 32°N to circumvent storm center, encountering moderate waves < 2.2m despite +120 nm distance."
        },
        {
          step: 2,
          action: "Throttle Re-calibration",
          reason: "Reduced engine RPM to 16.2 knots; avoided extreme wave slamming and heavy fuel wastage in high sea-states."
        },
        {
          step: 3,
          action: "LA Berth Slot Synchronization",
          reason: "Pre-notified Port of Los Angeles Pier 400 dispatch, locking in preferential green-berth arrival slot without anchorage waiting."
        }
      ]
    };
  } else if (event.id === "EVT-PORT-ROTTERDAM") {
    return {
      event,
      timestamp: new Date().toISOString(),
      triggerCause: "Rotterdam cold-ironing shore power station unavailable for 72h.",
      digitalTwinImpacts: [
        "Vessel NautiQ Horizon cannot connect to 11kV shore power upon mooring.",
        "Auxiliary engine hoteling required during 48-hour container crane discharge."
      ],
      oldPlan: {
        assignedVessel: "NautiQ Horizon (VES-101)",
        speedKnots: 16.4,
        fuelType: "LNG",
        route: "Standard Suez corridor",
        eta: "2026-10-02 18:00",
        voyageCostUSD: 1890000,
        voyageGHGTonnes: 4950,
        delayHours: 0.0,
        shorePower: true
      },
      newPlan: {
        assignedVessel: "NautiQ Horizon (VES-101)",
        speedKnots: 15.8,
        fuelType: "LNG + Bio-diesel aux blend",
        route: "Standard Suez corridor",
        eta: "2026-10-02 22:30",
        voyageCostUSD: 1904000,
        voyageGHGTonnes: 4995,
        delayHours: 0.0,
        shorePower: false
      },
      deltaMetrics: {
        costChangeUSD: +14000,
        ghgChangeTonnes: +45,
        delayMitigatedHours: 0
      },
      correctiveActions: [
        {
          step: 1,
          action: "Disabled OPS Flag in Optimizer",
          reason: "Switched hoteling dispatch to onboard low-emission LNG/bio-diesel auxiliary genset."
        },
        {
          step: 2,
          action: "Transit Slow-Steaming Compensation",
          reason: "Trimmed cruising speed by 0.6 kts in Mediterranean to offset port auxiliary fuel expenditure."
        }
      ]
    };
  } else if (event.id === "EVT-BUNKER-SPIKE") {
    return {
      event,
      timestamp: new Date().toISOString(),
      triggerCause: "Singapore VLSFO price surged to $890/tonne (+38%).",
      digitalTwinImpacts: [
        "Voyage OPEX on VLSFO surpassed Bio-Methanol parity point.",
        "Optimizer cost function penalizes petroleum bunkering heavily."
      ],
      oldPlan: {
        assignedVessel: "Quantum Carrier (VES-105)",
        speedKnots: 15.6,
        fuelType: "Diesel",
        route: "East Asia Straits Trunk",
        eta: "2026-10-04 15:30",
        voyageCostUSD: 295000,
        voyageGHGTonnes: 920,
        delayHours: 0.0,
        shorePower: true
      },
      newPlan: {
        assignedVessel: "Quantum Carrier (VES-105)",
        speedKnots: 15.2,
        fuelType: "Methanol",
        route: "East Asia Straits Trunk",
        eta: "2026-10-04 17:00",
        voyageCostUSD: 278000,
        voyageGHGTonnes: 340,
        delayHours: 0.0,
        shorePower: true
      },
      deltaMetrics: {
        costChangeUSD: -17000,
        ghgChangeTonnes: -580,
        delayMitigatedHours: 0
      },
      correctiveActions: [
        {
          step: 1,
          action: "Automated Fuel Switchover",
          reason: "Activated vessel dual-fuel methanol tanks; bunkered 100% green methanol in Busan before departure."
        },
        {
          step: 2,
          action: "Emissions Abatement Bonus",
          reason: "WTW GHG plummeted by 63% while saving $17,000 net voyage cost."
        }
      ]
    };
  } else {
    // Engine defect
    return {
      event,
      timestamp: new Date().toISOString(),
      triggerCause: "Main Engine turbocharger pressure loss derates speed to 11.2 kts.",
      digitalTwinImpacts: [
        "Vessel Nordic Voyager cannot sustain planned 12.8 knots transit.",
        "Critical deadline risk for JNPT ore processing facility."
      ],
      oldPlan: {
        assignedVessel: "Nordic Voyager (VES-102)",
        speedKnots: 12.8,
        fuelType: "Diesel",
        route: "Arabian Sea Bulk Highway",
        eta: "2026-10-01 06:30",
        voyageCostUSD: 112000,
        voyageGHGTonnes: 410,
        delayHours: 18.0,
        shorePower: true
      },
      newPlan: {
        assignedVessel: "Nordic Voyager (VES-102)",
        speedKnots: 11.0,
        fuelType: "Diesel",
        route: "Direct Coastal Deepwater Cut",
        eta: "2026-10-01 14:00",
        voyageCostUSD: 98000,
        voyageGHGTonnes: 345,
        delayHours: 3.5,
        shorePower: true
      },
      deltaMetrics: {
        costChangeUSD: -14000,
        ghgChangeTonnes: -65,
        delayMitigatedHours: 14.5
      },
      correctiveActions: [
        {
          step: 1,
          action: "Safe Operating Limit Enforcement",
          reason: "Governed speed to 11.0 kts (below 80% defect torque limit) to prevent total propulsion failure at sea."
        },
        {
          step: 2,
          action: "Route Direct Cut & Tide Matching",
          reason: "Shortened track by 42 nm utilizing deepwater passage off Gulf of Kutch with favorable ebb tide."
        },
        {
          step: 3,
          action: "JNPT Berth Rescheduling",
          reason: "Negotiated adjusted tidal window at JNPT berth, averting demurrage penalty."
        }
      ]
    };
  }
}
