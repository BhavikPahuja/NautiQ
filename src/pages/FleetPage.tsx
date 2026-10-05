import React, { useState } from 'react';
import { 
  Ship, 
  Search, 
  Filter, 
  Plus, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  Clock, 
  Compass, 
  ChevronRight,
  X
} from 'lucide-react';
import { Vessel, VesselType, FuelType, Voyage } from '../types';
import { VESSELS_DATA, VOYAGES_DATA, PORTS_DATA } from '../data/mockData';

export const FleetPage: React.FC = () => {
  const [fleetList, setFleetList] = useState<Vessel[]>(VESSELS_DATA);
  const [voyagesList, setVoyagesList] = useState<Voyage[]>(VOYAGES_DATA);
  const [activeSubTab, setActiveSubTab] = useState<'vessels' | 'voyages'>('vessels');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedVesselModal, setSelectedVesselModal] = useState<Vessel | null>(null);
  const [showAddVesselModal, setShowAddVesselModal] = useState(false);

  // New vessel form state
  const [newVesselName, setNewVesselName] = useState('');
  const [newVesselType, setNewVesselType] = useState<VesselType>('Container');
  const [newCapacity, setNewCapacity] = useState('16000');
  const [newEnginePower, setNewEnginePower] = useState('54000');
  const [newPrimaryFuel, setNewPrimaryFuel] = useState<FuelType>('Methanol');
  const [newShorePower, setNewShorePower] = useState(true);

  // Filter vessels
  const filteredVessels = fleetList.filter(vessel => {
    const matchesSearch = vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vessel.imo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === 'All' || vessel.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateVessel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVesselName) return;

    const newVessel: Vessel = {
      id: `VES-${fleetList.length + 101}`,
      name: newVesselName,
      imo: `IMO99${Math.floor(10000 + Math.random() * 90000)}`,
      type: newVesselType,
      capacityTEUorDWT: parseInt(newCapacity) || 12000,
      capacityUnit: newVesselType === 'Bulk Carrier' || newVesselType === 'Tanker' || newVesselType === 'General Cargo' ? 'DWT' : 'TEU',
      length: 340,
      beam: 48,
      draft: 14.5,
      enginePower: parseInt(newEnginePower) || 48000,
      minSpeed: 9.5,
      maxSpeed: 21.5,
      designSpeed: 17.5,
      fuelCapabilities: ['Diesel', newPrimaryFuel],
      primaryFuel: newPrimaryFuel,
      fuelConsumptionBaseline: 94.0,
      status: 'At Sea',
      currentLat: 15.0 + Math.random() * 10,
      currentLng: 80.0 + Math.random() * 20,
      currentSpeed: 15.4,
      heading: 120,
      destinationPortId: 'port-sgp',
      eta: '2026-10-06 14:00',
      currentCargoLoad: Math.round((parseInt(newCapacity) || 12000) * 0.85),
      shorePowerCompatible: newShorePower,
      auxiliaryPowerKW: 2400,
      ciiRating: 'A'
    };

    setFleetList([newVessel, ...fleetList]);
    setShowAddVesselModal(false);
    setNewVesselName('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center space-x-2.5">
            <Ship className="w-6 h-6 text-blue-600" />
            <span>Fleet & Voyage Digital Twin</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage vessel technical profiles, propulsion specs, fuel certifications, and voyage contracts
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sub tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('vessels')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'vessels' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fleet Vessels ({fleetList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('voyages')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'voyages' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Voyage Corridors ({voyagesList.length})
            </button>
          </div>

          <button
            onClick={() => setShowAddVesselModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Vessel</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'vessels' ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by vessel name or IMO number..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto text-xs scrollbar-none">
              <span className="text-slate-500 text-xs flex items-center space-x-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Type:</span>
              </span>
              {['All', 'Container', 'Bulk Carrier', 'Tanker', 'Ro-Ro', 'General Cargo'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedTypeFilter === type
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Vessels Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVessels.map(vessel => (
              <div
                key={vessel.id}
                onClick={() => setSelectedVesselModal(vessel)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md p-6 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
                        <Ship className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {vessel.name}
                        </h3>
                        <p className="text-xs font-mono text-slate-400">{vessel.imo}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      vessel.ciiRating === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      vessel.ciiRating === 'B' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                      vessel.ciiRating === 'C' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      CII {vessel.ciiRating}
                    </span>
                  </div>

                  {/* Specs & Capabilities */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">CAPACITY</span>
                      <div className="font-semibold text-slate-800 font-mono">
                        {vessel.capacityTEUorDWT.toLocaleString()} {vessel.capacityUnit}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">ENGINE POWER</span>
                      <div className="font-semibold text-blue-700 font-mono">
                        {(vessel.enginePower / 1000).toFixed(0)}k kW
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] text-slate-400 font-medium">DESIGN SPEED</span>
                      <div className="font-semibold text-amber-700 font-mono">
                        {vessel.designSpeed} kts (max {vessel.maxSpeed})
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] text-slate-400 font-medium">PRIMARY FUEL</span>
                      <div className="font-semibold text-emerald-700 truncate font-mono">
                        {vessel.primaryFuel}
                      </div>
                    </div>
                  </div>

                  {/* Multi Fuel Badges */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[11px] text-slate-500 font-medium">Certified Bunkers:</span>
                    <div className="flex flex-wrap gap-1">
                      {vessel.fuelCapabilities.map(fuel => (
                        <span
                          key={fuel}
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {fuel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Telematics Footer */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                    <span className={`w-2 h-2 rounded-full ${vessel.status === 'At Sea' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span>{vessel.status} ({vessel.currentSpeed} kts)</span>
                  </div>
                  <div className="text-blue-600 font-semibold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Voyages Sub Tab */
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Voyage Contract Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Active departure schedules, cargo commitments, and carbon caps</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Voyage Number</th>
                  <th className="py-3 px-4">Origin & Destination</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Cargo Demand</th>
                  <th className="py-3 px-4">Carbon Budget</th>
                  <th className="py-3 px-4">Assigned Vessel</th>
                  <th className="py-3 px-4">Departure & ETA</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {voyagesList.map(voyage => {
                  const vessel = fleetList.find(v => v.id === voyage.assignedVesselId);
                  const origin = PORTS_DATA.find(p => p.id === voyage.originPortId)?.name || 'Origin';
                  const destination = PORTS_DATA.find(p => p.id === voyage.destinationPortId)?.name || 'Destination';

                  return (
                    <tr key={voyage.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono">{voyage.voyageNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{origin}</div>
                        <div className="text-slate-400 text-[11px]">↳ {destination}</div>
                      </td>
                      <td className="py-3.5 px-4 text-blue-700 font-semibold font-mono">{voyage.distanceNm.toLocaleString()} nm</td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 font-mono">
                        {voyage.cargoDemand.toLocaleString()} {voyage.cargoUnit}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-700 font-bold font-mono">
                        {voyage.carbonBudgetTonnes.toLocaleString()} tCO₂e
                      </td>
                      <td className="py-3.5 px-4 text-blue-700 flex items-center space-x-1.5 font-medium">
                        <Ship className="w-3.5 h-3.5 text-blue-600" />
                        <span>{vessel?.name || 'Unassigned'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-mono">{voyage.departureTime.split(' ')[0]}</div>
                        <div className="text-slate-400 text-[11px] font-mono">ETA: {voyage.deadline.split(' ')[0]}</div>
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
      )}

      {/* Vessel Detail Modal */}
      {selectedVesselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Ship className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <span>{selectedVesselModal.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      {selectedVesselModal.type}
                    </span>
                  </h3>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    {selectedVesselModal.imo} • Flag: International Maritime Organization
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVesselModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium">PROPULSION MCR</div>
                <div className="text-sm font-bold text-blue-700 font-mono mt-0.5">{selectedVesselModal.enginePower.toLocaleString()} kW</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium">SPEED ENVELOPE</div>
                <div className="text-sm font-bold text-amber-700 font-mono mt-0.5">
                  {selectedVesselModal.minSpeed} – {selectedVesselModal.maxSpeed} kts
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium">HULL DIMENSIONS</div>
                <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                  {selectedVesselModal.length}m × {selectedVesselModal.beam}m × {selectedVesselModal.draft}m
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium">PAYLOAD CAPACITY</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {selectedVesselModal.capacityTEUorDWT.toLocaleString()} {selectedVesselModal.capacityUnit}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium">SHORE POWER (OPS)</div>
                <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">
                  {selectedVesselModal.shorePowerCompatible ? 'COMPATIBLE (11kV)' : 'NOT EQUIPPED'}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 font-medium">IMO CII GRADE</div>
                <div className="text-sm font-bold text-indigo-700 font-mono mt-0.5">Grade {selectedVesselModal.ciiRating}</div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs mb-5">
              <div className="text-slate-600 font-medium">Fuel Infrastructure Certifications:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedVesselModal.fuelCapabilities.map(f => (
                  <span key={f} className="px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 font-mono font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedVesselModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vessel Modal */}
      {showAddVesselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Register New Fleet Vessel</span>
              </h3>
              <button
                onClick={() => setShowAddVesselModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVessel} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Vessel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NautiQ Pacific Star"
                  value={newVesselName}
                  onChange={e => setNewVesselName(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Vessel Type</label>
                  <select
                    value={newVesselType}
                    onChange={e => setNewVesselType(e.target.value as VesselType)}
                    className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Container">Container</option>
                    <option value="Bulk Carrier">Bulk Carrier</option>
                    <option value="Tanker">Tanker</option>
                    <option value="Ro-Ro">Ro-Ro</option>
                    <option value="General Cargo">General Cargo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Capacity (TEU / DWT)</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={e => setNewCapacity(e.target.value)}
                    className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Engine Power (kW)</label>
                  <input
                    type="number"
                    value={newEnginePower}
                    onChange={e => setNewEnginePower(e.target.value)}
                    className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Primary Fuel</label>
                  <select
                    value={newPrimaryFuel}
                    onChange={e => setNewPrimaryFuel(e.target.value as FuelType)}
                    className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Diesel">Diesel (VLSFO)</option>
                    <option value="LNG">LNG</option>
                    <option value="Methanol">Bio-Methanol</option>
                    <option value="Ammonia">Green Ammonia</option>
                    <option value="Hydrogen">Liquid Hydrogen</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="shorePowerCheck"
                  checked={newShorePower}
                  onChange={e => setNewShorePower(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <label htmlFor="shorePowerCheck" className="text-slate-600 cursor-pointer">
                  Equipped with 11kV Shore-Power / Cold-Ironing Transformer
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVesselModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
