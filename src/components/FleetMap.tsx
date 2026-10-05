import React, { useState } from 'react';
import { 
  Ship, 
  MapPin, 
  Wind, 
  Waves, 
  Zap, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Gauge, 
  Clock, 
  Fuel, 
  Layers,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Vessel, Port, WeatherCondition } from '../types';
import { VESSELS_DATA, PORTS_DATA, WEATHER_STATIONS, VOYAGES_DATA } from '../data/mockData';

interface FleetMapProps {
  onSelectVessel?: (vessel: Vessel) => void;
}

export const FleetMap: React.FC<FleetMapProps> = ({ onSelectVessel }) => {
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(VESSELS_DATA[0]);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(true);
  const [showPorts, setShowPorts] = useState(true);

  // Convert GPS (Lat, Lng) to SVG coordinates (Equirectangular projection across 1280 wide canvas)
  const projectCoords = (lat: number, lng: number): { x: number; y: number } => {
    const x = ((lng + 180) / 360) * 1280;
    const clampedLat = Math.max(-60, Math.min(75, lat));
    const y = ((75 - clampedLat) / 135) * 540;
    return { x, y };
  };

  const handleVesselClick = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setIsDrawerCollapsed(false);
    setSelectedPort(null);
    setSelectedWeather(null);
    if (onSelectVessel) onSelectVessel(vessel);
  };

  const handlePortClick = (port: Port) => {
    setSelectedPort(port);
    setSelectedVessel(null);
    setSelectedWeather(null);
  };

  const handleWeatherClick = (wx: WeatherCondition) => {
    setSelectedWeather(wx);
    setSelectedVessel(null);
    setSelectedPort(null);
  };

  return (
    <div className="relative w-full h-[640px] rounded-2xl bg-[#f0f7ff] border border-slate-200 overflow-hidden shadow-xs select-none">
      {/* Map Control Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/90 shadow-sm text-xs">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 text-slate-800 font-semibold border-r border-slate-200">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>MARITIME GIS</span>
        </div>

        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`px-3 py-1 rounded-lg transition-colors font-medium ${
            showRoutes ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Corridors ({VOYAGES_DATA.length})
        </button>

        <button
          onClick={() => setShowPorts(!showPorts)}
          className={`px-3 py-1 rounded-lg transition-colors font-medium ${
            showPorts ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bunkering Ports ({PORTS_DATA.length})
        </button>

        <button
          onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
          className={`px-3 py-1 rounded-lg transition-colors font-medium ${
            showWeatherOverlay ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sea State Overlay
        </button>
      </div>

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 1280 540"
        className="w-full h-full object-cover"
        style={{ cursor: 'crosshair', backgroundColor: '#f0f7ff' }}
      >
        <defs>
          <filter id="lightGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Global Latitude / Longitude Graticule Lines */}
        <g stroke="#dbeafe" strokeWidth="0.8" strokeDasharray="4 4">
          <line x1="0" y1="135" x2="1280" y2="135" /> {/* 45° N */}
          <line x1="0" y1="270" x2="1280" y2="270" /> {/* Equator 0° */}
          <line x1="0" y1="405" x2="1280" y2="405" /> {/* 45° S */}

          <line x1="320" y1="0" x2="320" y2="540" /> {/* 90° W */}
          <line x1="640" y1="0" x2="640" y2="540" /> {/* Prime Meridian 0° */}
          <line x1="960" y1="0" x2="960" y2="540" /> {/* 90° E */}
        </g>

        {/* Continental Geometries Scaled to 1280 Width */}
        {/* Eurasia & Africa */}
        <path
          d="M620,95 Q660,85 750,80 Q880,65 980,85 Q1080,115 1130,190 Q1090,240 1000,250 Q960,300 930,320 Q870,270 810,250 Q800,190 720,190 Q670,210 620,270 Q630,350 670,415 Q610,405 570,320 Q540,250 570,175 Q555,135 620,95 Z"
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {/* Americas */}
        <path
          d="M220,85 Q310,80 360,115 Q340,170 300,200 Q290,250 340,290 Q390,355 365,445 Q315,465 290,395 Q275,325 235,275 Q170,220 160,160 Q170,105 220,85 Z"
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {/* Australia */}
        <path
          d="M1000,365 Q1090,355 1130,395 Q1105,445 1030,445 Q980,415 1000,365 Z"
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Active Maritime Shipping Routes */}
        {showRoutes && (
          <g>
            {VOYAGES_DATA.map((voyage) => {
              const points = voyage.routeCoordinates.map((c) => {
                const { x, y } = projectCoords(c[0], c[1]);
                return `${x},${y}`;
              });
              const isSelectedVoyage = selectedVessel?.destinationPortId === voyage.destinationPortId;

              return (
                <polyline
                  key={voyage.id}
                  points={points.join(' ')}
                  fill="none"
                  stroke={isSelectedVoyage ? '#2563eb' : '#0284c7'}
                  strokeWidth={isSelectedVoyage ? '2.5' : '1.5'}
                  strokeDasharray={isSelectedVoyage ? 'none' : '4 4'}
                  opacity={isSelectedVoyage ? 0.95 : 0.45}
                />
              );
            })}
          </g>
        )}

        {/* Weather Stations & Ocean Swell Overlays */}
        {showWeatherOverlay && (
          <g>
            {WEATHER_STATIONS.map((wx) => {
              const { x, y } = projectCoords(wx.latitude, wx.longitude);
              const isSevere = wx.waveHeightMeters > 3.5;

              return (
                <g
                  key={wx.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  onClick={() => handleWeatherClick(wx)}
                >
                  <circle
                    r={wx.waveHeightMeters * 4.5}
                    fill={isSevere ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.10)'}
                    stroke={isSevere ? '#ef4444' : '#f59e0b'}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle r="4" fill={isSevere ? '#ef4444' : '#f59e0b'} />
                  <text
                    x="8"
                    y="4"
                    fill={isSevere ? '#b91c1c' : '#b45309'}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {wx.waveHeightMeters}m waves
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Global Bunkering Ports */}
        {showPorts && (
          <g>
            {PORTS_DATA.map((port) => {
              const { x, y } = projectCoords(port.latitude, port.longitude);
              const isSelected = selectedPort?.id === port.id;

              return (
                <g
                  key={port.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={() => handlePortClick(port)}
                >
                  <circle
                    r={isSelected ? '7' : '4.5'}
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  {port.shorePowerAvailable && (
                    <circle
                      r="9"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                  <text
                    x="9"
                    y="3"
                    fill="#0f172a"
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="sans-serif"
                    className="opacity-90 group-hover:opacity-100"
                  >
                    {port.name.replace('Port of ', '')}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Fleet Vessels */}
        <g>
          {VESSELS_DATA.map((vessel) => {
            const { x, y } = projectCoords(vessel.currentLat, vessel.currentLng);
            const isSelected = selectedVessel?.id === vessel.id;
            const isAtSea = vessel.status === 'At Sea';

            return (
              <g
                key={vessel.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer"
                onClick={() => handleVesselClick(vessel)}
              >
                {/* Radar pulse for selected vessel */}
                {isSelected && (
                  <circle
                    r="16"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                )}

                {/* Vessel Marker Icon */}
                <circle
                  r={isSelected ? '8' : '6'}
                  fill={isSelected ? '#2563eb' : isAtSea ? '#0284c7' : '#d97706'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Vessel Name Tag */}
                <text
                  x="10"
                  y="-2"
                  fill="#0f172a"
                  fontSize={isSelected ? '10' : '8.5'}
                  fontFamily="sans-serif"
                  fontWeight={isSelected ? 'bold' : '500'}
                >
                  {vessel.name} ({vessel.currentSpeed} kts)
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Selected Vessel Telematics Slide-Over Drawer */}
      {selectedVessel && (
        <div className={`absolute top-4 right-4 z-30 transition-all ${
          isDrawerCollapsed ? 'w-72' : 'w-84 sm:w-96'
        } bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-xl text-slate-800`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Ship className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <span>{selectedVessel.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedVessel.type}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {selectedVessel.imo} • {selectedVessel.currentSpeed} kts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
                className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100"
                title={isDrawerCollapsed ? "Expand telematics" : "Minimize drawer"}
              >
                {isDrawerCollapsed ? (
                  <span className="text-[10px] font-mono text-blue-600 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                    Expand
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                    Hide
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedVessel(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isDrawerCollapsed && (
            <>
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-mono">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-blue-600" />
                    <span>SPEED & HEADING</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedVessel.currentSpeed} kts @ {selectedVessel.heading}°
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <Fuel className="w-3 h-3 text-emerald-600" />
                    <span>PRIMARY FUEL</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {selectedVessel.primaryFuel}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>DESTINATION / ETA</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                    {selectedVessel.eta}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    <span>CII RATING</span>
                  </div>
                  <div className="text-sm font-bold text-indigo-700 mt-0.5 flex items-center space-x-1">
                    <span>Grade {selectedVessel.ciiRating}</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      (OPS: {selectedVessel.shorePowerCompatible ? 'Yes' : 'No'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="text-[11px] space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hull Dimensions:</span>
                  <span className="font-mono text-slate-800">
                    {selectedVessel.length}m L × {selectedVessel.beam}m B × {selectedVessel.draft}m D
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Engine MCR Power:</span>
                  <span className="font-mono text-blue-700 font-semibold">{selectedVessel.enginePower.toLocaleString()} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fuel Capabilities:</span>
                  <span className="font-mono text-emerald-700 font-semibold">{selectedVessel.fuelCapabilities.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cargo Onboard:</span>
                  <span className="font-mono text-slate-800">
                    {selectedVessel.currentCargoLoad.toLocaleString()} / {selectedVessel.capacityTEUorDWT.toLocaleString()} ({Math.round((selectedVessel.currentCargoLoad / selectedVessel.capacityTEUorDWT) * 100)}%)
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Selected Port Modal Drawer */}
      {selectedPort && (
        <div className="absolute top-4 right-4 z-30 w-84 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-xl text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{selectedPort.name}</h4>
              <p className="text-xs font-mono text-emerald-700">{selectedPort.code} • {selectedPort.country}</p>
            </div>
            <button onClick={() => setSelectedPort(null)} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Cold-Ironing (OPS):</span>
              <span className={selectedPort.shorePowerAvailable ? 'text-emerald-700 font-bold' : 'text-rose-600'}>
                {selectedPort.shorePowerAvailable ? 'AVAILABLE (11kV)' : 'NOT AVAILABLE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Electricity Tariff:</span>
              <span className="text-slate-800 font-semibold">${selectedPort.electricityPriceKWh.toFixed(2)} / kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Grid Carbon Intensity:</span>
              <span className="text-blue-700 font-semibold">{selectedPort.gridCarbonIntensity} gCO₂/kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Avg Berth Wait:</span>
              <span className="text-amber-700 font-semibold">{selectedPort.avgPortWaitHours} hours</span>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-slate-500 text-[10px] mb-1">Bunkering Available:</div>
              <div className="flex flex-wrap gap-1">
                {selectedPort.fuelAvailability.map(f => (
                  <span key={f} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] border border-emerald-200">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Weather Overlay Drawer */}
      {selectedWeather && (
        <div className="absolute top-4 right-4 z-30 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-xl text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Waves className="w-4 h-4 text-amber-600" />
                <span>{selectedWeather.locationName}</span>
              </h4>
              <p className="text-xs font-mono text-amber-700">Sea State: {selectedWeather.seaStateText}</p>
            </div>
            <button onClick={() => setSelectedWeather(null)} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Significant Wave Height:</span>
              <span className="text-amber-700 font-bold">{selectedWeather.waveHeightMeters} meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Wind Velocity:</span>
              <span className="text-slate-800 font-semibold">{selectedWeather.windSpeedKnots} kts @ {selectedWeather.windDirectionDeg}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hydrodynamic Markup:</span>
              <span className="text-rose-600 font-bold">+{((selectedWeather.resistanceMultiplier - 1) * 100).toFixed(1)}% Drag</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Surface Temp:</span>
              <span className="text-blue-700 font-semibold">{selectedWeather.temperatureC}°C</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend Footer */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center space-x-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs text-slate-600">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>Vessel at Sea</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>In Port / Berth</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Shore-Power Port</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
          <span>Wave / Weather Buoy</span>
        </div>
      </div>
    </div>
  );
};
