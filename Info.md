# MASTER CODING AGENT PROMPT — NAUTIQ GREENOPS

You are the lead software architect, ML engineer, optimization researcher, backend engineer, frontend engineer, data engineer, and QA engineer responsible for building the complete working prototype of:

# NautiQ GreenOps

## Quantum-Inspired Maritime Digital Twin for Predictive Fuel Intelligence & Green Fleet Optimization

This is an SIH-level project based on:

**Problem Statement ID:** 26138
**Organization:** Egreen Quanta
**Theme:** Clean & Green Technology
**PS Title:** Quantum-Inspired Fuel Consumption Prediction and Green Fleet Optimization

The complete PS and project context are provided separately. Treat them as the source of truth for the functional requirements.

---

# 1. PRIMARY OBJECTIVE

Build a complete, runnable, production-quality prototype that solves the maritime fleet optimization problem end-to-end.

The system must:

> OBSERVE → PREDICT → OPTIMIZE → EXPLAIN → ADAPT

It must not be a static dashboard or a toy ML demo.

The final application should allow a user to:

1. Create/manage vessels.
2. Create/manage voyages.
3. Manage ports and routes.
4. View fleet operations on a map.
5. Predict fuel consumption.
6. Estimate lifecycle emissions.
7. Compare conventional and alternative fuels.
8. evaluate shore-power decisions.
9. Optimize fleet deployment.
10. Optimize vessel assignment.
11. Optimize cruising speed.
12. Optimize fuel selection.
13. Optimize shore-power usage.
14. Satisfy cargo and schedule constraints.
15. Generate Pareto-optimal solutions.
16. Compare Greenest / Cheapest / Balanced / Reliability-first plans.
17. Run what-if scenarios.
18. Run benchmark comparisons between optimization algorithms.
19. Explain why a solution was selected.
20. Trigger dynamic re-optimization after a disruption.
21. Visualize before/after results.

---

# 2. IMPORTANT ENGINEERING RULE

DO NOT build fake functionality.

Every major feature must have a working implementation behind the UI.

Do not create buttons that merely display static results.

Do not hardcode fake benchmark improvements.

Do not invent ML accuracy.

Do not claim quantum advantage.

Do not fabricate fuel-consumption datasets.

If real data is unavailable, create a clearly labelled synthetic/demo-data generator and mark its output as synthetic.

The UI must clearly distinguish:

* Real data
* Synthetic/demo data
* Simulated results
* Assumptions
* Measured experimental results

---

# 3. FIRST STEP — INSPECT THE EXISTING REPOSITORY

Before modifying anything:

1. Inspect the entire repository.
2. Identify the existing frontend.
3. Identify the existing backend.
4. Identify database configuration.
5. Identify existing authentication.
6. Identify existing components.
7. Identify reusable UI.
8. Identify existing environment variables.
9. Identify existing deployment configuration.
10. Identify whether a Python service already exists.

Do NOT destroy existing working functionality.

If an existing architecture is present, integrate into it.

If the repository is empty or unsuitable, establish the architecture described below.

---

# 4. PREFERRED TECHNOLOGY STACK

Use technologies already present in the repository where practical.

Preferred architecture:

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Recharts or ECharts
* Leaflet or Mapbox
* Lucide icons

## Backend

* Java
* Spring Boot
* REST APIs
* PostgreSQL
* PostGIS where useful

## AI / Optimization

* Python
* FastAPI
* NumPy
* Pandas
* Scikit-learn
* XGBoost
* SciPy where useful

Optimization algorithms:

* Greedy baseline
* Genetic Algorithm
* NSGA-II
* QPSO
* AQPSO

## Communication

```text
React
  ↓
Spring Boot REST API
  ↓
Python AI/Optimization service
  ↓
PostgreSQL/PostGIS
```

If the existing project already uses Node.js instead of Spring Boot, do not rewrite the entire backend unnecessarily. Preserve the existing stack and introduce Python only where needed for ML/optimization.

---

# 5. HIGH-LEVEL ARCHITECTURE

Implement:

```text
                         NAUTIQ GREENOPS
                               |
              +----------------+----------------+
              |                                 |
         DATA LAYER                        USER LAYER
              |                                 |
      +-------+--------+                 Web Dashboard
      |       |        |                 Fleet Map
     AIS   Weather   Vessel              Analytics
      |       |        |                 Scenario Lab
      |       |        |                 Optimization
      +-------+--------+
              |
              v
      DATA PROCESSING
              |
      Voyage Reconstruction
      Feature Engineering
      Data Cleaning
              |
              v
       MARITIME DIGITAL TWIN
              |
       +------+------+
       |             |
       v             v
 Fuel Prediction   Emission Engine
       |             |
       +------+------+
              |
              v
   QUANTUM-INSPIRED OPTIMIZER
              |
      +-------+--------+
      |                |
   QPSO/AQPSO     Constraint Repair
      |                |
      +-------+--------+
              |
              v
       PARETO SOLUTIONS
              |
      +-------+-------+
      |       |       |
      v       v       v
    Green   Cheap   Balanced
              |
              v
    EXPLAINABLE DECISION
              |
              v
     SCENARIO SIMULATION
              |
              v
     DYNAMIC RE-OPTIMIZATION
```

---

# 6. DEVELOPMENT STRATEGY

Do not attempt to build everything blindly in one pass.

Work in the following order:

## Phase 0

Repository and architecture audit.

## Phase 1

Database + domain model.

## Phase 2

Synthetic/demo data generator.

## Phase 3

Physics fuel model.

## Phase 4

ML fuel prediction service.

## Phase 5

Lifecycle emission engine.

## Phase 6

Optimization engine.

## Phase 7

Constraint repair.

## Phase 8

Benchmark engine.

## Phase 9

Spring Boot/API integration.

## Phase 10

Frontend dashboard.

## Phase 11

Scenario simulator.

## Phase 12

Dynamic re-optimization.

## Phase 13

Testing.

## Phase 14

Demo data and SIH presentation mode.

Do not move to the next phase until the previous phase has a minimally working implementation.

---

# 7. DOMAIN MODEL

Create the following core entities.

## Vessel

Fields:

```text
id
name
type
capacity
length
beam
draft
enginePower
minSpeed
maxSpeed
fuelCapabilities
fuelConsumptionBaseline
status
```

Possible vessel types:

```text
Container
Bulk Carrier
Tanker
Ro-Ro
General Cargo
Other
```

---

## Voyage

Fields:

```text
id
originPort
destinationPort
distance
cargoDemand
departureTime
deadline
assignedVessel
route
status
```

---

## Port

Fields:

```text
id
name
latitude
longitude
shorePowerAvailable
electricityPrice
gridCarbonIntensity
fuelAvailability
```

---

## Fuel

Fields:

```text
id
name
pricePerUnit
energyDensity
tankPenalty
ttwEmissionFactor
wtwEmissionFactor
availability
compatibleVesselTypes
```

Include:

```text
Diesel
LNG
Methanol
Hydrogen
Ammonia
```

Do not use arbitrary emission factors without documenting the source or marking them as demo assumptions.

---

## Weather

Fields:

```text
timestamp
latitude
longitude
windSpeed
windDirection
waveHeight
waveDirection
currentSpeed
currentDirection
temperature
seaState
```

---

## OptimizationRun

Fields:

```text
id
algorithm
startedAt
completedAt
iterations
populationSize
solutionsEvaluated
status
objectiveConfiguration
constraintConfiguration
```

---

## OptimizationSolution

Fields:

```text
id
runId
vesselAssignment
voyageAssignment
speed
fuel
route
shorePower
cargoAllocation
fuelConsumption
cost
ghg
delay
risk
feasible
```

---

# 8. DATABASE

Use PostgreSQL.

Use PostGIS if geospatial functionality is needed.

Create proper migrations.

Do NOT rely on manually created database tables.

Use:

* Flyway or Liquibase for Spring Boot.

Create indexes for:

* vessel IDs
* voyage IDs
* timestamps
* ports
* geographic coordinates
* optimization runs

---

# 9. DEMO DATA GENERATOR

The application must work without external datasets.

Create a deterministic synthetic-data generator.

Generate:

## Fleet

At least:

```text
10–20 vessels
```

with different:

* capacities
* speeds
* fuel compatibility
* engine powers
* vessel types

## Ports

At least:

```text
5–10 ports
```

## Voyages

At least:

```text
15–30 voyages
```

## Weather

Generate realistic varying conditions.

## Fuel

Create configurable demo assumptions.

IMPORTANT:

Clearly label the dataset:

> SYNTHETIC DEMONSTRATION DATA

Do not present it as real maritime operational data.

---

# 10. PHYSICS FUEL MODEL

Implement a baseline physics-informed model.

At minimum:

$$
P \propto v^3
$$

and use a speed-sensitive fuel-consumption model.

Create a module:

```text
physics_fuel_model.py
```

It should expose something like:

```python
predict_fuel(
    vessel,
    speed,
    distance,
    cargo_load,
    weather,
    fuel
)
```

Return:

```json
{
  "fuelConsumption": ...,
  "fuelPerNm": ...,
  "estimatedPower": ...,
  "estimatedTravelTime": ...
}
```

Document every assumption.

---

# 11. ML FUEL PREDICTOR

Implement a hybrid ML architecture.

Initial model:

```text
Physics baseline
        +
XGBoost residual/correction model
```

Features:

```text
vessel type
capacity
length
beam
draft
cargo load
speed
distance
wind speed
wind direction
wave height
wave direction
current
temperature
sea state
fuel type
engine power
```

Output:

```text
fuel consumption
```

Implement:

```text
train()
predict()
evaluate()
save_model()
load_model()
```

Use joblib or an appropriate model serialization mechanism.

---

# 12. MODEL EVALUATION

Implement:

```text
MAE
RMSE
MAPE
R²
```

Provide API:

```http
POST /api/ml/train
POST /api/ml/predict
GET /api/ml/metrics
```

The UI should show:

```text
Physics baseline
Random Forest
XGBoost
Hybrid model
```

only when models are actually trained.

Never fabricate metrics.

---

# 13. LIFECYCLE EMISSION ENGINE

Create an emission engine that distinguishes:

```text
Tank-to-Wake
Well-to-Wake / lifecycle
```

For a fuel:

$$
GHG = FuelConsumed \times EmissionFactor
$$

Support configurable emission factors.

Store source/assumption metadata.

Output:

```json
{
  "ttwEmissions": ...,
  "wtwEmissions": ...,
  "totalLifecycleEmissions": ...
}
```

---

# 14. ALTERNATIVE FUEL ENGINE

For each fuel calculate:

```text
cost
energy density
lifecycle emissions
vessel compatibility
availability
storage penalty
range effect
```

Create an API:

```http
POST /api/fuels/compare
```

Example response:

```json
{
  "diesel": {...},
  "lng": {...},
  "methanol": {...},
  "hydrogen": {...},
  "ammonia": {...}
}
```

Do not return a universal "best fuel."

The optimizer decides based on the scenario.

---

# 15. SHORE POWER MODEL

Implement:

```text
shore power available?
vessel compatible?
waiting duration?
electricity cost?
grid carbon intensity?
auxiliary engine emissions?
```

Compare:

```text
shorePowerCost
shorePowerGHG
engineCost
engineGHG
```

Return:

```json
{
  "recommended": true,
  "reason": "...",
  "costDifference": ...,
  "emissionDifference": ...
}
```

The recommendation must be generated from actual inputs.

---

# 16. OPTIMIZATION PROBLEM

Decision variables:

```text
vessel assignment
voyage assignment
speed
fuel type
route
shore power
cargo allocation
```

Objectives:

```text
1. Minimize fuel
2. Minimize cost
3. Minimize lifecycle GHG
4. Minimize delay
5. Minimize risk
```

Constraints:

```text
cargo demand satisfied

vessel capacity sufficient

deadline satisfied

minimum speed <= speed <= maximum speed

fuel compatible with vessel

fuel available

shore power only if available

vessel available

route feasible

emission limit respected

carbon budget respected when enabled
```

---

# 17. OPTIMIZER ARCHITECTURE

Create a common optimizer interface.

Example:

```python
class Optimizer:
    def optimize(problem):
        pass
```

Implement:

```text
GreedyOptimizer
GeneticAlgorithmOptimizer
NSGAIIOptimizer
QPSOOptimizer
AQPSOOptimizer
```

This allows the benchmark system to compare algorithms consistently.

---

# 18. QPSO

Implement a genuine quantum-inspired particle swarm optimizer.

Do not simply rename a standard PSO as QPSO.

Document:

* particle representation
* position representation
* local attractor
* mean best position
* contraction-expansion coefficient
* exploration/exploitation strategy
* constraint handling

The implementation must be understandable and testable.

---

# 19. AQPSO

Implement Adaptive QPSO.

Adapt exploration/exploitation based on:

```text
iteration
convergence
stagnation
constraint violations
Pareto diversity
```

Create unit tests for:

* initialization
* update equations
* convergence
* constraint repair
* stopping condition

---

# 20. CONSTRAINT REPAIR

Implement a dedicated:

```text
ConstraintRepairEngine
```

Possible repairs:

```text
capacity violation
→ split cargo or upgrade vessel

deadline violation
→ increase speed if allowed
→ change vessel
→ change route

fuel incompatibility
→ switch fuel

shore power unavailable
→ disable shore power

carbon budget violation
→ search for lower-emission configuration
```

Do not silently modify the solution.

Record repairs in an explanation object.

Example:

```json
{
  "repairApplied": true,
  "changes": [
    {
      "constraint": "capacity",
      "before": 1400,
      "after": 1000,
      "action": "cargo_split"
    }
  ]
}
```

---

# 21. PARETO FRONTIER

Implement multi-objective optimization.

Do not collapse everything into a single arbitrary score unless the user explicitly selects weights.

Return a set of non-dominated solutions.

Each solution should contain:

```text
fuel
cost
ghg
delay
risk
```

Frontend must visualize the Pareto frontier.

---

# 22. DECISION MODES

Implement:

## Greenest

Minimize lifecycle GHG subject to feasibility.

## Cheapest

Minimize operational cost subject to feasibility.

## Balanced

Use configurable weighted objectives.

## Reliability-first

Prioritize schedule reliability while still respecting environmental/cost objectives.

These are decision modes, not global rankings.

---

# 23. GREEN OPERATING ENVELOPE

Create a backend endpoint that evaluates combinations of:

```text
speed
cargo utilization
fuel
```

Return feasible operating regions.

Frontend should visualize:

```text
Speed vs Cargo
Speed vs Fuel
Speed vs GHG
Speed vs Cost
```

Use charts or heatmaps.

---

# 24. CARBON BUDGET

Support optional:

```text
carbonBudget
```

The optimizer must treat it as a hard constraint when enabled.

Dashboard:

```text
Carbon Budget
Used
Remaining
Projected
Status
```

Statuses:

```text
SAFE
AT RISK
INFEASIBLE
```

Do not call something "safe" without a defined threshold.

---

# 25. SCENARIO ENGINE

Create:

```http
POST /api/scenarios/simulate
```

Scenario parameters:

```text
fuelPriceMultiplier
carbonPrice
cargoDemandMultiplier
weatherSeverity
deadlineChange
electricityPriceMultiplier
gridCarbonIntensityMultiplier
fuelAvailability
```

The scenario engine should:

1. Clone baseline state.
2. Apply scenario changes.
3. Recalculate predictions.
4. Recalculate emissions.
5. Run optimization.
6. Compare baseline vs scenario.
7. Explain changes.

---

# 26. BEFORE/AFTER COMPARISON

Return:

```json
{
  "baseline": {
    "fuel": ...,
    "cost": ...,
    "ghg": ...,
    "delay": ...
  },
  "scenario": {
    "fuel": ...,
    "cost": ...,
    "ghg": ...,
    "delay": ...
  },
  "delta": {
    "fuel": ...,
    "cost": ...,
    "ghg": ...,
    "delay": ...
  }
}
```

Frontend should visualize deltas.

---

# 27. EXPLAINABLE OPTIMIZATION

Every final solution must have a machine-generated explanation based on actual data.

Example structure:

```json
{
  "reasons": [
    {
      "category": "VESSEL_SELECTION",
      "message": "Vessel V-103 was selected because its capacity satisfies the cargo requirement while remaining within the speed and fuel constraints."
    },
    {
      "category": "SPEED",
      "message": "Speed was reduced because the resulting fuel savings outweighed the additional travel time while the deadline remained feasible."
    }
  ]
}
```

Never create explanations that contradict the optimization result.

---

# 28. DYNAMIC RE-OPTIMIZATION

Implement event triggers.

Examples:

```text
weather changed
fuel price changed
fuel unavailable
deadline changed
port unavailable
vessel failure
cargo demand changed
```

Pipeline:

```text
Event
 ↓
Update Digital Twin
 ↓
Predict
 ↓
Evaluate constraints
 ↓
Re-optimize
 ↓
Compare previous plan
 ↓
Explain changes
```

Expose:

```http
POST /api/reoptimization/trigger
```

---

# 29. BENCHMARK ENGINE

Create a benchmark service that runs:

```text
Greedy
GA
NSGA-II
QPSO
AQPSO
```

on exactly the same optimization problem.

Measure:

```text
runtime
iterations
objective values
fuel
cost
GHG
delay
constraint violations
Pareto metrics
```

Run each algorithm multiple times where stochastic algorithms are involved.

Store results.

Do not fabricate values.

---

# 30. BENCHMARK DASHBOARD

Build:

```text
Algorithm comparison table

Convergence chart

Runtime chart

Pareto frontier comparison

Constraint violation comparison

Scalability chart
```

Allow the user to select:

```text
problem size
number of vessels
number of voyages
population size
iterations
```

---

# 31. FRONTEND DESIGN

The UI should look like a serious maritime operations platform.

Avoid:

* excessive gradients
* generic AI landing-page design
* unnecessary animations
* meaningless cards
* fake charts

Use:

* dark/navy maritime-inspired professional theme
* clear typography
* operational dashboards
* maps
* charts
* tables
* status indicators
* technical but understandable visualizations

The application should look like software a fleet operations team could actually use.

---

# 32. FRONTEND ROUTES

Implement:

```text
/
 /dashboard
 /fleet
 /vessels
 /voyages
 /map
 /prediction
 /optimization
 /scenarios
 /benchmark
 /carbon
 /settings
```

---

# 33. DASHBOARD

Show:

```text
Fleet size
Active voyages
Total cargo
Fuel consumption
Lifecycle GHG
Operating cost
Average ETA
Delayed voyages
Carbon budget
Alternative fuel share
```

Include:

* fleet map
* fuel trend
* GHG trend
* cost trend
* active voyages
* recent optimization runs

---

# 34. FLEET MAP

Use Leaflet or Mapbox.

Show:

```text
vessels
routes
ports
weather
```

Clicking a vessel should open:

```text
Vessel details
Current speed
Fuel
ETA
Cargo
Predicted fuel
GHG
```

---

# 35. PREDICTION SCREEN

Allow user to select:

```text
vessel
route
cargo
speed
fuel
weather
```

Display:

```text
Predicted fuel
Fuel per nautical mile
Travel time
Fuel cost
TTW emissions
WTW emissions
Prediction uncertainty if available
```

Include:

```text
Physics baseline vs ML prediction
```

---

# 36. OPTIMIZATION SCREEN

Controls:

```text
Fleet
Cargo demand
Deadline
Carbon budget
Allowed fuels
Shore power
Objective configuration
Algorithm
Population size
Iterations
```

Button:

> RUN OPTIMIZATION

Display:

```text
Optimization status
Runtime
Solutions evaluated
Feasible solutions
Pareto frontier
```

Then:

```text
Greenest
Cheapest
Balanced
Reliability-first
```

---

# 37. SOLUTION DETAILS

When a user clicks a solution, show:

```text
Vessel assignments
Voyage assignments
Speed
Fuel
Route
Shore power
Cargo
Fuel consumption
Cost
GHG
Delay
Risk
```

Also show:

### Why this plan?

Generated explanation.

---

# 38. SCENARIO LAB

Build an interactive scenario screen.

Sliders/inputs:

```text
Fuel price
Carbon price
Cargo demand
Weather
Deadline
Electricity price
Grid intensity
```

Button:

> SIMULATE SCENARIO

Show:

```text
Baseline
Scenario
Difference
Changed decisions
Explanation
```

---

# 39. BENCHMARK SCREEN

Show:

```text
Greedy
GA
NSGA-II
QPSO
AQPSO
```

Charts:

```text
Convergence
Runtime
Objective
GHG
Fuel
Cost
```

---

# 40. CARBON DASHBOARD

Show:

```text
Carbon budget
Used
Remaining
Projected
```

Visualize:

```text
daily emissions
voyage emissions
vessel emissions
fuel emissions
```

Allow filtering.

---

# 41. API SECURITY

If authentication already exists, reuse it.

Otherwise implement basic authentication if required.

Never expose:

* database credentials
* API keys
* model secrets

Use environment variables.

Create:

```text
.env.example
```

with safe placeholders.

---

# 42. ERROR HANDLING

Every API should have proper error handling.

Example:

```json
{
  "error": "INFEASIBLE_OPTIMIZATION",
  "message": "No feasible fleet configuration satisfies the current deadline, capacity and carbon-budget constraints.",
  "details": {
    "failedConstraints": [
      "deadline",
      "carbonBudget"
    ]
  }
}
```

Do not hide infeasibility.

---

# 43. LOGGING

Implement structured logging.

Log:

```text
optimization start
optimization end
algorithm
runtime
population
iterations
constraint violations
model prediction
scenario ID
errors
```

Do not log secrets.

---

# 44. TESTING

Implement:

## Backend tests

* Controller tests
* Service tests
* Repository tests
* Validation tests

## Optimization tests

* objective correctness
* constraint correctness
* QPSO update
* AQPSO adaptation
* constraint repair
* Pareto filtering

## ML tests

* feature pipeline
* prediction output
* model loading
* metric calculation

## Frontend tests

At least test:

* dashboard rendering
* optimization form
* scenario form
* API error state
* solution rendering

---

# 45. END-TO-END TEST

Create an automated test:

```text
Create demo fleet
 ↓
Create voyages
 ↓
Generate weather
 ↓
Run prediction
 ↓
Run optimization
 ↓
Verify feasible solution
 ↓
Generate explanation
 ↓
Change weather
 ↓
Trigger reoptimization
 ↓
Verify changed plan
```

This is mandatory.

---

# 46. PERFORMANCE

The UI must remain responsive while optimization is running.

Do not block HTTP requests for extremely long optimization runs.

If necessary implement:

```text
POST /optimization/run
```

returning:

```json
{
  "runId": "..."
}
```

Then:

```text
GET /optimization/{runId}
```

for status.

Possible statuses:

```text
QUEUED
RUNNING
COMPLETED
FAILED
INFEASIBLE
```

Use polling or WebSocket/SSE if appropriate.

For an SIH prototype, polling is acceptable.

---

# 47. CACHING

Cache where useful:

* weather
* vessel metadata
* model predictions
* repeated optimization configurations

Do not cache in a way that returns stale scenario results incorrectly.

---

# 48. MODEL VERSIONING

Store:

```text
model name
version
training timestamp
dataset version
metrics
features
```

Prediction results should identify the model version.

---

# 49. CONFIGURATION

All important assumptions should be configurable.

Do not hardcode:

```text
fuel prices
emission factors
carbon price
speed limits
carbon budget
```

Create configuration tables/files.

---

# 50. DOCUMENTATION

Create:

```text
README.md
ARCHITECTURE.md
DATA_MODEL.md
ML_MODEL.md
OPTIMIZATION.md
API.md
BENCHMARKING.md
ASSUMPTIONS.md
DEMO.md
```

README must explain:

1. Problem
2. Solution
3. Architecture
4. Tech stack
5. Setup
6. Environment variables
7. Running backend
8. Running AI service
9. Running frontend
10. Running tests
11. Generating demo data
12. Running optimization
13. Running benchmarks

---

# 51. ASSUMPTIONS DOCUMENT

Create an explicit assumptions document.

Every assumption must be listed.

Examples:

```text
Synthetic fuel prices are used for demonstration.
Emission factors are configurable assumptions unless sourced.
Synthetic weather is not real-time weather.
Synthetic vessel data is not real fleet data.
```

This protects the credibility of the project.

---

# 52. DEMO MODE

Implement a dedicated:

# SIH DEMO MODE

The user should be able to click:

> LOAD DEMO SCENARIO

It automatically loads:

```text
12 vessels
5 ports
18 voyages
weather
fuel data
carbon budget
```

Then:

> RUN OPTIMIZATION

The complete workflow should execute.

No manual database setup should be required.

---

# 53. DEMO STORY

The demo should follow:

## STEP 1

Show baseline fleet.

## STEP 2

Run AQPSO.

## STEP 3

Show Pareto solutions.

## STEP 4

Select Balanced plan.

## STEP 5

Increase carbon price.

## STEP 6

Re-run scenario.

## STEP 7

Introduce weather disruption.

## STEP 8

Trigger dynamic re-optimization.

## STEP 9

Show:

```text
old plan
vs
new plan
```

## STEP 10

Show explanation.

This should be possible in under approximately 5 minutes.

---

# 54. OBSERVABILITY

Every optimization result should be traceable.

Store:

```text
input configuration
algorithm
random seed
population
iterations
objective weights
constraints
model version
result
```

For stochastic algorithms, allow deterministic runs using a configurable seed.

---

# 55. RANDOM SEED

Implement:

```text
randomSeed
```

in optimizer configuration.

This allows reproducibility.

---

# 56. SCIENTIFIC REPRODUCIBILITY

Every experiment should be reproducible from:

```text
dataset
model version
optimizer version
configuration
random seed
```

Create a benchmark experiment JSON format.

---

# 57. IMPORTANT UX RULE

Do not overwhelm the user with mathematical terminology.

Expose advanced information progressively.

Normal user sees:

> Fuel: 1,591 t
> GHG: 4,660 tCO₂e
> Cost: ₹X
> Delay: X hours

Advanced user can expand:

> AQPSO parameters
> Objective weights
> Constraint violations
> Pareto metrics
> Model details

---

# 58. IMPORTANT AI RULE

If an AI explanation is used, it must NEVER invent numerical reasoning.

Prefer deterministic template-based explanations from actual optimization data.

An LLM can optionally convert structured reasoning into natural language, but the source of truth must remain structured optimization output.

---

# 59. OPTIONAL AI ASSISTANT

If time permits, add:

# NautiQ Copilot

The user can ask:

> Why did vessel V103 change?

> Why was methanol selected?

> What happens if carbon price increases by 30%?

> Which voyages contribute most to emissions?

The assistant must answer only from structured application data.

It must not invent facts.

---

# 60. API CONTRACT PRINCIPLE

Keep frontend and backend contracts typed.

Generate TypeScript types from OpenAPI if practical.

Do not duplicate incompatible schemas manually.

---

# 61. CODE QUALITY

Use:

* TypeScript strict mode
* Java validation
* Python type hints
* Pydantic models
* meaningful variable names
* modular architecture
* small services/functions
* comments for mathematical equations
* no dead code
* no unnecessary dependencies

Avoid giant files.

---

# 62. GIT PRACTICES

Make logical commits if Git is available.

Suggested commits:

```text
feat: establish project architecture
feat: add fleet domain model
feat: add demo data generator
feat: add physics fuel model
feat: add ML prediction service
feat: add emission engine
feat: implement QPSO
feat: implement AQPSO
feat: add constraint repair
feat: add benchmark engine
feat: add optimization APIs
feat: add dashboard
feat: add scenario engine
feat: add dynamic reoptimization
test: add end-to-end workflow
docs: add project documentation
```

---

# 63. DO NOT DO THESE THINGS

Never:

1. Fabricate benchmark results.
2. Fabricate ML accuracy.
3. Claim real-world fuel savings without evidence.
4. Claim quantum advantage.
5. Call classical QPSO "quantum computing."
6. Hardcode fake API responses in production UI.
7. Build static charts pretending they are live calculations.
8. Hide infeasible optimization problems.
9. Invent data-source provenance.
10. Treat synthetic data as real maritime data.
11. Overcomplicate the architecture unnecessarily.
12. Replace working existing code without reason.

---

# 64. PRIORITY ORDER

If development time becomes limited, prioritize:

### P0 — MUST WORK

```text
Database
Demo data
Physics fuel model
Fuel prediction
Emission model
QPSO
Constraint handling
Optimization API
Dashboard
Optimization results
```

### P1 — HIGH VALUE

```text
Pareto frontier
Scenario engine
Alternative fuels
Shore power
Explainability
Benchmarking
```

### P2 — DIFFERENTIATORS

```text
AQPSO
Carbon budget
Green operating envelope
Dynamic reoptimization
Digital twin map
```

### P3 — OPTIONAL

```text
AI Copilot
Real-time external data
Advanced forecasting
WebSockets
Advanced geospatial weather
```

---

# 65. SUCCESS CRITERIA

The project is considered complete only when:

### Data

* Demo fleet can be loaded.
* Voyages can be created.
* Weather can be generated.

### Prediction

* Fuel prediction works.
* Physics baseline works.
* ML model can be trained/evaluated when training data is available.

### Emissions

* TTW and lifecycle emissions can be calculated.

### Optimization

* QPSO works.
* AQPSO works.
* Constraints are enforced.
* Pareto solutions are generated.

### Alternatives

* Multiple fuels are supported.
* Shore power is supported.

### Scenarios

* What-if scenarios work.
* Dynamic reoptimization works.

### Benchmarking

* Multiple algorithms can be compared.
* Actual measured metrics are displayed.

### UI

* Dashboard works.
* Map works.
* Prediction screen works.
* Optimization screen works.
* Scenario screen works.
* Benchmark screen works.
* Carbon dashboard works.

### Engineering

* Tests pass.
* README works.
* Application starts from documented commands.
* Demo mode works from a clean environment.

---

# 66. FINAL EXPECTED USER JOURNEY

A user should be able to do this:

```text
Open NautiQ
      ↓
Load Demo Fleet
      ↓
View Digital Twin
      ↓
Select Voyage
      ↓
Predict Fuel
      ↓
View Emissions
      ↓
Open Green Optimizer
      ↓
Set Carbon Budget
      ↓
Run AQPSO
      ↓
View Pareto Frontier
      ↓
Compare Greenest/Cheapest/Balanced
      ↓
Inspect Explainability
      ↓
Open Scenario Lab
      ↓
Increase Carbon Price
      ↓
Run Scenario
      ↓
Introduce Weather Disruption
      ↓
Re-optimize
      ↓
Compare Old vs New Plan
      ↓
View Benchmark
```

This complete flow must work.

---

# 67. START NOW

Begin by:

1. Inspecting the repository.
2. Summarizing the existing architecture.
3. Identifying what already exists.
4. Creating a concrete implementation plan.
5. Implementing Phase 0 and Phase 1.
6. Running the application.
7. Running tests.
8. Then continuing phase-by-phase.

Do NOT stop after producing a plan.

Actually implement the project.

After every major phase:

1. Run tests.
2. Fix errors.
3. Verify the application.
4. Update documentation.
5. Continue to the next phase.

If a requirement cannot be implemented because a dataset/API/source is unavailable, implement a clearly labelled local/synthetic fallback and document the limitation.

The final goal is a **fully runnable SIH prototype**, not a collection of mockups.

# END OF MASTER PROMPT