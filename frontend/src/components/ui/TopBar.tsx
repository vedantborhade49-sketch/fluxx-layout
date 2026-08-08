import React from 'react';
import { StatusBadge } from './StatusBadge';
import { GlassPanel } from './GlassPanel';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const TopBar: React.FC = () => {
  const { currentReading } = useEnvironmentStore();
  const timeStr = currentReading 
    ? new Date(currentReading.timestamp).toLocaleTimeString('en-US', { hour12: false }) 
    : '15:42:00';
  
  const status = currentReading?.mode === 'replay' ? 'REPLAY' : 'LIVE';

  return (
    <GlassPanel heavy className="w-full h-16 px-6 flex items-center justify-between z-50 mb-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-black text-fluxx-text tracking-tighter">FLUXX</h1>
        <div className="w-px h-6 bg-slate-300" />
        <div className="text-xs font-bold text-fluxx-muted uppercase tracking-widest">
          KHARGHAR <span className="text-slate-300 mx-1">/</span> ENVIRONMENTAL TWIN
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <StatusBadge status={status} />
        <div className="text-sm font-bold font-mono text-fluxx-text bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
          {timeStr}
        </div>
      </div>
    </GlassPanel>
  );
};
