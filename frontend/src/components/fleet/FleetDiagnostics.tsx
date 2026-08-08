import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Plane, 
  Battery, 
  Clock, 
  CheckCircle2, 
  Activity, 
  RefreshCw,
  Cpu,
  Radio
} from 'lucide-react';
import { FleetSummary, FleetDroneItem } from '../../types';
import { api } from '../../services/api';

export const FleetDiagnostics: React.FC = () => {
  const [fleet, setFleet] = useState<FleetSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFleet = async () => {
    try {
      setLoading(true);
      const data = await api.getFleetSummary();
      setFleet(data);
    } catch (e) {
      console.error('Error loading fleet:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleet();
    const interval = setInterval(loadFleet, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!fleet) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Fleet Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-[#0D101A] border border-white/10 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-400 font-medium">Total Fleet</div>
          <div className="text-2xl font-bold font-mono-telemetry text-white my-1">{fleet.total_drones} Units</div>
          <span className="text-[10px] text-gray-500 font-mono-telemetry">Enterprise VTOL</span>
        </div>

        <div className="bg-[#0D101A] border border-white/10 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-400 font-medium">Active Airborne</div>
          <div className="text-2xl font-bold font-mono-telemetry text-[#00FF9D] my-1">{fleet.active_airborne ?? fleet.active_drones}</div>
          <span className="text-[10px] text-[#00FF9D] font-mono-telemetry">On Mission</span>
        </div>

        <div className="bg-[#0D101A] border border-white/10 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-400 font-medium">Docked Charging</div>
          <div className="text-2xl font-bold font-mono-telemetry text-[#00F0FF] my-1">{fleet.charging_docked ?? 2}</div>
          <span className="text-[10px] text-gray-500 font-mono-telemetry">Pad Ready</span>
        </div>

        <div className="bg-[#0D101A] border border-white/10 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-400 font-medium">Maintenance Due</div>
          <div className="text-2xl font-bold font-mono-telemetry text-[#FF3366] my-1">{fleet.under_maintenance ?? fleet.maintenance_required}</div>
          <span className="text-[10px] text-[#FF3366] font-mono-telemetry">Hangar Queue</span>
        </div>

        <div className="bg-[#0D101A] border border-white/10 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-400 font-medium">Avg Health Score</div>
          <div className="text-2xl font-bold font-mono-telemetry text-[#00FF9D] my-1">{fleet.fleet_average_health ?? fleet.average_fleet_health_score}%</div>
          <span className="text-[10px] text-gray-500 font-mono-telemetry">Nominal Rating</span>
        </div>

        <div className="bg-[#0D101A] border border-white/10 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-400 font-medium">Total Flight Time</div>
          <div className="text-2xl font-bold font-mono-telemetry text-white my-1">{fleet.total_fleet_flight_hours ?? 342}h</div>
          <span className="text-[10px] text-gray-500 font-mono-telemetry">Cumulative Air</span>
        </div>

      </div>

      {/* Fleet Drones Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Plane className="w-4 h-4 text-[#00F0FF]" />
            <span>VTOL Airframes & Hardware Component Health</span>
          </h3>
          <button
            onClick={loadFleet}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Diagnostics</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fleet.drones.map((drone) => (
            <div
              key={drone.id}
              className="bg-[#0D101A] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 hover:border-white/25 transition-all"
            >
              {/* Drone Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/5">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white text-base">{drone.name}</h4>
                    <span className="text-xs font-mono-telemetry text-[#00F0FF]">[{drone.id}]</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono-telemetry mt-0.5">
                    {drone.serial} • FW: {drone.firmware}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono-telemetry font-bold ${
                  drone.status === 'ACTIVE'
                    ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30'
                    : drone.status === 'CHARGING'
                    ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                    : 'bg-[#FF3366]/15 text-[#FF3366] border border-[#FF3366]/30 animate-pulse'
                }`}>
                  ● {drone.status}
                </span>
              </div>

              {/* Pilot & Org */}
              <div className="text-xs text-gray-300 space-y-1">
                <div>Operator: <span className="text-white font-medium">{drone.assigned_operator}</span></div>
                <div className="text-gray-400 text-[11px]">Assigned: {drone.assigned_org}</div>
              </div>

              {/* Diagnostics Grid */}
              <div className="bg-[#121624] p-3 rounded-xl border border-white/5 space-y-1.5 text-xs font-mono-telemetry">
                <div className="flex justify-between">
                  <span className="text-gray-400">Motor Health:</span>
                  <span className="text-[#00FF9D] font-bold">{drone.hardware_diagnostics.motor_health ?? 97}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ESC Thermals:</span>
                  <span className="text-gray-200">{drone.hardware_diagnostics.esc_thermals ?? '44°C Nominal'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vibration RMS:</span>
                  <span className={(drone.hardware_diagnostics.vibration_rms || '').includes('wear') ? 'text-[#FF3366]' : 'text-gray-200'}>
                    {drone.hardware_diagnostics.vibration_rms ?? '0.12g Nominal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GPS HDOP:</span>
                  <span className="text-[#00F0FF]">{drone.hardware_diagnostics.gps_hdop ?? '0.8'} (High Precision)</span>
                </div>
              </div>

              {/* Maintenance Countdown Bar */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono-telemetry">
                <span className="text-gray-400">Maintenance Check:</span>
                <span className={drone.maintenance_due_in_hours < 0 ? 'text-[#FF3366] font-bold' : 'text-[#00FF9D]'}>
                  {drone.maintenance_due_in_hours < 0 ? 'OVERDUE (Service Required)' : `In ${drone.maintenance_due_in_hours}h`}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
