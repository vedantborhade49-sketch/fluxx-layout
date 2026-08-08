import React from 'react';
import { Play, SkipBack } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface ReplayTimelineProps {
  currentTime: string;
}

export const ReplayTimeline: React.FC<ReplayTimelineProps> = ({ currentTime }) => {
  return (
    <GlassPanel heavy className="w-full flex items-center space-x-6 px-6 py-3">
      <div className="flex items-center space-x-4">
        <button className="w-10 h-10 rounded-full bg-fluxx-teal text-white flex items-center justify-center cursor-pointer hover:bg-fluxx-teal-hover shadow-md">
          <Play className="w-4 h-4 ml-0.5" />
        </button>
        <button className="text-fluxx-muted hover:text-fluxx-text cursor-pointer">
          <SkipBack className="w-5 h-5" />
        </button>
      </div>

      <div className="text-xs font-bold text-fluxx-muted w-12">08:00</div>
      
      <div className="flex-1 relative flex items-center py-4 cursor-pointer">
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-fluxx-teal" style={{ width: '65%' }} />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-fluxx-teal rounded-full shadow-md" style={{ left: '65%' }} />
        <div className="absolute -top-1 left-[65%] -translate-x-1/2 text-[10px] font-bold text-fluxx-text bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">
          {currentTime}
        </div>
      </div>

      <div className="text-xs font-bold text-fluxx-muted w-12 text-right">18:00</div>
    </GlassPanel>
  );
};
