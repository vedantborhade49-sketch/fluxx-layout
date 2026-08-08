import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Battery, 
  Activity, 
  Thermometer, 
  Compass, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  Sparkles, 
  RefreshCw,
  Sliders,
  Wind,
  Gauge
} from 'lucide-react';
import { DigitalTwinState, PreFlightSimulationResult } from '../../types';
import { api } from '../../services/api';

interface DigitalTwinStudioProps {
  droneId: string;
}

export const DigitalTwinStudio: React.FC<DigitalTwinStudioProps> = ({ droneId }) => {
  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Pre-flight simulation inputs
  const [distanceKm, setDistanceKm] = useState<number>(14.5);
  const [altitudeM, setAltitudeM] = useState<number>(120);
  const [windSpeedMs, setWindSpeedMs] = useState<number>(4.8);
  const [payloadKg, setPayloadKg] = useState<number>(1.2);
  const [simResult, setSimResult] = useState<PreFlightSimulationResult | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  // Fetch twin state
  const loadTwin = async () => {
    try {
      setLoading(true);
      const data = await api.getDigitalTwin(droneId);
      setTwin(data);
    } catch (e) {
      console.error('Failed to load digital twin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTwin();
    const interval = setInterval(loadTwin, 4000);
    return () => clearInterval(interval);
  }, [droneId]);

  // Run Pre-Flight Simulation
  const handleRunSimulation = async () => {
    try {
      setSimulating(true);
      const res = await api.simulatePreFlightMission({
        drone_id: droneId,
        distance_km: distanceKm,
        planned_altitude: altitudeM,
        wind_speed: windSpeedMs,
        payload_weight_kg: payloadKg
      });
      setSimResult(res);
    } catch (e) {
      console.error('Error running pre-flight mission simulation:', e);
    } finally {
      setSimulating(false);
    }
  };

  // Run initial simulation on load
  useEffect(() => {
    handleRunSimulation();
  }, [droneId]);

  if (!twin) return null;

  return (
    <div className="space-y-6">
      
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-[#0D101A] via-[#121628] to-[#0D101A] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00F0FF] via-[#00FF9D] to-[#B600A8] p-[1.5px] shadow-lg shadow-[#00F0FF]/20">
              <div className="w-full h-full bg-[#0D101A] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-[#00F0FF] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-wide text-white uppercase">{twin.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono-telemetry font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                  DIGITAL TWIN SYNCHRONIZED
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono-telemetry mt-0.5">
                Physical-to-Virtual Telemetry Bridge • Real-Time Aerodynamic & Motor Wear Modeling
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadTwin}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync State</span>
            </button>
            <div className="bg-[#141824] px-3 py-1.5 rounded-lg border border-white/5 text-right font-mono-telemetry">
              <span className="text-[10px] text-gray-400">FAILURE RISK:</span>
              <span className="text-xs font-bold text-[#00FF9D] ml-1.5">
                {(twin.failure_risk_score * 100).toFixed(1)}% (Nominal)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Twin Hardware Diagnostics + Pre-Flight Mission Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Twin Hardware Real-Time Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-[#FF5500]" />
              <span>Propulsion & Motor Thermals</span>
            </h3>

            {/* 4 Motors Visual Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Motor 1 (Front-L)', temp: twin.motor1_temp },
                { label: 'Motor 2 (Front-R)', temp: twin.motor2_temp },
                { label: 'Motor 3 (Rear-L)', temp: twin.motor3_temp },
                { label: 'Motor 4 (Rear-R)', temp: twin.motor4_temp }
              ].map((m, idx) => (
                <div key={idx} className="bg-[#121624] p-3 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-400 font-medium">{m.label}</div>
                  <div className="text-xl font-bold font-mono-telemetry text-white my-1">
                    {m.temp}°C
                  </div>
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00FF9D] via-[#FFB800] to-[#FF3366] rounded-full" 
                      style={{ width: `${Math.min(100, (m.temp / 80) * 100)}%` }} 
                    />
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono-telemetry">Limit: 75°C</span>
                </div>
              ))}
            </div>

            {/* ESC & Vibration Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                <div className="text-xs text-gray-400">ESC Driver Temp</div>
                <div className="text-xl font-bold font-mono-telemetry text-[#FFB800] my-1">
                  {twin.esc_temp}°C
                </div>
                <span className="text-[9px] text-[#00FF9D] font-mono-telemetry">Within thermal curve</span>
              </div>

              <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                <div className="text-xs text-gray-400">Vibration Level</div>
                <div className="text-xl font-bold font-mono-telemetry text-[#00F0FF] my-1">
                  {twin.vibration_level} G
                </div>
                <span className="text-[9px] text-[#00FF9D] font-mono-telemetry">FFT: Harmonic balanced</span>
              </div>
            </div>

            {/* Battery SOH & Cycles */}
            <div className="bg-[#121624] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center space-x-1.5">
                  <Battery className="w-4 h-4 text-[#00FF9D]" />
                  <span>Battery Health (SOH)</span>
                </span>
                <span className="font-mono-telemetry font-bold text-[#00FF9D]">{twin.battery_soh}%</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00FF9D] rounded-full" 
                  style={{ width: `${twin.battery_soh}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-mono-telemetry">
                <span>Cycles: {twin.battery_cycles} / 300</span>
                <span>Cell Temp: {twin.battery_temp}°C</span>
                <span>Degradation: 1.8%</span>
              </div>
            </div>

            {/* Subsystems Calibration Summary */}
            <div className="bg-[#121624] p-3 rounded-xl border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Compass Integrity:</span>
                <span className="font-mono-telemetry text-[#00FF9D]">{twin.compass_health}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Servo Actuator Wear:</span>
                <span className="font-mono-telemetry text-gray-200">{twin.servo_wear}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Flight Hours:</span>
                <span className="font-mono-telemetry text-white font-bold">{twin.flight_hours_total} hrs</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right: Pre-Flight AI Mission Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                  <span>Pre-Flight AI Mission Energy & Feasibility Simulator</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Virtual wind tunnel & battery depletion simulation before drone dispatch
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-telemetry font-bold bg-[#B600A8]/20 text-[#B600A8] border border-[#B600A8]/30">
                AI CO-PILOT ENGINE
              </span>
            </div>

            {/* Simulation Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Distance Slider */}
              <div className="bg-[#121624] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Survey Distance</span>
                  <span className="font-mono-telemetry font-bold text-white">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  step="0.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                />
              </div>

              {/* Altitude Slider */}
              <div className="bg-[#121624] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Planned Altitude</span>
                  <span className="font-mono-telemetry font-bold text-white">{altitudeM} m AGL</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={altitudeM}
                  onChange={(e) => setAltitudeM(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#00FF9D]"
                />
              </div>

              {/* Wind Speed Slider */}
              <div className="bg-[#121624] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Atmospheric Wind</span>
                  <span className="font-mono-telemetry font-bold text-white">{windSpeedMs} m/s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="18"
                  step="0.5"
                  value={windSpeedMs}
                  onChange={(e) => setWindSpeedMs(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
                />
              </div>

              {/* Payload Mass */}
              <div className="bg-[#121624] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Sensor Payload Mass</span>
                  <span className="font-mono-telemetry font-bold text-white">{payloadKg} kg</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.1"
                  value={payloadKg}
                  onChange={(e) => setPayloadKg(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#B600A8]"
                />
              </div>

            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSimulation}
              disabled={simulating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#B600A8] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00F0FF]/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{simulating ? 'Computing Aerodynamic Twin Simulation...' : 'Execute Pre-Flight Simulation'}</span>
            </button>

            {/* Simulation Results Output */}
            {simResult && (
              <div className="space-y-4 pt-2">
                
                {/* Feasibility Alert Card */}
                <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  simResult.feasibility === 'OPTIMAL'
                    ? 'bg-[#00FF9D]/10 border-[#00FF9D]/30 text-[#00FF9D]'
                    : simResult.feasibility === 'MODERATE_RISK'
                    ? 'bg-[#FFB800]/10 border-[#FFB800]/30 text-[#FFB800]'
                    : 'bg-[#FF3366]/10 border-[#FF3366]/30 text-[#FF3366]'
                }`}>
                  {simResult.feasibility === 'OPTIMAL' ? (
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider">
                      FEASIBILITY STATUS: {simResult.feasibility}
                    </div>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      {simResult.ai_recommendation}
                    </p>
                  </div>
                </div>

                {/* Key Simulation Outputs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono-telemetry">
                  <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400">FLIGHT TIME</span>
                    <div className="text-lg font-bold text-white my-0.5">
                      {simResult.predicted_metrics.flight_duration_min} min
                    </div>
                  </div>

                  <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400">BATTERY DRAIN</span>
                    <div className="text-lg font-bold text-[#FFB800] my-0.5">
                      -{simResult.predicted_metrics.predicted_battery_drain_percent}%
                    </div>
                  </div>

                  <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400">LANDING RESERVE</span>
                    <div className={`text-lg font-bold my-0.5 ${
                      simResult.predicted_metrics.estimated_landing_battery > 30 ? 'text-[#00FF9D]' : 'text-[#FF3366]'
                    }`}>
                      {simResult.predicted_metrics.estimated_landing_battery}%
                    </div>
                  </div>

                  <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400">BURN RATE</span>
                    <div className="text-lg font-bold text-[#00F0FF] my-0.5">
                      {simResult.predicted_metrics.effective_burn_rate_pct_min}%/m
                    </div>
                  </div>
                </div>

                {/* Simulated Energy Depletion Curve */}
                <div className="bg-[#121624] p-3.5 rounded-xl border border-white/5 space-y-2">
                  <div className="text-xs text-gray-400 font-semibold">
                    Simulated Battery Discharge Curve over Timeline:
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono-telemetry text-gray-300">
                    {simResult.energy_profile_curve.map((pt, i) => (
                      <div key={i} className="text-center">
                        <div className="text-[#00F0FF] font-bold">{pt.battery}%</div>
                        <div className="text-[9px] text-gray-500">{pt.min}m</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
