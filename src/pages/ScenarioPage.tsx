import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  DollarSign, 
  Leaf, 
  Fuel, 
  ArrowRight, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { simulateScenario, DEFAULT_SCENARIO_PARAMS } from '../services/scenarioEngine';
import { ScenarioSimulationParams } from '../types';

export const ScenarioPage: React.FC = () => {
  const [params, setParams] = useState<ScenarioSimulationParams>(DEFAULT_SCENARIO_PARAMS);
  const [comparison, setComparison] = useState(() => simulateScenario(DEFAULT_SCENARIO_PARAMS));

  const handleSimulate = () => {
    const res = simulateScenario(params);
    setComparison(res);
  };

  const handleReset = () => {
    setParams(DEFAULT_SCENARIO_PARAMS);
    setComparison(simulateScenario(DEFAULT_SCENARIO_PARAMS));
  };

  const chartData = [
    {
      metric: 'Fuel Burn (t)',
      Baseline: comparison.baseline.fuelTonnes,
      Scenario: comparison.scenario.fuelTonnes
    },
    {
      metric: 'Cost ($k)',
      Baseline: Math.round(comparison.baseline.costUSD / 1000),
      Scenario: Math.round(comparison.scenario.costUSD / 1000)
    },
    {
      metric: 'GHG (tCO₂e)',
      Baseline: comparison.baseline.ghgTonnes,
      Scenario: comparison.scenario.ghgTonnes
    },
    {
      metric: 'Alt Fuel (%)',
      Baseline: comparison.baseline.altFuelSharePct,
      Scenario: comparison.scenario.altFuelSharePct
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="font-semibold text-slate-700">WHAT-IF MARITIME SIMULATION LAB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Regulatory & Market Sensitivity Simulator
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Test policy shocks: carbon tax $/tonne, bunker price volatility, weather severity, and cargo surges
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
          <button
            onClick={handleSimulate}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Play className="w-4 h-4 text-white" />
            <span>SIMULATE SCENARIO</span>
          </button>
        </div>
      </div>

      {/* Interactive Sliders Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 font-sans">Policy, Price & Environmental Levers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          {/* Carbon Tax */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Carbon Price / Tax:</span>
              <span className="text-emerald-700 font-bold font-mono">${params.carbonTaxPerTonneUSD} / tCO₂e</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={params.carbonTaxPerTonneUSD}
              onChange={e => setParams({ ...params, carbonTaxPerTonneUSD: parseInt(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">EU ETS / FuelEU Maritime compliance levy</span>
          </div>

          {/* Fuel Price Multiplier */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Fuel Price Index:</span>
              <span className="text-amber-700 font-bold font-mono">{params.fuelPriceMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="2.0"
              step="0.05"
              value={params.fuelPriceMultiplier}
              onChange={e => setParams({ ...params, fuelPriceMultiplier: parseFloat(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Global oil benchmark sensitivity</span>
          </div>

          {/* Weather Severity Multiplier */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Weather Severity:</span>
              <span className="text-blue-700 font-bold font-mono">{params.weatherSeverityMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.8"
              step="0.05"
              value={params.weatherSeverityMultiplier}
              onChange={e => setParams({ ...params, weatherSeverityMultiplier: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Wave height & storm frequency</span>
          </div>

          {/* Cargo Demand Multiplier */}
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Cargo Demand:</span>
              <span className="text-indigo-700 font-bold font-mono">{params.cargoDemandMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={params.cargoDemandMultiplier}
              onChange={e => setParams({ ...params, cargoDemandMultiplier: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Transoceanic cargo volume surge</span>
          </div>
        </div>
      </div>

      {/* Baseline vs Scenario Delta Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cost Delta */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>OPERATING COST (OPEX)</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            ${(comparison.scenario.costUSD / 1_000_000).toFixed(2)}M
          </div>
          <div className="flex items-center space-x-1.5 text-xs mt-2 font-mono">
            <span className="text-slate-500">Base: ${(comparison.baseline.costUSD / 1_000_000).toFixed(2)}M</span>
            <span className={`font-bold ${comparison.delta.costUSD >= 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              ({comparison.delta.costUSD >= 0 ? '+' : ''}{comparison.delta.costPct}%)
            </span>
          </div>
        </div>

        {/* GHG Delta */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>LIFECYCLE GHG</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            {comparison.scenario.ghgTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs mt-2 font-mono">
            <span className="text-slate-500">Base: {comparison.baseline.ghgTonnes.toLocaleString()} t</span>
            <span className={`font-bold ${comparison.delta.ghgTonnes <= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              ({comparison.delta.ghgTonnes >= 0 ? '+' : ''}{comparison.delta.ghgPct}%)
            </span>
          </div>
        </div>

        {/* Fuel Delta */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>FUEL CONSUMPTION</span>
            <Fuel className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            {comparison.scenario.fuelTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400">tonnes</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs mt-2 font-mono">
            <span className="text-slate-500">Base: {comparison.baseline.fuelTonnes.toLocaleString()} t</span>
            <span className={`font-bold ${comparison.delta.fuelTonnes >= 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              ({comparison.delta.fuelTonnes >= 0 ? '+' : ''}{comparison.delta.fuelPct}%)
            </span>
          </div>
        </div>

        {/* Alternative Fuel Share */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>ALT FUEL ADOPTION</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 font-sans tracking-tight">
            {comparison.scenario.altFuelSharePct}%
          </div>
          <div className="flex items-center space-x-1.5 text-xs mt-2 font-mono">
            <span className="text-slate-500">Base: {comparison.baseline.altFuelSharePct}%</span>
            <span className="text-emerald-700 font-bold">
              (+{comparison.scenario.altFuelSharePct - comparison.baseline.altFuelSharePct} pts)
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Chart & Changed Decisions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Side-by-side Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Baseline vs Scenario Metrics</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="Baseline" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Scenario" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Changed Decisions Log (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Automated Fleet Re-dispatch Shifts ({comparison.changedDecisions.length})
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {comparison.changedDecisions.map((dec, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 font-bold font-mono">{dec.category}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{dec.voyage}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 font-mono text-xs">
                    <span className="text-slate-400 line-through">{dec.before}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-bold">{dec.after}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">{dec.impact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-slate-800 font-bold">Executive Rationale: </span>
            <span className="text-slate-600">{comparison.executiveSummary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
