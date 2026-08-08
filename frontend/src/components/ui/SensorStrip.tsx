import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Metric } from './Metric';
import { NormalizedReading } from '../../types/environment';

interface SensorStripProps {
  reading: NormalizedReading | null;
}

export const SensorStrip: React.FC<SensorStripProps> = ({ reading }) => {
  if (!reading || !reading.sensors) return null;
  const s = reading.sensors;

  return (
    <GlassPanel className="px-8 py-6 w-full shadow-lg">
      <div className="flex justify-between items-center w-full">
        <Metric label="PM2.5" value={s.pm25.toFixed(1)} unit="µg/m³" trend="8.2%" trendDirection="up" />
        <div className="w-px h-12 bg-slate-200" />
        <Metric label="PM10" value={s.pm10.toFixed(1)} unit="µg/m³" trend="4.1%" trendDirection="up" />
        <div className="w-px h-12 bg-slate-200" />
        <Metric label="CO₂" value={s.co2.toFixed(0)} unit="ppm" trend="1.2%" trendDirection="down" />
        <div className="w-px h-12 bg-slate-200" />
        <Metric label="TEMP" value={s.temperature.toFixed(1)} unit="°C" trend="0.4°C" trendDirection="up" />
        <div className="w-px h-12 bg-slate-200" />
        <Metric label="HUMIDITY" value={s.humidity.toFixed(0)} unit="%" />
        <div className="w-px h-12 bg-slate-200" />
        <Metric label="WIND" value={s.windSpeed.toFixed(1)} unit="m/s" trend="SW" />
      </div>
    </GlassPanel>
  );
};
