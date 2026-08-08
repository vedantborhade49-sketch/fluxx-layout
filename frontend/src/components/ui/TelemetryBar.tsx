import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Plane, Battery, Signal, Navigation } from 'lucide-react';

interface TelemetryBarProps {
  droneId: string;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ droneId }) => {
  return (
    <GlassPanel className="w-full px-6 py-4 flex items-center justify-between shadow-md bg-white/80">
      
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-fluxx-teal/10 flex items-center justify-center text-fluxx-teal">
          <Plane className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-fluxx-muted uppercase tracking-widest">Active Fleet</div>
          <div className="font-black text-fluxx-text">{droneId}</div>
        </div>
      </div>

      <div className="flex space-x-12">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1 text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mb-1">
            <Navigation className="w-3 h-3" />
            <span>ALT (AGL)</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-fluxx-text">120</span>
            <span className="text-xs font-semibold text-fluxx-muted">m</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1 text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mb-1">
            <Plane className="w-3 h-3" />
            <span>GS</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-fluxx-text">14.2</span>
            <span className="text-xs font-semibold text-fluxx-muted">m/s</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1 text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mb-1">
            <Battery className="w-3 h-3" />
            <span>BAT</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-fluxx-text">78</span>
              <span className="text-xs font-semibold text-fluxx-muted">%</span>
            </div>
            <div className="w-16 h-2 bg-slate-200 rounded-sm overflow-hidden">
              <div className="h-full bg-fluxx-teal" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1 text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mb-1">
            <Signal className="w-3 h-3" />
            <span>LINK</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-black text-fluxx-text">99</span>
            <span className="text-xs font-semibold text-fluxx-muted">%</span>
          </div>
        </div>
      </div>

    </GlassPanel>
  );
};
