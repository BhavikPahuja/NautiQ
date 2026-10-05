import React from 'react';
import { 
  Anchor, 
  Ship, 
  Compass, 
  Cpu, 
  Sliders, 
  Activity, 
  BarChart3, 
  Leaf, 
  Bot, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { SYNTHETIC_DATA_BANNER } from '../data/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenDemoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenDemoModal
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'fleet', label: 'Fleet & Vessels', icon: Ship },
    { id: 'map', label: 'Digital Twin Map', icon: Compass },
    { id: 'prediction', label: 'Fuel Intelligence', icon: Cpu },
    { id: 'optimization', label: 'Green Optimizer', icon: Sparkles, highlight: true },
    { id: 'scenarios', label: 'Scenario Lab', icon: Sliders },
    { id: 'disruptions', label: 'Dynamic Re-Opt', icon: ShieldAlert },
    { id: 'benchmark', label: 'Benchmarks', icon: BarChart3 },
    { id: 'carbon', label: 'Carbon Budget', icon: Leaf },
    { id: 'copilot', label: 'Copilot', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner required by Section 2 & 9 */}
      <div className="bg-slate-100/90 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-mono font-medium text-slate-700 tracking-tight">
            {SYNTHETIC_DATA_BANNER}
          </span>
          <span className="hidden md:inline text-slate-400 font-mono">| PS-26138 Maritime Digital Twin</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="text-slate-500 hidden sm:inline">Quantum Potential Optimizer:</span>
          <span className="text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">AQPSO v3.2</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">CII Grade: A/B</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm text-white">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  Nauti<span className="text-blue-600">Q</span> <span className="text-emerald-600 font-medium">GreenOps</span>
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Digital Twin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-normal font-sans hidden sm:block">
                Predictive Fuel Intelligence & Green Fleet Optimization
              </p>
            </div>
          </div>

          {/* Quick Demo Story Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenDemoModal}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SIH Demo Story</span>
              <span className="bg-slate-800 text-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded ml-0.5">5-Min</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                } ${item.highlight && !isActive ? 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50 border-emerald-100' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : item.highlight ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

