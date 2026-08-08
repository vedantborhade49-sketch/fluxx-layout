import React, { useState } from 'react';
import { 
  Sliders, 
  X, 
  Flame, 
  Home, 
  Wind, 
  Activity, 
  Zap, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { api } from '../../services/api';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  droneId: string;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  droneId
}) => {
  if (!isOpen) return null;

  const [windSpeed, setWindSpeed] = useState<number>(6.5);
  const [windDir, setWindDir] = useState<number>(210);
  const [injecting, setInjecting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInjectSpike = async () => {
    try {
      setInjecting(true);
      const res = await api.injectSpike(droneId);
      setFeedback(`🔥 Severe VOC/PM2.5 Pollution Spike injected into ${droneId}! Telemetry & AI Alerts triggered.`);
    } catch (e) {
      console.error(e);
    } finally {
      setInjecting(false);
    }
  };

  const handleEmergencyRTH = async () => {
    try {
      await api.emergencyRTH(droneId);
      setFeedback(`🚨 Emergency RTH initiated for ${droneId}. Autonomous return trajectory locked.`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateWind = async () => {
    try {
      await api.setWind(windSpeed, windDir);
      setFeedback(`💨 Atmospheric wind updated to ${windSpeed} m/s @ ${windDir}°. Dispersion model recalculated.`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D101A] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#FF3366]" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Environmental Anomaly & Mission Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="p-3 rounded-xl bg-[#00FF9D]/15 border border-[#00FF9D]/30 text-xs text-[#00FF9D] font-mono-telemetry leading-relaxed">
            {feedback}
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-4">
          
          {/* Spike Injection Button */}
          <div className="bg-[#121624] p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-[#FF3366]" />
                <span>Simulate Industrial Plume Leak</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono-telemetry">TARGET: {droneId}</span>
            </div>
            <p className="text-xs text-gray-400">
              Injects sudden +180 AQI spike with high VOC & PM2.5 concentrations to evaluate real-time alerting and dispersion algorithms.
            </p>
            <button
              onClick={handleInjectSpike}
              disabled={injecting}
              className="w-full py-2 rounded-lg bg-[#FF3366] hover:bg-[#FF3366]/90 text-white font-bold text-xs shadow-lg shadow-[#FF3366]/20 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{injecting ? 'Injecting Anomaly...' : 'Trigger Immediate Pollution Spike'}</span>
            </button>
          </div>

          {/* Wind Atmosphere Adjuster */}
          <div className="bg-[#121624] p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center space-x-1.5">
                <Wind className="w-4 h-4 text-[#00F0FF]" />
                <span>Atmospheric Wind Vector Injection</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono-telemetry">
                {windSpeed} m/s @ {windDir}°
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Wind Velocity (m/s)</span>
                <span className="text-white font-mono-telemetry font-bold">{windSpeed} m/s</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Wind Compass Direction (°)</span>
                <span className="text-white font-mono-telemetry font-bold">{windDir}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={windDir}
                onChange={(e) => setWindDir(parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#00FF9D]"
              />
            </div>

            <button
              onClick={handleUpdateWind}
              className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all"
            >
              Update Wind Field
            </button>
          </div>

          {/* Emergency Return to Home */}
          <div className="bg-[#121624] p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Home className="w-4 h-4 text-[#FFB800]" />
                <span>Emergency Return to Base (RTH)</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Force autopilot to abort mission and return</p>
            </div>
            <button
              onClick={handleEmergencyRTH}
              className="px-3 py-1.5 rounded-lg bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/40 text-xs font-bold transition-all"
            >
              Trigger RTH
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
