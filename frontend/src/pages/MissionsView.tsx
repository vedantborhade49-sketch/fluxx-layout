import React from 'react';
import { 
  Send, 
  MapPin, 
  Battery, 
  Wifi, 
  Crosshair, 
  CheckCircle2, 
  Clock, 
  Plus,
  Video
} from 'lucide-react';
import { EarthMap } from '../map/EarthMap';

export const MissionsView: React.FC = () => {

  const activeMissions = [
    { id: 'MSN-042', name: 'Kharghar Sector 12 Airspace Survey', status: 'ACTIVE', progress: 45, time: '14:32:00' },
    { id: 'MSN-043', name: 'Taloja Industrial Perimeter', status: 'SCHEDULED', progress: 0, time: '18:00:00' },
    { id: 'MSN-041', name: 'Belapur Node Baseline', status: 'COMPLETED', progress: 100, time: '10:15:00' }
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-5">
      
      {/* LEFT: Mission List Sidebar (Col-span-3 equivalent) */}
      <div className="w-full lg:w-80 flex flex-col space-y-4">
        
        <div className="flex justify-between items-center bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">FLEET STATUS</div>
            <div className="text-sm font-black text-slate-800">1 Active <span className="text-slate-400 font-medium">/ 3 Total</span></div>
          </div>
          <button className="w-8 h-8 rounded-lg bg-[#0EA5E9] text-white flex items-center justify-center hover:bg-[#0284C7] transition-colors cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex-1 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">TODAY'S MISSIONS</h3>
          
          <div className="space-y-3">
            {activeMissions.map((mission) => (
              <div 
                key={mission.id} 
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  mission.status === 'ACTIVE' 
                    ? 'border-[#0EA5E9] bg-[#F0F9FF]' 
                    : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500">{mission.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    mission.status === 'ACTIVE' ? 'bg-[#0EA5E9] text-white' :
                    mission.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {mission.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 leading-tight mb-2">
                  {mission.name}
                </div>
                
                {mission.status === 'ACTIVE' && (
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#BAE6FD] mb-2">
                    <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: `${mission.progress}%` }} />
                  </div>
                )}
                
                <div className="flex items-center space-x-1 text-[10px] font-medium text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{mission.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Active Mission Dashboard (Col-span-9 equivalent) */}
      <div className="flex-1 flex flex-col space-y-5">
        
        {/* Top: 3D Mission Map */}
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-[#06090E]">
          
          {/* Map */}
          <div className="absolute inset-0 z-0">
            <EarthMap />
          </div>

          {/* Floating Mission Header */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg px-4 py-3 flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">MSN-042 IN PROGRESS</div>
              <div className="text-sm font-black text-slate-800">Kharghar Sector 12 Airspace Survey</div>
            </div>
          </div>

          {/* Floating Camera Feed Simulation */}
          <div className="absolute top-4 right-4 z-10 w-48 h-32 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-black/50 px-2 py-1 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center space-x-1 text-[9px] font-bold text-white">
                <Video className="w-3 h-3 text-red-500" />
                <span>VTOL CAM 1</span>
              </div>
              <span className="text-[9px] font-mono text-slate-300">REC</span>
            </div>
            <div className="flex-1 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.05,73.07&zoom=17&size=200x150&maptype=satellite')] bg-cover opacity-60" />
              <Crosshair className="w-6 h-6 text-white/50 relative z-10" />
              
              {/* Fake UI Overlay */}
              <div className="absolute bottom-1 left-2 text-[8px] font-mono text-[#0EA5E9] font-bold">ALT 42M</div>
              <div className="absolute bottom-1 right-2 text-[8px] font-mono text-emerald-400 font-bold">LOCKED</div>
            </div>
          </div>
        </div>

        {/* Bottom: Live Telemetry Dashboard */}
        <div className="h-32 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center divide-x divide-slate-100">
          
          <div className="flex-1 px-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">VTOL CALLSIGN</div>
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-[#0EA5E9]" />
              <span className="text-lg font-black text-slate-800">FLUXX-ALPHA</span>
            </div>
          </div>

          <div className="flex-1 px-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ALTITUDE (AGL)</div>
            <div className="text-xl font-black text-slate-800 tabular-nums">42.5 <span className="text-xs text-slate-500">m</span></div>
          </div>

          <div className="flex-1 px-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GROUND SPEED</div>
            <div className="text-xl font-black text-slate-800 tabular-nums">12.4 <span className="text-xs text-slate-500">m/s</span></div>
          </div>

          <div className="flex-1 px-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">SYSTEM STATUS</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-600">
                <Battery className="w-4 h-4 text-emerald-500" />
                <span>84%</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-600">
                <Wifi className="w-4 h-4 text-[#0EA5E9]" />
                <span>-42 dBm</span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-6 flex items-center justify-center">
            <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm">
              ABORT MISSION
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
