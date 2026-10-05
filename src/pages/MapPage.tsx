import React, { useState } from 'react';
import { 
  Compass, 
  Ship, 
  MapPin, 
  Waves, 
  Layers, 
  ShieldCheck, 
  Gauge, 
  Fuel, 
  Clock, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { FleetMap } from '../components/FleetMap';
import { Vessel } from '../types';
import { VESSELS_DATA } from '../data/mockData';

export const MapPage: React.FC = () => {
  const [selectedVessel, setSelectedVessel] = useState<Vessel>(VESSELS_DATA[0]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="font-semibold text-slate-700">GLOBAL MARITIME GEOSPATIAL TWIN (GIS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Transoceanic Live Positioning & Sea State
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Real-time track monitoring, significant wave height overlay, and bunkering port infrastructure
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80">
            <span className="text-slate-500">Tracked: </span>
            <span className="text-blue-700 font-bold">{VESSELS_DATA.length} Vessels</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80">
            <span className="text-slate-500">OPS Ready: </span>
            <span className="text-emerald-700 font-bold">6 Global Ports</span>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="w-full">
        <FleetMap onSelectVessel={setSelectedVessel} />
      </div>

      {/* Quick Vessel Selector Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Ship className="w-4 h-4 text-blue-600" />
              <span>Select Vessel for GPS Tracking & Hydrodynamics</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any vessel to inspect its telemetry and voyage state</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {VESSELS_DATA.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVessel(v)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedVessel.id === v.id
                  ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-900 text-xs truncate">{v.name}</span>
                <span className={`w-2 h-2 rounded-full ${v.status === 'At Sea' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </div>
              <div className="text-xs font-mono font-semibold text-blue-700">{v.currentSpeed} kts</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{v.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
