import React from 'react';
import { useEnvironmentStore } from '../stores/environmentStore';

export const OverviewView: React.FC = () => {
  const { currentReading, eri } = useEnvironmentStore();

  return (
    <div className="h-full flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#06090E] to-black rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#0EA5E9] rounded-full blur-[150px] opacity-10 mix-blend-screen -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[150px] opacity-[0.07] mix-blend-screen translate-x-1/3 translate-y-1/3" />
      
      {/* Minimal ASCII / Terminal-style UI box */}
      <div className="fluxx-glass-dark rounded-2xl w-full max-w-4xl p-1 shadow-2xl animate-float">
        <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
          
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-5 border-b border-white/10 bg-white/5">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-black text-white tracking-tighter">FLUXX</h1>
                <div className="h-4 w-px bg-white/20 mx-2" />
                <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-widest px-2 py-1 bg-[#0EA5E9]/10 rounded border border-[#0EA5E9]/20">
                  Kharghar Environmental Intelligence
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-right">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{currentReading?.mode === 'replay' ? 'DATA REPLAY' : 'LIVE'}</span>
              </div>
              <div className="text-sm font-mono text-slate-300 font-bold bg-black/50 px-3 py-1 rounded-md border border-white/5">
                {currentReading ? new Date(currentReading.timestamp).toLocaleTimeString('en-US', { hour12: false }) : '15:24:08'}
              </div>
            </div>
          </div>

          {/* Main Body */}
          <div className="p-12 flex justify-between items-center bg-gradient-to-b from-transparent to-black/30">
            
            {/* Risk Index Block */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">ENVIRONMENTAL RISK</div>
              <div className="flex items-end space-x-4">
                <div className="text-7xl font-black text-white tracking-tighter leading-none shadow-black drop-shadow-lg">
                  {eri.score}
                </div>
                <div className="mb-2">
                  <div className={`text-sm font-bold uppercase tracking-widest ${
                    eri.score > 75 ? 'text-red-500' : eri.score > 50 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>{eri.level}</div>
                  <div className="text-[10px] text-slate-500 uppercase">/ 100</div>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Key Sensors */}
            <div className="flex space-x-12">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">PM2.5</div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">{currentReading?.sensors?.pm25.toFixed(1) || '--'}</span>
                  <span className="text-xs font-mono text-slate-500">µg</span>
                </div>
                <div className="text-[9px] font-bold text-red-500 mt-2 tracking-wider">+8.2% SURGE</div>
              </div>
              
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">PM10</div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">{currentReading?.sensors?.pm10.toFixed(1) || '--'}</span>
                  <span className="text-xs font-mono text-slate-500">µg</span>
                </div>
                <div className="text-[9px] font-bold text-amber-500 mt-2 tracking-wider">ELEVATED</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
