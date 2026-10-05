import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Gauge, 
  Wind, 
  Waves, 
  Fuel, 
  DollarSign, 
  Leaf, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  BarChart2,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { VESSELS_DATA, FUELS_DATA } from '../data/mockData';
import { predictVesselFuelHybrid, ML_MODEL_METRICS } from '../services/mlPredictor';
import { FuelType } from '../types';

export const PredictionPage: React.FC = () => {
  const [selectedVesselId, setSelectedVesselId] = useState<string>(VESSELS_DATA[0].id);
  const [speedKnots, setSpeedKnots] = useState<number>(16.5);
  const [distanceNm, setDistanceNm] = useState<number>(5800);
  const [cargoLoadPct, setCargoLoadPct] = useState<number>(85);
  const [selectedFuel, setSelectedFuel] = useState<FuelType>('Methanol');
  const [waveHeightMeters, setWaveHeightMeters] = useState<number>(2.2);
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(18);
  const [waterTempC, setWaterTempC] = useState<number>(22);

  const selectedVessel = useMemo(() => {
    return VESSELS_DATA.find(v => v.id === selectedVesselId) || VESSELS_DATA[0];
  }, [selectedVesselId]);

  // Adjust speed if outside vessel bounds
  const clampedSpeed = Math.min(selectedVessel.maxSpeed, Math.max(selectedVessel.minSpeed, speedKnots));

  // Compute prediction
  const prediction = useMemo(() => {
    return predictVesselFuelHybrid({
      vessel: selectedVessel,
      speedKnots: clampedSpeed,
      distanceNm,
      cargoLoadRatio: cargoLoadPct / 100,
      fuelType: selectedFuel,
      waveHeightMeters,
      windSpeedKnots,
      currentSpeedKnots: 1.0,
      temperatureC: waterTempC
    });
  }, [selectedVessel, clampedSpeed, distanceNm, cargoLoadPct, selectedFuel, waveHeightMeters, windSpeedKnots, waterTempC]);

  // Speed sensitivity curve (v³ hydrodynamic power law demonstration)
  const sensitivityCurve = useMemo(() => {
    const points = [];
    const minS = Math.floor(selectedVessel.minSpeed);
    const maxS = Math.ceil(selectedVessel.maxSpeed);

    for (let s = minS; s <= maxS; s += 0.5) {
      const p = predictVesselFuelHybrid({
        vessel: selectedVessel,
        speedKnots: s,
        distanceNm,
        cargoLoadRatio: cargoLoadPct / 100,
        fuelType: selectedFuel,
        waveHeightMeters,
        windSpeedKnots,
        currentSpeedKnots: 1.0,
        temperatureC: waterTempC
      });
      points.push({
        speed: s,
        fuelTonnes: p.mlPredictedFuelTonnes,
        physicsBaseline: p.physicsTotalFuelTonnes,
        costUSD: Math.round(p.fuelCostUSD / 1000)
      });
    }
    return points;
  }, [selectedVessel, distanceNm, cargoLoadPct, selectedFuel, waveHeightMeters, windSpeedKnots, waterTempC]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">HYBRID DIGITAL TWIN PROPULSION MODEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Predictive Fuel & Emissions Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Physics-informed Admiralty Propulsion (P ∝ v³) combined with XGBoost residual correction (R² = {ML_MODEL_METRICS.metrics.r2Score})
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-500">Model:</span>
          <span className="text-blue-700 font-bold">{ML_MODEL_METRICS.modelName}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">MAE {ML_MODEL_METRICS.metrics.maeTonnes}t</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Controls Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-sans">Voyage & Hydrodynamic Controls</h3>
          </div>

          {/* Vessel Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Target Vessel</label>
            <select
              value={selectedVesselId}
              onChange={e => setSelectedVesselId(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none"
            >
              {VESSELS_DATA.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type}, {v.capacityTEUorDWT.toLocaleString()} {v.capacityUnit})
                </option>
              ))}
            </select>
          </div>

          {/* Distance Input */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-medium">
              <span>Voyage Distance:</span>
              <span className="text-blue-700 font-bold font-mono">{distanceNm.toLocaleString()} nm</span>
            </div>
            <input
              type="range"
              min="200"
              max="12000"
              step="100"
              value={distanceNm}
              onChange={e => setDistanceNm(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Speed Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-medium">
              <span>Operating Speed:</span>
              <span className="text-amber-700 font-bold font-mono">
                {clampedSpeed.toFixed(1)} kts ({selectedVessel.minSpeed} - {selectedVessel.maxSpeed} kts limits)
              </span>
            </div>
            <input
              type="range"
              min={selectedVessel.minSpeed}
              max={selectedVessel.maxSpeed}
              step="0.1"
              value={clampedSpeed}
              onChange={e => setSpeedKnots(parseFloat(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Cargo Load Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-medium">
              <span>Cargo Utilization:</span>
              <span className="text-slate-800 font-bold font-mono">
                {cargoLoadPct}% ({Math.round(selectedVessel.capacityTEUorDWT * (cargoLoadPct / 100)).toLocaleString()} {selectedVessel.capacityUnit})
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={cargoLoadPct}
              onChange={e => setCargoLoadPct(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Bunker Fuel Selection</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['Diesel', 'LNG', 'Methanol', 'Ammonia', 'Hydrogen'] as FuelType[]).map(fuel => {
                const isCertified = selectedVessel.fuelCapabilities.includes(fuel);
                return (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setSelectedFuel(fuel)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedFuel === fuel
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold shadow-xs'
                        : isCertified
                          ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          : 'bg-slate-50 border-slate-200/60 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{fuel}</span>
                      {selectedFuel === fuel && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">${FUELS_DATA[fuel].pricePerTonne}/t</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ocean Weather Conditions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3 text-xs">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              Met-Ocean Weather Simulation
            </span>

            <div>
              <div className="flex justify-between text-slate-700 mb-1 font-medium">
                <span>Significant Wave Height:</span>
                <span className="text-amber-700 font-bold font-mono">{waveHeightMeters}m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={waveHeightMeters}
                onChange={e => setWaveHeightMeters(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1 font-medium">
                <span>Wind Velocity:</span>
                <span className="text-slate-800 font-mono">{windSpeedKnots} knots</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="1"
                value={windSpeedKnots}
                onChange={e => setWindSpeedKnots(parseInt(e.target.value))}
                className="w-full accent-slate-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Prediction Results & Outputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 text-xs font-medium flex items-center space-x-1.5">
                <Fuel className="w-4 h-4 text-blue-600" />
                <span>PREDICTED FUEL</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-sans mt-1.5">
                {prediction.mlPredictedFuelTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400">t</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {prediction.fuelPerNauticalMileKg} kg / nm
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 text-xs font-medium flex items-center space-x-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>LIFECYCLE GHG</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700 font-sans mt-1.5">
                {prediction.totalLifecycleGHGTonnes.toLocaleString()} <span className="text-xs font-normal text-slate-400">t</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                WTW Well-to-Wake
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 text-xs font-medium flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                <span>BUNKER OPEX</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-sans mt-1.5">
                ${(prediction.fuelCostUSD / 1000).toFixed(0)} <span className="text-xs font-normal text-slate-400">k</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                @ ${FUELS_DATA[selectedFuel].pricePerTonne}/t
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 text-xs font-medium flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>TRANSIT TIME</span>
              </div>
              <div className="text-2xl font-bold text-purple-700 font-sans mt-1.5">
                {prediction.travelTimeHours} <span className="text-xs font-normal text-slate-400">h</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {(prediction.travelTimeHours / 24).toFixed(1)} Days
              </div>
            </div>
          </div>

          {/* Physics Baseline vs ML Uncertainty Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Physics Baseline vs Hybrid ML Residual</span>
              </span>
              <span className="text-blue-700 font-mono font-medium">
                Envelope: [{prediction.uncertaintyIntervalTonnes[0]}t – {prediction.uncertaintyIntervalTonnes[1]}t]
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 text-[11px]">Admiralty Baseline:</span>
                <div className="text-slate-900 font-bold font-mono mt-0.5">{prediction.physicsTotalFuelTonnes} tonnes</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 text-[11px]">ML Residual Correction:</span>
                <div className="text-blue-700 font-bold font-mono mt-0.5">+{prediction.mlResidualCorrectionTonnes} tonnes</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="text-slate-500 text-[11px]">Power Demand:</span>
                <div className="text-amber-700 font-bold font-mono mt-0.5">{prediction.physicsEnginePowerKW.toLocaleString()} kW</div>
              </div>
            </div>
          </div>

          {/* Speed vs Fuel Sensitivity Curve Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Speed vs Fuel Sensitivity Curve (P ∝ v³ Law)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exponential surge in fuel tonnage as vessel approaches hull speed limit
                </p>
              </div>
              <div className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Current: {clampedSpeed} kts
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensitivityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="speed" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Speed (knots)', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Fuel (t)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="fuelTonnes" stroke="#0284c7" strokeWidth={2.5} dot={false} name="ML Fuel (t)" />
                  <Line type="monotone" dataKey="physicsBaseline" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Physics Baseline (t)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Importance Attributions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-xs space-y-3">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <BarChart2 className="w-4 h-4 text-purple-600" />
              <span>SHAP-Style Feature Attribution Impact</span>
            </div>
            <div className="space-y-2.5">
              {prediction.featureContributions.map(item => (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800">{item.feature}</span>
                    <span className="text-blue-700 font-mono">{item.importancePct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${item.importancePct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{item.impactDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
