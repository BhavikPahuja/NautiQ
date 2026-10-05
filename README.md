# NautiQ GreenOps

> **Quantum-Inspired Maritime Digital Twin for Predictive Fuel Intelligence & Green Fleet Optimization**  
> **Problem Statement ID:** 26138 | **Theme:** Clean & Green Technology | **Organization:** Egreen Quanta  
> **Prototype Mode:** Complete Frontend Digital Twin (Autonomous Client-Side Simulation)

---

## 🌊 Overview

**NautiQ GreenOps** is a comprehensive maritime operations and fleet optimization digital twin designed to accelerate shipping decarbonization under **IMO MEPC 80** and **FuelEU Maritime 2026** mandates.

The application follows the closed-loop paradigm:
$$\text{OBSERVE} \longrightarrow \text{PREDICT} \longrightarrow \text{OPTIMIZE} \longrightarrow \text{EXPLAIN} \longrightarrow \text{ADAPT}$$

This prototype runs **frontend-only with rich deterministic simulations and hardcoded domain datasets**, requiring **no external databases or Python microservices** to run immediately.

---

## ⚡ Key Highlights & Modules

| Module | Route | Capabilities |
| :--- | :--- | :--- |
| **Executive Dashboard** | `/dashboard` | High-level fleet KPIs, active corridors, monthly fuel/GHG trends, live GIS telematics preview, and carbon quota tracking. |
| **Fleet & Vessel Twin** | `/fleet` | Technical profiles for 12 vessels across 5 ship classes (Container, Bulk Carrier, Tanker, Ro-Ro, General Cargo), multi-fuel certifications, and CII grades. |
| **Maritime GIS Map** | `/map` | Global interactive chart showing vessel positions, shipping corridors, bunkering ports with shore-power, and wave/wind overlay buoys. |
| **Fuel Prediction Engine** | `/prediction` | Dual-engine: Physics-informed Admiralty propulsion model ($P \propto v^3$) + XGBoost hybrid residual correction ($R^2 = 0.964$). |
| **Quantum-Inspired Optimizer** | `/optimization` | **Adaptive QPSO (AQPSO)** with quantum delta potential well exploration, constraint repair, non-dominated Pareto sorting, and 4 decision modes (*Greenest, Cheapest, Balanced, Reliability-first*). |
| **Scenario Lab** | `/scenarios` | What-if policy sandbox: sliders for carbon tax ($/t), bunker prices, weather severity, cargo surges, and side-by-side delta comparisons. |
| **Dynamic Re-Optimization** | `/disruptions` | Automated incident response: superstorms, cold-ironing outages, bunker spikes, or engine faults. Outputs side-by-side plan diffs. |
| **Algorithm Benchmarks** | `/benchmark` | Scientific reproducibility suite comparing AQPSO, QPSO, NSGA-II, GA, and Greedy heuristic across runtime, hypervolume, and iterations. |
| **Carbon Intelligence** | `/carbon` | Statutory IMO CII grade distributions (A to E), FuelEU Maritime compliance ($gCO_2e/MJ$), and alternative fuel lifecycle matrix. |
| **NautiQ Copilot** | `/copilot` | Deterministic, zero-hallucination maritime operational AI assistant answering fleet and regulatory queries. |
| **SIH 5-Min Story Tour** | Modal | 10-step interactive presentation storyboard guiding evaluators through the complete end-to-end evaluation flow. |

---

## 🧪 Mathematical & Algorithmic Foundations

### 1. Admiralty Propulsion Law
Propulsion power $P$ (kW) is modeled as:
$$P = \frac{\Delta^{2/3} \cdot v^3}{C_{adm}} \cdot \eta_{weather}$$
where $\Delta$ is full displacement displacement (lightweight + payload draft), $v$ is cruising speed in knots, $C_{adm}$ is the Admiralty hull coefficient, and $\eta_{weather}$ accounts for wave added resistance ($R_{aw} \propto \zeta_a^{1.8}$).

### 2. Quantum-Inspired Particle Swarm Optimization (AQPSO)
Particles move in a quantum delta potential well rather than following Newtonian velocity clamping:
$$x_{ij}(t+1) = p_{ij} \pm \alpha(t) \cdot |mbest_j - x_{ij}(t)| \cdot \ln(1/u)$$
- $mbest$: Mean best position of all particles
- $\alpha(t)$: Adaptive contraction-expansion coefficient tuning exploration vs exploitation dynamically based on Pareto diversity and constraint violation feedback.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js v18+ (tested on v22)
- npm

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 🛡️ Synthetic Data Disclosure
All fleet positions, vessel dimensions, weather buoys, and bunker costs are labeled as **SYNTHETIC DEMONSTRATION DATA** for SIH PS-26138 evaluation, protecting operational credibility while providing mathematically rigorous simulation behavior.
