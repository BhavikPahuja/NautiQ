import React, { useState } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  AlertTriangle, 
  FileText
} from 'lucide-react';
import { PRESET_DISRUPTIONS, executeDynamicReoptimization, ReoptimizationPlanDiff } from '../services/reoptimizationEngine';

export const DisruptionPage: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>(PRESET_DISRUPTIONS[0].id);
  const [isReoptimizing, setIsReoptimizing] = useState(false);
  const [planDiff, setPlanDiff] = useState<ReoptimizationPlanDiff>(() => 
    executeDynamicReoptimization(PRESET_DISRUPTIONS[0])
  );

  const currentEvent = PRESET_DISRUPTIONS.find(e => e.id === selectedEventId) || PRESET_DISRUPTIONS[0];

  const handleTriggerReoptimization = () => {
    setIsReoptimizing(true);
    setTimeout(() => {
      const diff = executeDynamicReoptimization(currentEvent);
      setPlanDiff(diff);
      setIsReoptimizing(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-700">EVENT-DRIVEN MARITIME ADAPTATION ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dynamic Re-Optimization & Incident Response
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Real-time constraint re-evaluation upon severe weather alerts, terminal congestion, or propulsion faults
          </p>
        </div>

        <button
          onClick={handleTriggerReoptimization}
          disabled={isReoptimizing}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isReoptimizing ? 'animate-spin' : ''}`} />
          <span>{isReoptimizing ? 'Executing Re-Optimization...' : 'TRIGGER RE-OPTIMIZATION'}</span>
        </button>
      </div>

      {/* Preset Disruption Scenario Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRESET_DISRUPTIONS.map(evt => {
          const isSelected = selectedEventId === evt.id;
          return (
            <div
              key={evt.id}
              onClick={() => {
                setSelectedEventId(evt.id);
                setPlanDiff(executeDynamicReoptimization(evt));
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-amber-500 shadow-md ring-1 ring-amber-500'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    evt.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    evt.severity === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {evt.severity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{evt.timestamp}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-sans">{evt.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs font-mono text-blue-700 flex items-center justify-between mt-3.5">
                <span>Voyage: {evt.affectedVoyageId}</span>
                <span className="text-slate-500">{evt.affectedVesselId}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disruption Digital Twin Diagnostics Box */}
      <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-amber-800 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>ACTIVE INCIDENT TELEMETRY: {planDiff.event.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {planDiff.digitalTwinImpacts.map((impact, i) => (
            <div key={i} className="bg-white p-3.5 rounded-xl border border-amber-200/70 flex items-start space-x-2.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
              <span className="text-slate-700 leading-relaxed font-sans">{impact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side Old Plan vs New Plan Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Old Plan */}
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <h3 className="text-sm font-bold text-slate-900 font-sans">DISRUPTED PLAN (BEFORE)</h3>
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Constraint Violated
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Vessel:</span>
              <span className="text-slate-900 font-bold">{planDiff.oldPlan.assignedVessel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cruising Speed:</span>
              <span className="text-amber-700 font-bold font-mono">{planDiff.oldPlan.speedKnots} kts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Bunker:</span>
              <span className="text-slate-800">{planDiff.oldPlan.fuelType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Voyage Routing:</span>
              <span className="text-slate-700 truncate max-w-xs">{planDiff.oldPlan.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated ETA:</span>
              <span className="text-rose-700 font-bold font-mono">{planDiff.oldPlan.eta}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Projected Delay:</span>
              <span className="text-rose-700 font-bold font-mono">+{planDiff.oldPlan.delayHours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Voyage Expenditure:</span>
              <span className="text-slate-900 font-semibold font-mono">${planDiff.oldPlan.voyageCostUSD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lifecycle GHG:</span>
              <span className="text-emerald-700 font-semibold font-mono">{planDiff.oldPlan.voyageGHGTonnes.toLocaleString()} tCO₂e</span>
            </div>
          </div>
        </div>

        {/* New Re-Optimized Plan */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-bold text-slate-900 font-sans">RE-OPTIMIZED PLAN (AFTER)</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              FEASIBLE & SECURED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Vessel:</span>
              <span className="text-slate-900 font-bold">{planDiff.newPlan.assignedVessel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cruising Speed:</span>
              <span className="text-amber-700 font-bold font-mono">{planDiff.newPlan.speedKnots} kts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Bunker:</span>
              <span className="text-emerald-700 font-bold">{planDiff.newPlan.fuelType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Voyage Routing:</span>
              <span className="text-blue-700 font-semibold truncate max-w-xs">{planDiff.newPlan.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated ETA:</span>
              <span className="text-emerald-700 font-bold font-mono">{planDiff.newPlan.eta}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Projected Delay:</span>
              <span className="text-emerald-700 font-bold font-mono">{planDiff.newPlan.delayHours} Hours (Mitigated)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Voyage Expenditure:</span>
              <span className="text-slate-900 font-semibold font-mono">${planDiff.newPlan.voyageCostUSD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lifecycle GHG:</span>
              <span className="text-emerald-700 font-semibold font-mono">{planDiff.newPlan.voyageGHGTonnes.toLocaleString()} tCO₂e</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corrective Actions Taken */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            Explainable Corrective Measures Executed by Optimizer
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          {planDiff.correctiveActions.map(action => (
            <div key={action.step} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start space-x-3.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                {action.step}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-xs">{action.action}</div>
                <p className="text-slate-600 text-xs font-sans mt-0.5 leading-relaxed">{action.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
