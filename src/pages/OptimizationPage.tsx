import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Ship, 
  Fuel, 
  Clock, 
  DollarSign, 
  Leaf, 
  Sliders, 
  FileText, 
  Layers, 
  ShieldCheck, 
  RotateCw
} from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis, Cell } from 'recharts';
import { runFleetOptimization } from '../services/optimizer';
import { OptimizationAlgorithm, FuelType, ParetoSolution, DecisionMode } from '../types';

export const OptimizationPage: React.FC = () => {
  // Optimization form configuration
  const [algorithm, setAlgorithm] = useState<OptimizationAlgorithm>('AQPSO');
  const [populationSize, setPopulationSize] = useState<number>(40);
  const [iterations, setIterations] = useState<number>(60);
  const [carbonBudget, setCarbonBudget] = useState<number>(15000);
  const [allowedFuels, setAllowedFuels] = useState<FuelType[]>(['Diesel', 'LNG', 'Methanol', 'Ammonia']);
  const [allowShorePower, setAllowShorePower] = useState<boolean>(true);
  const [randomSeed, setRandomSeed] = useState<number>(42);

  // Objective weights
  const [ghgWeight, setGhgWeight] = useState<number>(0.45);
  const [costWeight, setCostWeight] = useState<number>(0.35);
  const [delayWeight, setDelayWeight] = useState<number>(0.20);

  // Execution state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [runProgress, setRunProgress] = useState(100);
  const [currentResult, setCurrentResult] = useState(() => runFleetOptimization({
    algorithm: 'AQPSO',
    populationSize: 40,
    iterations: 60,
    carbonBudgetTonnes: 15000,
    allowedFuels: ['Diesel', 'LNG', 'Methanol', 'Ammonia'],
    allowShorePower: true
  }));

  // Selected solution for inspection
  const [selectedSolution, setSelectedSolution] = useState<ParetoSolution>(currentResult.balancedPlan);

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setRunProgress(0);

    const interval = setInterval(() => {
      setRunProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          const result = runFleetOptimization({
            algorithm,
            populationSize,
            iterations,
            carbonBudgetTonnes: carbonBudget,
            allowedFuels,
            allowShorePower,
            priorityWeights: { ghgWeight, costWeight, delayWeight },
            randomSeed
          });
          setCurrentResult(result);
          setSelectedSolution(result.balancedPlan);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  const toggleFuel = (fuel: FuelType) => {
    if (allowedFuels.includes(fuel)) {
      if (allowedFuels.length > 1) {
        setAllowedFuels(allowedFuels.filter(f => f !== fuel));
      }
    } else {
      setAllowedFuels([...allowedFuels, fuel]);
    }
  };

  // Format data for Pareto Scatter Plot
  const paretoScatterData = currentResult.paretoFrontier.map(sol => ({
    x: Number((sol.totalCostUSD / 1_000_000).toFixed(2)),
    y: Math.round(sol.totalLifecycleGHGTonnes),
    z: sol.totalFuelTonnes,
    name: sol.name,
    tag: sol.decisionTag,
    rawSolution: sol
  }));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="font-semibold text-slate-700">QUANTUM-INSPIRED MULTI-OBJECTIVE SOLVER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Green Fleet Deployment & Speed Optimizer
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Quantum delta potential well exploration (AQPSO) with non-dominated sorting and automated constraint repair
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isOptimizing}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isOptimizing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-white" />
              <span>Optimizing Swarm ({runProgress}%)...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-white" />
              <span>RUN {algorithm} OPTIMIZATION</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar when running */}
      {isOptimizing && (
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs text-xs space-y-2.5">
          <div className="flex justify-between font-semibold text-slate-800">
            <span className="text-blue-700 font-mono">Quantum Swarm Iterating: Delta Potential Wave Function</span>
            <span>{runProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-150"
              style={{ width: `${runProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Evaluating {populationSize * iterations} swarm particles</span>
            <span>Enforcing Carbon Budget & ETA Deadlines</span>
          </div>
        </div>
      )}

      {/* Optimizer Configuration Controls Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 font-sans">Multi-Objective Solver Parameters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          {/* Algorithm Selector */}
          <div>
            <label className="block text-slate-700 mb-1.5 font-medium">Algorithm Engine</label>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value as OptimizationAlgorithm)}
              className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="AQPSO">AQPSO — Adaptive Quantum PSO (Recommended)</option>
              <option value="QPSO">QPSO — Standard Quantum-Inspired Swarm</option>
              <option value="NSGA-II">NSGA-II — Genetic Non-dominated Sorting</option>
              <option value="GA">GA — Single/Weighted Genetic Algorithm</option>
              <option value="Greedy">Greedy — Sequential Heuristic Baseline</option>
            </select>
          </div>

          {/* Population Size */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Swarm Population:</span>
              <span className="text-blue-700 font-bold font-mono">{populationSize} particles</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={populationSize}
              onChange={e => setPopulationSize(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Iterations */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Epoch Iterations:</span>
              <span className="text-indigo-700 font-bold font-mono">{iterations} steps</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="10"
              value={iterations}
              onChange={e => setIterations(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Carbon Budget Hard Constraint */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Carbon Budget Cap:</span>
              <span className="text-emerald-700 font-bold font-mono">{carbonBudget.toLocaleString()} tCO₂e</span>
            </div>
            <input
              type="number"
              value={carbonBudget}
              onChange={e => setCarbonBudget(parseInt(e.target.value) || 10000)}
              className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Allowed Fuels & Shore Power Checkboxes */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Allowed Fuels:</span>
            {(['Diesel', 'LNG', 'Methanol', 'Ammonia', 'Hydrogen'] as FuelType[]).map(fuel => (
              <button
                key={fuel}
                type="button"
                onClick={() => toggleFuel(fuel)}
                className={`px-3 py-1 rounded-lg text-xs border transition-colors font-medium ${
                  allowedFuels.includes(fuel)
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="shorePowerOpt"
              checked={allowShorePower}
              onChange={e => setAllowShorePower(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-0"
            />
            <label htmlFor="shorePowerOpt" className="text-slate-700 cursor-pointer font-medium">
              Enforce Shore-Power (OPS) Cold-Ironing where Available
            </label>
          </div>
        </div>
      </div>

      {/* 4 Decision Mode Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { mode: 'greenest' as DecisionMode, plan: currentResult.greenestPlan, icon: Leaf, color: 'text-emerald-600', activeRing: 'ring-2 ring-emerald-500 border-emerald-500' },
          { mode: 'cheapest' as DecisionMode, plan: currentResult.cheapestPlan, icon: DollarSign, color: 'text-amber-600', activeRing: 'ring-2 ring-amber-500 border-amber-500' },
          { mode: 'balanced' as DecisionMode, plan: currentResult.balancedPlan, icon: Sparkles, color: 'text-blue-600', activeRing: 'ring-2 ring-blue-600 border-blue-600' },
          { mode: 'reliability' as DecisionMode, plan: currentResult.reliabilityPlan, icon: ShieldCheck, color: 'text-purple-600', activeRing: 'ring-2 ring-purple-500 border-purple-500' },
        ].map(({ mode, plan, icon: Icon, color, activeRing }) => {
          const isSelected = selectedSolution.id === plan.id;
          return (
            <div
              key={mode}
              onClick={() => setSelectedSolution(plan)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs flex flex-col justify-between ${
                isSelected ? `${activeRing} shadow-md` : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {mode} Plan
                    </span>
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="space-y-1 mb-3">
                  <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
                    ${(plan.totalCostUSD / 1_000_000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold font-mono">
                    {plan.totalLifecycleGHGTonnes.toLocaleString()} tCO₂e
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Fuel: {plan.totalFuelTonnes.toLocaleString()} tonnes
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {plan.explanation.headline}
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono mt-4">
                <span className={plan.carbonBudgetSatisfied ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}>
                  Budget: {plan.usedCarbonPct}%
                </span>
                <span className="text-slate-500">
                  Delay: {plan.maxDelayHours}h
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pareto Frontier Scatter Chart & Explainable AI Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pareto Frontier Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Multi-Objective Pareto Frontier</span>
              </h3>
              <p className="text-xs text-slate-500">
                Trade-off: Operating Cost ($M) vs Lifecycle GHG (tCO₂e)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="Cost" unit="M$" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Cost ($ Millions)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }} />
                <YAxis type="number" dataKey="y" name="GHG" unit=" t" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Lifecycle GHG (tCO₂e)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <ZAxis type="number" dataKey="z" range={[80, 200]} name="Fuel (t)" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs shadow-xl">
                          <div className="font-bold text-slate-900 mb-1">{data.name}</div>
                          <div className="text-amber-700 font-mono">Cost: ${data.x}M</div>
                          <div className="text-emerald-700 font-mono">GHG: {data.y.toLocaleString()} tCO₂e</div>
                          <div className="text-blue-700 font-mono">Fuel: {data.z} tonnes</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Pareto Solutions" data={paretoScatterData}>
                  {paretoScatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.tag === 'greenest' ? '#059669' :
                        entry.tag === 'cheapest' ? '#d97706' :
                        entry.tag === 'balanced' ? '#2563eb' :
                        entry.tag === 'reliability' ? '#7c3aed' : '#0284c7'
                      }
                      cursor="pointer"
                      onClick={() => setSelectedSolution(entry.rawSolution)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-5 text-xs text-slate-500 mt-3">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Greenest</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span>Cheapest</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Balanced Knee</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Reliability</span>
            </span>
          </div>
        </div>

        {/* Explainable Decision AI Panel (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Why This Plan? (Explainability Engine)</h3>
              </div>
              <span className="text-xs font-mono text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {selectedSolution.name}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <span className="font-semibold text-blue-700 block mb-1">EXECUTIVE SUMMARY:</span>
                <p className="text-slate-800 leading-relaxed font-sans">
                  {selectedSolution.explanation.headline}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold">• Vessel Assignment: </span>
                  <span className="text-slate-800">{selectedSolution.explanation.vesselSelectionReason}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">• Speed Policy: </span>
                  <span className="text-amber-800">{selectedSolution.explanation.speedPolicyReason}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">• Bunker Selection: </span>
                  <span className="text-emerald-800">{selectedSolution.explanation.fuelStrategyReason}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">• Cold-Ironing (OPS): </span>
                  <span className="text-blue-800">{selectedSolution.explanation.shorePowerReason}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Trade-off: {selectedSolution.explanation.tradeoffSummary}</span>
            <span className="text-emerald-700 font-semibold">Repairs: {selectedSolution.constraintRepairsCount} Auto-Resolved</span>
          </div>
        </div>
      </div>

      {/* Selected Solution Assignment Details Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Operational Assignment Matrix ({selectedSolution.name})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual vessel dispatches, optimal speeds, bunkering choices, and shore-power connections
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Voyage</th>
                <th className="py-3 px-4">Assigned Vessel</th>
                <th className="py-3 px-4">Route Track</th>
                <th className="py-3 px-4">Opt Speed</th>
                <th className="py-3 px-4">Fuel Type</th>
                <th className="py-3 px-4">OPS Shore</th>
                <th className="py-3 px-4">Fuel Tonnes</th>
                <th className="py-3 px-4">Cost ($)</th>
                <th className="py-3 px-4">Lifecycle GHG</th>
                <th className="py-3 px-4">Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedSolution.assignments.map(ass => (
                <tr key={ass.voyageId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono">{ass.voyageNumber}</td>
                  <td className="py-3.5 px-4 text-blue-700">
                    <div className="font-semibold">{ass.vesselName}</div>
                    <div className="text-[11px] text-slate-500">{ass.vesselType} ({ass.cargoCapacityRatioPct}% payload)</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800">{ass.origin}</span>
                    <span className="text-slate-400"> → </span>
                    <span className="text-slate-800">{ass.destination}</span>
                  </td>
                  <td className="py-3.5 px-4 text-amber-700 font-bold font-mono">{ass.speedKnots.toFixed(1)} kts</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] border border-emerald-200 font-medium">
                      {ass.fuelType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold ${ass.useShorePower ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {ass.useShorePower ? 'CONNECTED' : 'STANDBY'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-mono">{ass.fuelTonnes.toLocaleString()} t</td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold font-mono">${(ass.costUSD / 1000).toFixed(0)}k</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold font-mono">{ass.ghgTonnes.toLocaleString()} t</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{ass.delayHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
