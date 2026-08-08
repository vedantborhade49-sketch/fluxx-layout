import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Wind, 
  Flame, 
  AlertTriangle, 
  Activity, 
  Play, 
  Users, 
  ShieldAlert, 
  Sliders, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { CityTopology, WhatIfSimulationResult } from '../../types';

interface CityTwinStudioProps {
  onDispatchDrone?: (lat: number, lng: number, name: string) => void;
}

export const CityTwinStudio: React.FC<CityTwinStudioProps> = ({ onDispatchDrone }) => {
  const [topology, setTopology] = useState<CityTopology | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('SRC-CHEMBUR-REFINERY');
  const [emissionDelta, setEmissionDelta] = useState<number>(25);
  const [windSpeed, setWindSpeed] = useState<number>(5.5);
  const [windDir, setWindDir] = useState<number>(210);
  const [inversionHeight, setInversionHeight] = useState<number>(350);
  
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    loadTopology();
  }, []);

  const loadTopology = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCityTopology();
      setTopology(data);
      // Run initial simulation
      runSimulation(selectedSourceId, emissionDelta, windSpeed, windDir, inversionHeight);
    } catch (err) {
      console.error('Failed to load city topology:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const runSimulation = async (
    srcId: string = selectedSourceId,
    delta: number = emissionDelta,
    speed: number = windSpeed,
    dir: number = windDir,
    inv: number = inversionHeight
  ) => {
    try {
      setIsSimulating(true);
      const result = await api.simulateCityWhatIf({
        source_id: srcId,
        emission_delta_percent: delta,
        wind_speed_ms: speed,
        wind_direction_deg: dir,
        temperature_c: 30.5,
        inversion_layer_height_m: inv
      });
      setSimulationResult(result);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                <Building2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                  CITY & ENVIRONMENTAL DIGITAL TWIN
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    GAUSSIAN DISPERSION ACTIVE
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Macro Airshed Topology • Stationary Point-Source Physics • Multi-Ward Population Exposure Predictor
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Simulated Airshed</span>
              <span className="text-sm font-semibold text-indigo-300">Mumbai Urban Metropolitan Basin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Simulation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: What-If Scenario Control Board */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              "What-If" Scenario Controls
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Interactive
            </span>
          </div>

          {/* Emission Source Selection */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Target Stationary Point Source</span>
              <span className="text-[10px] text-amber-400">Continuous Monitor</span>
            </label>
            <select
              value={selectedSourceId}
              onChange={(e) => {
                setSelectedSourceId(e.target.value);
                runSimulation(e.target.value, emissionDelta, windSpeed, windDir, inversionHeight);
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {topology?.emission_sources.map((src) => (
                <option key={src.id} value={src.id}>
                  {src.name} ({src.category})
                </option>
              ))}
            </select>
          </div>

          {/* Emission Delta Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Emission Rate Delta (Δ)</span>
              <span className={`font-mono font-bold ${emissionDelta >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {emissionDelta >= 0 ? `+${emissionDelta}%` : `${emissionDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={emissionDelta}
              onChange={(e) => setEmissionDelta(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-50% (Curtailed)</span>
              <span>0% (Baseline)</span>
              <span>+100% (Surge)</span>
            </div>
          </div>

          {/* Wind Speed & Direction */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Wind Velocity</span>
                <span className="font-mono text-indigo-300 font-bold">{windSpeed} m/s</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="18.0"
                step="0.5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Wind Heading</span>
                <span className="font-mono text-cyan-300 font-bold">{windDir}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="355"
                step="5"
                value={windDir}
                onChange={(e) => setWindDir(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Inversion Layer Height */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Thermal Inversion Cap</span>
              <span className="font-mono text-amber-300 font-bold">{inversionHeight} m AGL</span>
            </div>
            <input
              type="range"
              min="100"
              max="800"
              step="25"
              value={inversionHeight}
              onChange={(e) => setInversionHeight(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Execute Simulation Button */}
          <button
            onClick={() => runSimulation()}
            disabled={isSimulating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isSimulating ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            {isSimulating ? 'Computing Dispersion Plume...' : 'Simulate Atmospheric Impact'}
          </button>
        </div>

        {/* Center & Right Columns: Real-Time Simulation Impact Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Macro Exposure Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-medium mb-1">
                <Users className="w-4 h-4" />
                Affected Citizens
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {simulationResult?.macro_exposure_impact?.total_affected_population?.toLocaleString() || '14,200'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">In direct plume path</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
                <ShieldAlert className="w-4 h-4" />
                Vulnerable Groups
              </div>
              <div className="text-2xl font-black font-mono text-amber-300">
                {simulationResult?.macro_exposure_impact?.vulnerable_demographics_count?.toLocaleString() || '3,420'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Seniors & school children</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-1">
                <TrendingUp className="w-4 h-4" />
                Peak AQI Surge
              </div>
              <div className="text-2xl font-black font-mono text-indigo-300">
                +{simulationResult?.macro_exposure_impact?.peak_plume_ground_aqi_surge || 24}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Ground concentration Δ</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium mb-1">
                <Compass className="w-4 h-4" />
                Plume Bearing
              </div>
              <div className="text-2xl font-black font-mono text-cyan-300">
                {simulationResult?.atmospheric_conditions?.plume_travel_bearing_deg || 245}°
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Vector south-west drift</div>
            </div>
          </div>

          {/* Multi-Ward Impact Exposure Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Ward-by-Ward Exposure Analysis
              </h3>
              <span className="text-[10px] text-slate-400">
                Sorted by Predicted Ground Impact
              </span>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-800/80 pb-2">
                    <th className="py-2">Ward Administrative Region</th>
                    <th className="py-2">Distance</th>
                    <th className="py-2">Baseline</th>
                    <th className="py-2">Projected AQI</th>
                    <th className="py-2">Impact Status</th>
                    <th className="py-2 text-right">Affected Population</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {simulationResult?.ward_impacts.map((ward) => (
                    <tr key={ward.ward_id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-medium text-slate-200">
                        {ward.ward_name}
                      </td>
                      <td className="py-3 font-mono text-slate-400">
                        {ward.distance_from_source_km} km
                      </td>
                      <td className="py-3 font-mono text-slate-400">
                        {ward.baseline_aqi} AQI
                      </td>
                      <td className="py-3 font-mono font-bold">
                        <span className={ward.projected_aqi > 200 ? 'text-rose-400' : ward.projected_aqi > 150 ? 'text-amber-400' : 'text-emerald-400'}>
                          {ward.projected_aqi} AQI
                        </span>
                        <span className="text-[10px] text-rose-400 ml-1">
                          (+{ward.predicted_aqi_increase})
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ward.exposure_severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          ward.exposure_severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {ward.exposure_severity}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-slate-300">
                        {ward.affected_population > 0 ? ward.affected_population.toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tactical Mitigations & Plume Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plume GIS Rings */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Dispersion Horizon & Arrival ETAs
              </h4>
              <div className="space-y-2">
                {simulationResult?.plume_contours?.map((contour, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div>
                      <span className="font-mono text-cyan-300 font-bold">Ring {idx + 1} ({contour.distance_km || (idx + 1) * 2} km)</span>
                      <div className="text-[10px] text-slate-400">
                        Coords: {contour.center_lat || 19.01}°N, {contour.center_lng || 72.89}°E
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        ETA: {contour.estimated_arrival_minutes || (idx + 1) * 12} min
                      </span>
                      <div className="text-[10px] text-amber-400 mt-0.5 font-mono">
                        VOC ~{contour.mean_concentration_voc_ppb || 120} ppb
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tactical Recommendations */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Automated Tactical Mitigations
                </h4>
                <div className="space-y-2">
                  {simulationResult?.tactical_mitigations.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-indigo-400 font-bold">0{idx + 1}.</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {onDispatchDrone && simulationResult?.plume_contours && simulationResult.plume_contours.length > 1 && (
                <button
                  onClick={() => onDispatchDrone(
                    simulationResult.plume_contours![1].center_lat || 19.02,
                    simulationResult.plume_contours![1].center_lng || 72.88,
                    'Plume Intercept Survey'
                  )}
                  className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-indigo-500/40 shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  Dispatch Intercept VTOL to Ring 2
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
