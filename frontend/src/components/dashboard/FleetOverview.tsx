import React from 'react';
import { 
  Battery, 
  BatteryCharging, 
  Gauge, 
  Compass, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Home, 
  PauseCircle, 
  ArrowDownCircle,
  Navigation,
  Crosshair
} from 'lucide-react';
import { DroneState, SensorReading } from '../../types';

interface FleetOverviewProps {
  drone: DroneState | null;
  sensor: SensorReading | null;
  onEmergencyRTH: (droneId: string) => void;
  onSetStatus: (droneId: string, status: string) => void;
}

export const FleetOverview: React.FC<FleetOverviewProps> = ({
  drone,
  sensor,
  onEmergencyRTH,
  onSetStatus
}) => {
  if (!drone) return null;

  const battery = sensor?.battery ?? drone.battery;
  const altitude = sensor?.altitude ?? drone.altitude;
  const speed = drone.speed;
  const heading = drone.heading;
  const lat = sensor?.latitude ?? drone.latitude;
  const lng = sensor?.longitude ?? drone.longitude;
  const signal = drone.signal_strength;

  // Battery color logic
  const getBatteryColor = (pct: number) => {
    if (pct > 50) return '#00FF9D';
    if (pct > 20) return '#FFB800';
    return '#FF3366';
  };

  return (
    <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Background HUD Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/5 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center">
            <Crosshair className="w-4 h-4 text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-wide">{drone.name || drone.model}</h2>
              <span className="text-[11px] font-mono-telemetry text-gray-400">[{drone.id}]</span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono-telemetry">
              SN: {drone.serial_number} • FW: {drone.firmware}
            </p>
          </div>
        </div>

        {/* Status Pill & Mission ID */}
        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono-telemetry font-bold tracking-wide ${
            drone.status === 'ACTIVE' 
              ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30'
              : drone.status === 'RTH'
              ? 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 animate-pulse'
              : 'bg-white/10 text-gray-300'
          }`}>
            ● {drone.status}
          </span>
          {drone.current_mission_id && (
            <span className="px-2.5 py-1 rounded-lg bg-[#141824] text-[11px] text-[#00F0FF] border border-white/5 font-mono-telemetry">
              {drone.current_mission_id}
            </span>
          )}
        </div>
      </div>

      {/* Telemetry HUD Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
        
        {/* 1. Battery Gauge */}
        <div className="bg-[#121624]/80 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center space-x-1">
              <Battery className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span>Battery</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono-telemetry">22.2V</span>
          </div>
          <div className="my-1">
            <div className="text-xl font-bold font-mono-telemetry" style={{ color: getBatteryColor(battery) }}>
              {battery.toFixed(1)}%
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, battery))}%`, backgroundColor: getBatteryColor(battery) }} 
              />
            </div>
          </div>
          <span className="text-[9px] text-gray-400 font-mono-telemetry">Est. Rem: 38 min</span>
        </div>

        {/* 2. Altitude */}
        <div className="bg-[#121624]/80 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Altitude</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono-telemetry">AGL</span>
          </div>
          <div className="my-1">
            <div className="text-xl font-bold font-mono-telemetry text-white">
              {altitude.toFixed(1)} <span className="text-xs font-normal text-gray-400">m</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-[#00F0FF] rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (altitude / 200) * 100)}%` }} 
              />
            </div>
          </div>
          <span className="text-[9px] text-gray-400 font-mono-telemetry">Ceiling: 400m</span>
        </div>

        {/* 3. Ground Speed */}
        <div className="bg-[#121624]/80 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Airspeed</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono-telemetry">GS</span>
          </div>
          <div className="my-1">
            <div className="text-xl font-bold font-mono-telemetry text-white">
              {speed.toFixed(1)} <span className="text-xs font-normal text-gray-400">m/s</span>
            </div>
            <div className="text-[11px] text-gray-400 font-mono-telemetry">
              {(speed * 3.6).toFixed(1)} km/h
            </div>
          </div>
          <span className="text-[9px] text-gray-400 font-mono-telemetry">Max: 22 m/s</span>
        </div>

        {/* 4. Heading & Compass */}
        <div className="bg-[#121624]/80 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-[#B600A8]" />
              <span>Bearing</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono-telemetry">MAG</span>
          </div>
          <div className="my-1 flex items-center space-x-2">
            <div className="text-xl font-bold font-mono-telemetry text-white">
              {heading.toFixed(0)}°
            </div>
            <div className="w-5 h-5 rounded-full border border-[#B600A8]/40 flex items-center justify-center">
              <div 
                className="w-0.5 h-3 bg-[#B600A8] rounded-full origin-bottom" 
                style={{ transform: `rotate(${heading}deg)` }} 
              />
            </div>
          </div>
          <span className="text-[9px] text-gray-400 font-mono-telemetry">
            {heading < 45 || heading >= 315 ? 'NORTH' : heading < 135 ? 'EAST' : heading < 225 ? 'SOUTH' : 'WEST'}
          </span>
        </div>

        {/* 5. GPS Coordinates */}
        <div className="bg-[#121624]/80 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span>GPS Fix</span>
            </span>
            <span className="text-[10px] text-[#00FF9D] font-mono-telemetry">3D RTK</span>
          </div>
          <div className="my-0.5 font-mono-telemetry text-[11px] text-white">
            <div>{lat.toFixed(5)}° N</div>
            <div>{lng.toFixed(5)}° W</div>
          </div>
          <span className="text-[9px] text-gray-400 font-mono-telemetry">Sats: 19 HDOP: 0.6</span>
        </div>

        {/* 6. Signal & Link */}
        <div className="bg-[#121624]/80 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>RF Link</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono-telemetry">5.8 GHz</span>
          </div>
          <div className="my-1">
            <div className="text-xl font-bold font-mono-telemetry text-[#00F0FF]">
              {signal.toFixed(0)}%
            </div>
            <div className="text-[11px] text-gray-400 font-mono-telemetry">-62 dBm</div>
          </div>
          <span className="text-[9px] text-[#00FF9D] font-mono-telemetry">Latency: 18ms</span>
        </div>

      </div>

      {/* Flight Control Actions Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#00FF9D]" />
          <span>Autonomous Survey Mode: Active Grid Sweep #4</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSetStatus(drone.id, 'HOVER')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/10 transition-all"
          >
            <PauseCircle className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Hold Position</span>
          </button>
          
          <button
            onClick={() => onEmergencyRTH(drone.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-xs font-semibold text-[#FF3366] border border-[#FF3366]/40 transition-all shadow-md shadow-[#FF3366]/20"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Emergency RTH</span>
          </button>
        </div>
      </div>

    </div>
  );
};
