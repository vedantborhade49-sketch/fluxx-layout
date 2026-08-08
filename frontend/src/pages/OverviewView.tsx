import React from 'react';
import { useEnvironmentStore } from '../stores/environmentStore';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Metric } from '../components/ui/Metric';

export const OverviewView: React.FC = () => {
  const { currentReading, eri } = useEnvironmentStore();
  const sensors = currentReading?.sensors;

  return (
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-white/50 relative">
      
      {/* Decorative large blurred circle behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fluxx-teal opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <GlassPanel className="w-full max-w-5xl p-12 shadow-xl border border-slate-200 bg-white/60">
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <div className="text-xs font-bold text-fluxx-muted uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full">
            System Overview
          </div>
          <h2 className="text-5xl font-black text-fluxx-text tracking-tight">
            Kharghar Node is <span className="text-fluxx-teal">Nominal</span>
          </h2>
          <p className="text-lg font-medium text-fluxx-muted max-w-2xl">
            Environmental risk remains low. All sensor arrays and active VTOL fleets are operating within expected parameters.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1 border-r border-slate-200 flex flex-col justify-center">
            <div className="text-xs font-bold text-fluxx-muted uppercase tracking-widest mb-2">ERI Score</div>
            <div className="flex items-baseline space-x-3">
              <span className="text-6xl font-black text-fluxx-text">{eri.score}</span>
              <span className="text-sm font-bold text-fluxx-muted">/ 100</span>
            </div>
            <div className="text-xs font-bold text-fluxx-teal uppercase tracking-widest mt-2">{eri.level}</div>
          </div>

          <div className="col-span-3 grid grid-cols-3 gap-y-10 gap-x-8 pl-8">
            <Metric label="PM2.5" value={sensors?.pm25.toFixed(1) || '--'} unit="µg/m³" trend="8.2%" trendDirection="up" />
            <Metric label="PM10" value={sensors?.pm10.toFixed(1) || '--'} unit="µg/m³" trend="4.1%" trendDirection="up" />
            <Metric label="CO₂" value={sensors?.co2.toFixed(0) || '--'} unit="ppm" trend="1.2%" trendDirection="down" />
            <Metric label="Temperature" value={sensors?.temperature.toFixed(1) || '--'} unit="°C" trend="0.4°C" trendDirection="up" />
            <Metric label="Humidity" value={sensors?.humidity.toFixed(0) || '--'} unit="%" />
            <Metric label="Wind" value={sensors?.windSpeed.toFixed(1) || '--'} unit="m/s" trend="SW" />
          </div>
        </div>
      </GlassPanel>

    </div>
  );
};
