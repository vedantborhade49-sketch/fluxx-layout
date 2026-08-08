import React, { useState, useEffect } from 'react';
import { 
  Search,
  Bell, 
  MapPin,
  Sun
} from 'lucide-react';
import { useEnvironmentStore } from '../stores/environmentStore';

interface TopBarProps {
  onOpenNotifications?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenNotifications
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [secondsAgo, setSecondsAgo] = useState<number>(1.2);
  const { currentReading, replayStatus } = useEnvironmentStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev > 2.0 ? 0.4 : +(prev + 0.3).toFixed(1)));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 px-6 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:flex">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-2 border border-slate-200 rounded-full leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0EA5E9] focus:border-[#0EA5E9] sm:text-sm shadow-sm transition-all text-slate-700"
            placeholder="Search location, mission, report..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-slate-400 font-sans text-xs border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      {/* Center/Right Status Metrics */}
      <div className="flex-1 flex items-center justify-end space-x-6 lg:space-x-8">
        
        {/* Data Status */}
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-700 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DATA REPLAY</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {replayStatus.totalSamples || 50} / {replayStatus.totalSamples || 50} Observations
          </div>
        </div>

        <div className="hidden lg:block w-px h-8 bg-slate-200" />

        {/* Update Time */}
        <div className="hidden lg:flex flex-col">
          <div className="font-bold text-xs text-slate-700 uppercase tracking-wide">
            LAST UPDATE
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {secondsAgo}s ago
          </div>
        </div>

        <div className="hidden lg:block w-px h-8 bg-slate-200" />

        {/* Location */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center space-x-1 font-bold text-xs text-slate-700 uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>LOCATION</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 ml-4.5">
            19.04° N, 73.07° E
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Weather */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-700">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{currentReading.sensors.temperature.toFixed(1)}°C</span>
          </div>
          <div className="text-[10px] text-slate-500 ml-5.5">
            Mumbai
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-200" />

        {/* Clock */}
        <div className="hidden sm:flex flex-col text-right">
          <div className="font-mono text-sm font-bold text-slate-700 tabular-nums">
            {timeStr}
          </div>
          <div className="text-[10px] text-slate-500">
            {dateStr}
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 pl-2">
          
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer bg-white shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
              3
            </span>
          </button>

          <button className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-300 cursor-pointer shadow-sm">
            F
          </button>

        </div>

      </div>

    </header>
  );
};
