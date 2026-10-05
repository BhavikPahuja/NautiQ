import React from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Fuel
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { VESSELS_DATA } from '../data/mockData';
import { getFuelComparisonMatrix } from '../services/emissionEngine';

export const CarbonPage: React.FC = () => {
  const fuelMatrix = getFuelComparisonMatrix();

  // Carbon by fuel type
  const carbonByFuelData = [
    { name: 'VLSFO / Diesel', value: 8900, color: '#0284c7' },
    { name: 'LNG', value: 3450, color: '#38bdf8' },
    { name: 'Bio-Methanol', value: 1250, color: '#10b981' },
    { name: 'Green Ammonia', value: 200, color: '#8b5cf6' }
  ];

  // IMO CII grade distribution
  const ciiCounts = {
    A: VESSELS_DATA.filter(v => v.ciiRating === 'A').length,
    B: VESSELS_DATA.filter(v => v.ciiRating === 'B').length,
    C: VESSELS_DATA.filter(v => v.ciiRating === 'C').length,
    D: VESSELS_DATA.filter(v => v.ciiRating === 'D').length,
    E: VESSELS_DATA.filter(v => v.ciiRating === 'E').length
  };

  const ciiDistribution = [
    { grade: 'Grade A (Major Overachiever)', count: ciiCounts.A, color: '#059669' },
    { grade: 'Grade B (Minor Overachiever)', count: ciiCounts.B, color: '#0d9488' },
    { grade: 'Grade C (Target Benchmark)', count: ciiCounts.C, color: '#0284c7' },
    { grade: 'Grade D (Corrective Action Needed)', count: ciiCounts.D, color: '#d97706' },
    { grade: 'Grade E (Critical Non-Compliant)', count: ciiCounts.E, color: '#e11d48' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">IMO MEPC 80 & FUELEU MARITIME COMPLIANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Carbon Budget & Environmental Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Well-to-Wake (WTW) lifecycle emissions, Carbon Intensity Indicator (CII) ratings, and alternative fuel transition
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
          <span className="text-slate-600">Fleet Status:</span>
          <span className="text-emerald-700 font-bold">BUDGET SAFE</span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-700 font-semibold">69% Used</span>
        </div>
      </div>

      {/* Carbon Budget Primary Tracking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 mb-2 flex items-center justify-between font-medium">
            <span>QUARTERLY BUDGET CAP</span>
            <Leaf className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            20,000 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Statutory fleet allocation
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="text-slate-500 mb-2 flex items-center justify-between font-medium">
            <span>CONSUMED EMISSIONS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-sans tracking-tight">
            13,800 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            69.0% of quota utilized
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 mb-2 flex items-center justify-between font-medium">
            <span>REMAINING BUFFER</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 font-sans tracking-tight">
            6,200 <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Runway: ~42 operational days
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 mb-2 flex items-center justify-between font-medium">
            <span>FUELEU MARITIME TARGET</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            87.5 <span className="text-xs font-normal text-slate-400">gCO₂e/MJ</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Fleet average: 81.2 (Compliant)
          </div>
        </div>
      </div>

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carbon by Fuel Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Fleet Emissions by Fuel Type (tCO₂e)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carbonByFuelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {carbonByFuelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-3">
            {carbonByFuelData.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="text-slate-900 font-semibold font-mono">{item.value.toLocaleString()} t</span>
              </div>
            ))}
          </div>
        </div>

        {/* IMO CII Rating Fleet Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">IMO Carbon Intensity Indicator (CII) Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mandatory MARPOL Annex VI operational efficiency rating</p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">12 Fleet Vessels</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ciiDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="grade" type="category" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {ciiDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-500 text-center mt-2">
            Note: Vessels rated Grade D for 3 consecutive years or Grade E for 1 year require an approved corrective action plan.
          </div>
        </div>
      </div>

      {/* Alternative Marine Fuel Comparison Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-emerald-600" />
              <span>Alternative Marine Fuel Lifecycle Matrix (Normalized to 100t Diesel Energy Equivalent)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative analysis based on IMO 4th GHG Study & FuelEU Maritime Lifecycle Reference Values
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Fuel Type</th>
                <th className="py-3 px-4">Price / Tonne</th>
                <th className="py-3 px-4">Energy (MJ/kg)</th>
                <th className="py-3 px-4">Tank Penalty</th>
                <th className="py-3 px-4">Required Tons</th>
                <th className="py-3 px-4">Energy Cost</th>
                <th className="py-3 px-4">TTW CO₂ (t)</th>
                <th className="py-3 px-4">WTW Lifecycle (t)</th>
                <th className="py-3 px-4">GHG Intensity</th>
                <th className="py-3 px-4">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fuelMatrix.map(f => (
                <tr key={f.fuelType} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{f.fuelType}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs font-normal">{f.name}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold font-mono">${f.pricePerTonne}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono">{f.energyDensity}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">-{f.storagePenaltyPct}%</td>
                  <td className="py-3.5 px-4 text-blue-700 font-bold font-mono">{f.requiredTonnageForSameEnergy} t</td>
                  <td className="py-3.5 px-4 text-slate-900 font-mono">${(f.costUSD / 1000).toFixed(0)}k</td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono">{f.ttwEmissionsTonnes} t</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold font-mono">{f.wtwEmissionsTonnes} t</td>
                  <td className="py-3.5 px-4 text-purple-700 font-mono">{f.ghgIntensityGPerMJ} g/MJ</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      f.availability === 'High' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      f.availability === 'Medium' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {f.availability} ({f.bunkerPortsCount} Ports)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
