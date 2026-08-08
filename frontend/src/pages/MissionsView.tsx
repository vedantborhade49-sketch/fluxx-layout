import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { TelemetryBar } from '../components/ui/TelemetryBar';
import { EarthMap } from '../map/EarthMap';

export const MissionsView: React.FC = () => {
  return (
    <div className="w-full h-full flex space-x-4">
      
      {/* Sidebar: Flight List */}
      <GlassPanel className="w-80 h-full flex flex-col shadow-sm bg-white/70 overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mb-1">Fleet Operations</div>
          <h2 className="text-xl font-black text-fluxx-text">Active Missions</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {['VTOL-001', 'VTOL-002'].map((drone, idx) => (
            <div key={drone} className={`p-4 rounded-xl cursor-pointer border ${idx === 0 ? 'bg-white border-fluxx-teal shadow-sm' : 'bg-transparent border-slate-200 hover:bg-white/50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-fluxx-text">{drone}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${idx === 0 ? 'bg-fluxx-teal/10 text-fluxx-teal' : 'bg-slate-100 text-slate-500'}`}>
                  {idx === 0 ? 'IN FLIGHT' : 'CHARGING'}
                </span>
              </div>
              <div className="text-xs text-fluxx-muted">Routine Air Quality Patrol</div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Main Area: 3D Map + PIP + Telemetry */}
      <div className="flex-1 h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        
        {/* 3D Map */}
        <div className="absolute inset-0 z-0">
          <EarthMap />
        </div>

        {/* PIP Camera Feed */}
        <div className="absolute top-4 right-4 z-10 w-64 h-48 rounded-xl overflow-hidden border-2 border-white shadow-xl bg-slate-900 flex flex-col">
          <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-md">CAM 1</span>
          </div>
          {/* Simulated Camera Content */}
          <div className="flex-1 w-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.05,73.07&zoom=18&size=400x300&maptype=satellite')] bg-cover opacity-80 mix-blend-luminosity" />
        </div>

        {/* Telemetry Footer */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <TelemetryBar droneId="VTOL-001" />
        </div>

      </div>
    </div>
  );
};
