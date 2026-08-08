import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  CloudSun, 
  Wind, 
  Droplets, 
  Building2, 
  Plane, 
  Volume2, 
  VolumeX, 
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { DroneState, WeatherData, OrganizationInfo } from '../../types';

interface HeaderProps {
  drones: DroneState[];
  selectedDroneId: string;
  onSelectDrone: (id: string) => void;
  isConnected: boolean;
  weather: WeatherData | null;
  organizations: OrganizationInfo[];
  selectedOrgId: string;
  onSelectOrg: (id: string) => void;
  onOpenSimModal: () => void;
  audioAlertsEnabled: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  drones,
  selectedDroneId,
  onSelectDrone,
  isConnected,
  weather,
  organizations,
  selectedOrgId,
  onSelectOrg,
  onOpenSimModal,
  audioAlertsEnabled,
  onToggleAudio
}) => {
  const [time, setTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: false }));
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDrone = drones.find((d) => d.id === selectedDroneId) || drones[0];
  const currentOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];

  return (
    <header className="bg-[#070b14]/95 border-b border-white/10 px-4 lg:px-6 py-3 backdrop-blur-xl">
      <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Organization & Active Drone Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Organization Switcher */}
          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <Building2 className="w-4 h-4 text-[#00E7B3]" />
            <select
              value={selectedOrgId}
              onChange={(e) => onSelectOrg(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id} className="bg-[#0b101d] text-white">
                  {org.name}
                </option>
              ))}
            </select>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#00E7B3]/15 text-[#00E7B3] text-[9px] font-mono font-bold">
              {currentOrg?.code || 'TENANT'}
            </span>
          </div>

          {/* Active VTOL Drone Selector */}
          <div className="flex items-center space-x-2 bg-[#00B8FF]/10 px-3 py-1.5 rounded-xl border border-[#00B8FF]/30">
            <Plane className="w-4 h-4 text-[#00B8FF] animate-pulse" />
            <select
              value={selectedDroneId}
              onChange={(e) => onSelectDrone(e.target.value)}
              className="bg-transparent text-xs text-[#00B8FF] font-bold focus:outline-none cursor-pointer pr-1 font-mono"
            >
              {drones.map((drone) => (
                <option key={drone.id} value={drone.id} className="bg-[#0b101d] text-white">
                  {drone.id} • {drone.name || drone.model.split(' ')[1]} ({drone.status})
                </option>
              ))}
            </select>
            <span className={`w-2 h-2 rounded-full ${
              currentDrone?.status === 'ACTIVE' ? 'bg-[#00E7B3] animate-ping' : 'bg-amber-400'
            }`} />
          </div>

        </div>

        {/* Center: Live Atmospheric Weather HUD */}
        {weather && (
          <div className="hidden xl:flex items-center space-x-5 bg-white/5 px-4 py-1.5 rounded-2xl border border-white/10 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">{weather.temperature}°C</span>
              <span className="text-[10px] text-slate-400">({weather.condition.split('/')[0]})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-[#00B8FF]" />
              <span>{weather.wind_speed} m/s</span>
              <span className="text-[10px] text-slate-400 font-mono">{weather.wind_direction}°</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-[#00E7B3]" />
              <span>{weather.humidity}% RH</span>
            </div>
            <div className="text-[11px] text-[#00E7B3] font-mono flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Flight Window: OPTIMAL</span>
            </div>
          </div>
        )}

        {/* Right: Live Stream Status, Audio, Clock & Sim Action */}
        <div className="flex items-center space-x-2.5">
          
          {/* Audio Chime */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              audioAlertsEnabled 
                ? 'bg-[#00B8FF]/15 text-[#00B8FF] border-[#00B8FF]/40' 
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
            title={audioAlertsEnabled ? 'Audio Alerts: Enabled' : 'Audio Alerts: Muted'}
          >
            {audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Simulator Quick Action */}
          <button
            onClick={onOpenSimModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate Anomaly</span>
          </button>

          {/* WebSocket Status Beacon */}
          <div className="flex items-center space-x-2 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#00E7B3] animate-pulse" />
                <span className="text-[11px] font-mono text-[#00E7B3] font-semibold">LIVE STREAM</span>
                <Wifi className="w-3.5 h-3.5 text-[#00E7B3]" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[11px] font-mono text-rose-400">OFFLINE CACHE</span>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              </>
            )}
          </div>

          {/* Digital UTC Clock */}
          <div className="hidden sm:flex flex-col items-end font-mono bg-white/5 px-3 py-1 rounded-xl border border-white/10">
            <span className="text-xs font-bold text-white tracking-wider">{time}</span>
            <span className="text-[9px] text-slate-400">{utcTime}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
