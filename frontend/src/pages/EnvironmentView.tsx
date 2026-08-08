import React from 'react';
import { 
  Layers, 
  MapPin, 
  Activity,
  Play,
  SkipBack,
  ChevronDown
} from 'lucide-react';
import { useEnvironmentStore } from '../stores/environmentStore';
import { EarthMap } from '../map/EarthMap';

export const EnvironmentView: React.FC = () => {
  const { currentReading, eri } = useEnvironmentStore();
  
  if (!currentReading || !currentReading.sensors) {
    return <div className="p-4">Loading environment data...</div>;
  }
  
  const sensors = currentReading.sensors;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-[#06090E]">
      
      {/* Base Layer: Google 3D Earth */}
      <div className="absolute inset-0 z-0">
        <EarthMap />
      </div>

      {/* Floating Top Bar (Controls & Title) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        
        <div className="fluxx-glass-dark rounded-xl shadow-2xl px-4 py-3 flex items-center space-x-3 pointer-events-auto animate-float">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-black text-[13px] tracking-tight text-white shadow-black drop-shadow-sm">ENVIRONMENTAL TWIN</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Kharghar Sector 12</div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="fluxx-glass-dark rounded-xl shadow-2xl p-2 flex flex-col space-y-2 pointer-events-auto">
          <button className="w-8 h-8 rounded flex items-center justify-center bg-[#0EA5E9] text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] cursor-pointer hover:bg-[#0284C7] transition-all">
            <MapPin className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded flex items-center justify-center bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md">
            <Activity className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded flex items-center justify-center bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all cursor-pointer font-black text-[10px] backdrop-blur-md">
            3D
          </button>
        </div>
      </div>

      {/* Bottom Floating Sensor Strip */}
      <div className="absolute bottom-20 left-4 right-4 z-10 flex space-x-3 pointer-events-auto overflow-x-auto pb-2 scrollbar-hide">
        {[
          { label: 'PM2.5', value: sensors.pm25.toFixed(1), unit: 'µg/m³', trend: '↑ 2.1', color: 'text-red-500', bar: 'bg-red-500', w: '60%' },
          { label: 'PM10', value: sensors.pm10.toFixed(1), unit: 'µg/m³', trend: '↑ 1.4', color: 'text-amber-500', bar: 'bg-amber-500', w: '45%' },
          { label: 'CO₂', value: sensors.co2.toFixed(0), unit: 'ppm', trend: '↓ 4.2', color: 'text-emerald-500', bar: 'bg-emerald-500', w: '20%' },
          { label: 'Temp', value: sensors.temperature.toFixed(1), unit: '°C', trend: '↑ 0.1', color: 'text-slate-600', bar: 'bg-slate-400', w: '70%' },
          { label: 'Humidity', value: sensors.humidity.toFixed(1), unit: '%', trend: '— 0.0', color: 'text-slate-600', bar: 'bg-slate-400', w: '80%' },
          { label: 'Wind', value: sensors.windSpeed.toFixed(1), unit: 'm/s', trend: '↗ SW', color: 'text-[#0EA5E9]', bar: 'bg-[#0EA5E9]', w: '30%' },
        ].map((sensor) => (
          <div key={sensor.label} className="flex-1 min-w-[130px] fluxx-glass-dark rounded-xl shadow-2xl p-3 transform transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{sensor.label}</span>
              <span className={`text-[9px] font-bold ${sensor.color} drop-shadow-md`}>{sensor.trend}</span>
            </div>
            <div className="flex items-baseline space-x-1 mb-2">
              <span className="text-lg font-black text-white shadow-black drop-shadow-sm">{sensor.value}</span>
              <span className="text-[9px] font-medium text-slate-400">{sensor.unit}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div className={`h-full ${sensor.bar} rounded-full shadow-[0_0_8px_currentColor]`} style={{ width: sensor.w }} />
            </div>
          </div>
        ))}
      </div>

      {/* Replay Timeline Footer */}
      <div className="absolute bottom-4 left-4 right-4 z-10 fluxx-glass-dark rounded-xl shadow-2xl px-4 py-2.5 flex items-center space-x-6 pointer-events-auto">
        <div className="flex items-center space-x-3">
          <button className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center cursor-pointer hover:bg-[#0284C7] shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all">
            <Play className="w-3.5 h-3.5 ml-0.5" />
          </button>
          <button className="text-slate-300 hover:text-white cursor-pointer transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1 text-xs font-bold text-slate-300 cursor-pointer border border-white/20 bg-white/5 rounded px-1.5 py-0.5">
            <span>1x</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        <div className="flex-1 relative flex items-center py-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full relative cursor-pointer border border-white/5">
            <div className="absolute left-0 top-0 h-full bg-[#0EA5E9] rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]" style={{ width: '45%' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-[3px] border-[#0EA5E9] rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)]" style={{ left: '45%' }} />
          </div>
          <div className="absolute -top-3 left-[45%] -translate-x-1/2 text-[10px] font-bold text-white bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded shadow-xl">
            14:32:00
          </div>
        </div>

        <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
          <div className="text-right">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ERI SCORE</div>
            <div className="text-sm font-black text-white shadow-black drop-shadow-sm">{eri.score} <span className="text-[10px] text-amber-500 drop-shadow-md">{eri.level}</span></div>
          </div>
        </div>
      </div>

    </div>
  );
};
