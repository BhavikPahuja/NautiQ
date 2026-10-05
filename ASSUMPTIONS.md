# Scientific & Operational Assumptions

> **NautiQ GreenOps Prototype — SIH PS-26138**  
> Document required under Section 51 of Project Master Specification

---

## 1. Data Provenance & Synthetic Disclaimer
* **Fleet Telematics:** AIS positions, vessel names, and IMO numbers are realistic synthetic entities representative of modern commercial maritime operations.
* **Weather Buoys:** Significant wave heights, wind vectors, and sea-states are generated according to the Douglas Sea Scale for ocean corridors (North Pacific, Arabian Sea, Bay of Bengal, North Sea).

## 2. Propulsion & Hydrodynamics
* **Admiralty Law:** Baseline propulsion power follows $P \propto \Delta^{2/3} \cdot v^3 / C_{adm}$.
* **Admiralty Coefficients ($C_{adm}$):**
  * Container Vessels: 620 (slender, fine hull lines)
  * Bulk Carriers: 510 (full, blunt hull form)
  * Tankers: 540
  * Ro-Ro: 590
* **Specific Fuel Oil Consumption (SFOC):** Baseline 2-stroke low-speed main engine consumes $168\text{--}172\text{ g/kWh}$ on standard marine fuel ($42.7\text{ MJ/kg}$). For alternative fuels, SFOC is scaled inversely proportional to Lower Heating Value (LHV).
* **Wave Added Resistance ($R_{aw}$):** Scaled quadratically with significant wave height: $\Delta R \propto H_s^{1.8}$.

## 3. Alternative Fuel Emissions & Densities
Sourced from **IMO 4th GHG Study** and **FuelEU Maritime 2026 Reference Framework**:
* **Diesel (VLSFO / MGO):** TTW: $3.151\text{ tCO}_2\text{/t}$, WTW: $3.840\text{ tCO}_2\text{/t}$, Energy: $42.7\text{ MJ/kg}$.
* **LNG:** TTW: $2.750\text{ tCO}_2\text{/t}$, WTW: $3.320\text{ tCO}_2\text{/t}$, Energy: $48.6\text{ MJ/kg}$ (includes moderate methane slip assumption).
* **Bio / E-Methanol:** TTW: $1.375\text{ tCO}_2\text{/t}$, WTW: $0.650\text{ tCO}_2\text{/t}$, Energy: $19.9\text{ MJ/kg}$ (carbon-neutral renewable synthesis credit applied).
* **Green Ammonia:** TTW: $0.050\text{ tCO}_2\text{/t}$ (pilot ignition fuel), WTW: $0.420\text{ tCO}_2\text{/t}$, Energy: $18.6\text{ MJ/kg}$.
* **Liquid Hydrogen:** TTW: $0.000\text{ tCO}_2\text{/t}$, WTW: $0.280\text{ tCO}_2\text{/t}$, Energy: $120.0\text{ MJ/kg}$ (renewable electrolysis upstream footprint).

## 4. Cold-Ironing (OPS) Shore Power
* Auxiliary hoteling load estimated at $800\text{--}3,400\text{ kW}$ depending on vessel capacity and reefer container plug counts.
* Port electricity prices range from $\$0.11\text{/kWh}$ (JNPT) to $\$0.25\text{/kWh}$ (Hamburg).
* Grid carbon intensity ranges from $180\text{ gCO}_2\text{/kWh}$ (Rotterdam, high offshore wind) to $680\text{ gCO}_2\text{/kWh}$ (JNPT).

## 5. Quantum-Inspired Swarm Optimization
* Classical QPSO and AQPSO algorithms operate with delta potential wells and mean best position ($mbest$).
* Algorithms run strictly on standard CPU/browser hardware using probabilistic sampling equations; no claim of physical quantum computer supremacy is made.
