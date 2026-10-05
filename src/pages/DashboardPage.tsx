import React from 'react';
import { 
  Ship, 
  Fuel, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  TrendingDown, 
  Leaf, 
  Compass, 
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FleetMap } from '../components/FleetMap';
import { VESSELS_DATA, VOYAGES_DATA } from '../data/mockData';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
  onOpenDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab, onOpenDemo }) => {
  // Fuel & GHG Emission Monthly Trend
  const trendData = [
    { month: 'Apr', fuel: 5120, ghg: 15400, cost: 3.25 },
    { month: 'May', fuel: 4980, ghg: 14850, cost: 3.12 },
    { month: 'Jun', fuel: 4890, ghg: 14600, cost: 3.05 },
    { month: 'Jul', fuel: 4780, ghg: 14100, cost: 2.96 },
    { month: 'Aug', fuel: 4710, ghg: 13950, cost: 2.89 },
    { month: 'Sep', fuel: 4650, ghg: 13800, cost: 2.85 },
    { month: 'Oct (Opt)', fuel: 3980, ghg: 10420, cost: 2.38 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome & High Level Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">DIGITAL TWIN STATUS: SYNCHRONIZED</span>
            <span className="text-slate-300">•</span>
            <span>LATENCY: 42ms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Fleet Operations & Green Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
            Real-time monitoring and quantum-inspired multi-objective optimization across 12 active vessels and 8 transoceanic shipping corridors.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => onNavigateTab('optimization')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-100" />
            <span>Launch AQPSO Optimizer</span>
          </button>
          <button
            onClick={onOpenDemo}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <span>5-Min Tour</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Fleet Size */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>ACTIVE FLEET</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
            {VESSELS_DATA.length}
          </div>
          <div className="text-xs text-slate-600 flex items-center space-x-1.5 mt-2.5 font-medium">
            <span className="text-emerald-700">10 At Sea</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-700">2 In Port</span>
          </div>
        </div>

        {/* Active Voyages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>CORRIDORS</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
            {VOYAGES_DATA.length}
          </div>
          <div className="text-xs text-slate-500 mt-2.5">
            31,560 nm underway
          </div>
        </div>

        {/* Daily Fuel Burn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>FUEL BURN</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
            4,650 <span className="text-sm font-normal text-slate-400">t</span>
          </div>
          <div className="text-xs text-emerald-700 flex items-center space-x-0.5 mt-2.5 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-14.4% Eco-Speed</span>
          </div>
        </div>

        {/* Lifecycle GHG */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>LIFECYCLE GHG</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
            13,800 <span className="text-sm font-normal text-slate-400">tCO₂e</span>
          </div>
          <div className="text-xs text-emerald-700 flex items-center space-x-1 mt-2.5 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-24.8% WTW target</span>
          </div>
        </div>

        {/* Fleet OPEX */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>FLEET OPEX</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
            $2.85 <span className="text-sm font-normal text-slate-400">M</span>
          </div>
          <div className="text-xs text-slate-500 mt-2.5">
            Bunker & Port Fees
          </div>
        </div>

        {/* Schedule Reliability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>SCHEDULE ETA</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
            97.4%
          </div>
          <div className="text-xs text-emerald-700 flex items-center space-x-1 mt-2.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Avg delay: 0.8h</span>
          </div>
        </div>
      </div>

      {/* Fleet Map Digital Twin View */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              Real-Time Fleet Telematics & Ocean Environment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live ship positions, transoceanic routes, and sea-state weather integration
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('map')}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-semibold transition-colors"
          >
            <span>Expand Full Maritime GIS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <FleetMap />
      </div>

      {/* Historical Trends & Carbon Budget Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Fuel & GHG Trend Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Fuel Consumption & Emissions Trajectory</h3>
              <p className="text-xs text-slate-500 mt-0.5">Historical baseline vs AQPSO projected optimization</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Fuel (tonnes)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>GHG (tCO₂e)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ghgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="fuel" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#fuelGradient)" name="Fuel (t)" />
                <Area type="monotone" dataKey="ghg" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#ghgGradient)" name="GHG (tCO2e)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Budget & Alternative Fuel Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Carbon Budget Tracking</h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                STATUS: SAFE
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              IMO MEPC 80 2026 Fleet Allocation: 20,000 tCO₂e quarterly statutory cap.
            </p>

            {/* Progress Bar */}
            <div className="space-y-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Budget Utilized:</span>
                <span className="text-emerald-700 font-bold font-mono">13,800 / 20,000 tCO₂e (69.0%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: '69%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Remaining: 6,200 tCO₂e</span>
                <span>Runway: ~42 days</span>
              </div>
            </div>

            {/* Alternative Fuel Share */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 mb-5 text-xs">
              <div className="flex justify-between text-slate-700 font-semibold">
                <span>Alternative Fuel Adoption:</span>
                <span className="text-blue-700 font-bold font-mono">32% Fleetwide</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="text-slate-500 text-[11px]">LNG</div>
                  <div className="text-slate-900 font-bold text-sm mt-0.5">18%</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="text-slate-500 text-[11px]">Methanol</div>
                  <div className="text-emerald-700 font-bold text-sm mt-0.5">11%</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="text-slate-500 text-[11px]">Ammonia</div>
                  <div className="text-indigo-700 font-bold text-sm mt-0.5">3%</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('carbon')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <span>Detailed CII & Carbon Ledger</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Active Corridors Table Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Active Transoceanic Corridors</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live route assignments, allocated vessels, and recommended speeds</p>
          </div>
          <button
            onClick={() => onNavigateTab('fleet')}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-semibold transition-colors"
          >
            <span>Manage All Voyages</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Voyage #</th>
                <th className="py-3 px-4">Assigned Vessel</th>
                <th className="py-3 px-4">Corridor Route</th>
                <th className="py-3 px-4">Cargo Demand</th>
                <th className="py-3 px-4">Opt Speed</th>
                <th className="py-3 px-4">Fuel</th>
                <th className="py-3 px-4">OPS Shore</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VOYAGES_DATA.slice(0, 5).map((voyage) => {
                const vessel = VESSELS_DATA.find(v => v.id === voyage.assignedVesselId);
                return (
                  <tr key={voyage.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono">{voyage.voyageNumber}</td>
                    <td className="py-3.5 px-4 text-blue-700 font-medium flex items-center space-x-2">
                      <Ship className="w-4 h-4 text-blue-600" />
                      <span>{vessel?.name || 'Unassigned'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{voyage.routeName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 font-mono">
                      {voyage.cargoDemand.toLocaleString()} {voyage.cargoUnit}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 font-bold font-mono">
                      {voyage.recommendedSpeedKnots} kts
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] border border-emerald-200 font-medium">
                        {voyage.selectedFuel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-semibold ${voyage.useShorePower ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {voyage.useShorePower ? 'CONNECTED' : 'STANDBY'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] border border-blue-200 font-medium">
                        {voyage.status} ({voyage.currentProgressPct}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
