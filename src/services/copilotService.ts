import { VESSELS_DATA, VOYAGES_DATA, FUELS_DATA, PORTS_DATA } from '../data/mockData';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'OPTIMIZATION' | 'EMISSIONS' | 'VESSEL' | 'REGULATORY' | 'COST';
  dataPoints?: { label: string; value: string }[];
}

export const COPILOT_PRESET_QUESTIONS = [
  "Why was Methanol selected over Diesel for Voyage NQ-2026-0801?",
  "What happens if global carbon price increases to $120/tonne?",
  "Which vessels currently present the highest Carbon Intensity (CII) risk?",
  "Explain why EcoTitan Express rerouted during the Pacific storm.",
  "How much fuel and GHG does shore power save at Port of Rotterdam?"
];

export function answerFleetCopilotQuery(query: string): CopilotMessage {
  const q = query.toLowerCase();

  if (q.includes("methanol") || q.includes("801") || (q.includes("why") && q.includes("fuel"))) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      category: 'OPTIMIZATION',
      text: "On Voyage NQ-2026-0801 (Shanghai to LA, 5,800 nm), Methanol was selected by the AQPSO optimizer because it slashes lifecycle Well-to-Wake GHG from 4,120 tCO₂e down to 1,480 tCO₂e (-64% abatement). Under the voyage carbon budget constraint of 4,500 t, conventional VLSFO would breach environmental limits, while Bio-Methanol bunkering at Shanghai satisfies both IMO 2030 targets and zero-carbon corridor incentives.",
      dataPoints: [
        { label: "WTW GHG Abatement", value: "-64.1%" },
        { label: "Selected Fuel", value: "Bio-Methanol" },
        { label: "Fuel Cost", value: "$910 / tonne" },
        { label: "Port Bunkering", value: "Port of Shanghai (CNSHA)" }
      ],
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (q.includes("carbon price") || q.includes("120") || q.includes("tax")) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      category: 'REGULATORY',
      text: "At a $120/tonne carbon price, the operational cost tipping point flips completely in favor of alternative fuels. Conventional VLSFO incurs a $456/tonne effective carbon penalty, making its true cost $1,096/tonne (exceeding Bio-Methanol at $910/tonne). The fleet optimizer automatically triggers 100% green fuel substitution across 6 out of 8 transoceanic voyages, cutting overall fleet emissions by 48.2% and avoiding $1.65M in cumulative regulatory penalties.",
      dataPoints: [
        { label: "Carbon Tax Applied", value: "$120 / tCO₂e" },
        { label: "Alt-Fuel Adoption", value: "77% of fleet voyages" },
        { label: "Fleet GHG Trajectory", value: "7,150 tCO₂e (-48%)" },
        { label: "Penalty Averted", value: "$1.65 Million USD" }
      ],
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (q.includes("cii") || q.includes("highest") || q.includes("risk") || q.includes("rating")) {
    const dRated = VESSELS_DATA.filter(v => v.ciiRating === 'D' || v.ciiRating === 'E');
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      category: 'VESSEL',
      text: `Vessel Orion Bulk Leader (VES-108, Bulk Carrier, 82,000 DWT) currently has the lowest rating at Grade 'D' due to sole reliance on conventional heavy fuel and a 12.5-knot transit profile without dual-fuel flexibility. Aegis Chemist (VES-106) and Albatross Trader (VES-110) are at Grade 'C'. To prevent CII non-compliance under IMO MARPOL Annex VI, the optimizer recommends retrofitting wind-assisted propulsion or switching to bio-fuel drop-in blends.`,
      dataPoints: [
        { label: "Highest Risk Vessel", value: "Orion Bulk Leader (VES-108)" },
        { label: "Current CII Rating", value: "Grade D (Action Required)" },
        { label: "Primary Remediation", value: "De-rate speed to 11.2 kts & biofuel drop-in" }
      ],
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (q.includes("reroute") || q.includes("storm") || q.includes("ecotitan")) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      category: 'OPTIMIZATION',
      text: "EcoTitan Express encountered an intense North Pacific low-pressure system generating 5.4m significant wave height. Direct Great Circle transit would have spiked hydro-structural resistance (Raw) by +44%, burning an extra 210 tonnes of fuel and generating a 34.5-hour delay. The dynamic re-optimization engine shifted course south of 32°N (Hawaiian bypass), mitigating wave height to 2.1m and saving $55,000 net OPEX while ensuring on-time arrival.",
      dataPoints: [
        { label: "Wave Severity Avoided", value: "5.4m -> 2.1m" },
        { label: "Delay Mitigated", value: "34.5 Hours" },
        { label: "Fuel Saved", value: "115 Tonnes" }
      ],
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (q.includes("shore") || q.includes("rotterdam") || q.includes("cold ironing")) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'assistant',
      category: 'EMISSIONS',
      text: "At Port of Rotterdam, the onshore electricity grid features heavy offshore wind generation with a clean carbon intensity of only 180 gCO₂/kWh. Connecting a 14,000+ TEU container vessel for a 36-hour port call displaces 14.8 tonnes of auxiliary marine gasoil combustion, saving 47.4 tonnes of localized port GHG and 100% of NOx and SOx particulate matter at a modest net cost delta of $280.",
      dataPoints: [
        { label: "Local GHG Abated", value: "47.4 tCO₂e / call" },
        { label: "Grid Carbon Intensity", value: "180 gCO₂e / kWh" },
        { label: "Air Quality Benefit", value: "Zero NOx/PM at berth" }
      ],
      timestamp: new Date().toLocaleTimeString()
    };
  }

  // Default intelligent maritime response
  return {
    id: `copilot-${Date.now()}`,
    sender: 'assistant',
    category: 'OPTIMIZATION',
    text: `NautiQ Digital Twin monitoring 12 active fleet vessels and 8 transoceanic voyages. Current fleet operational fuel rate is 4,650 tonnes with 13,800 tCO₂e lifecycle GHG. AQPSO optimizer is configured with multi-objective trade-offs across speed de-rating, low-carbon fuels (LNG, Methanol, Ammonia), and cold-ironing shore power.`,
    dataPoints: [
      { label: "Monitored Fleet", value: "12 Vessels" },
      { label: "Active Corridors", value: "8 Voyages" },
      { label: "Optimizer Core", value: "Adaptive QPSO" }
    ],
    timestamp: new Date().toLocaleTimeString()
  };
}
