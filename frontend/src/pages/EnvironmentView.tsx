import React from 'react';
import { useEnvironmentStore } from '../stores/environmentStore';
import { EarthMap } from '../map/EarthMap';
import { SensorStrip } from '../components/ui/SensorStrip';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Layers, MapPin, Activity } from 'lucide-react';

export const EnvironmentView: React.FC = () => {
  const { currentReading } = useEnvironmentStore();
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
      
      {/* Base Layer: Google 3D Earth */}
      <div className="absolute inset-0 z-0">
        <EarthMap />
      </div>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 pointer-events-auto">
        <GlassPanel className="p-2 flex flex-col space-y-2 shadow-lg">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-fluxx-text border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <Layers className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-fluxx-teal text-white shadow-md cursor-pointer hover:bg-fluxx-teal-hover transition-colors">
            <MapPin className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-fluxx-text border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            <Activity className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-fluxx-text border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer font-black text-xs">
            3D
          </button>
        </GlassPanel>
      </div>

      {/* Floating Sensor Strip at the bottom of the map */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-10 pointer-events-auto">
        <SensorStrip reading={currentReading} />
      </div>

    </div>
  );
};
