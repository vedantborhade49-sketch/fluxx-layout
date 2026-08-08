import React from 'react';
import { 
  Wind, 
  Flame, 
  Droplets, 
  Activity, 
  Volume2, 
  Thermometer, 
  CloudRain, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { SensorReading } from '../../types';

interface SensorGaugesProps {
  reading: SensorReading | null;
  selectedMetric?: string;
  onSelectMetric?: (metric: string) => void;
}

export const SensorGauges: React.FC<SensorGaugesProps> = ({
  reading,
  selectedMetric = 'aqi',
  onSelectMetric
}) => {
  if (!reading) return null;

  // EPA AQI Category Helper
  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return { label: 'GOOD', color: '#00FF9D', bg: 'rgba(0, 255, 157, 0.12)' };
    if (aqi <= 100) return { label: 'MODERATE', color: '#FFB800', bg: 'rgba(255, 184, 0, 0.12)' };
    if (aqi <= 150) return { label: 'UNHEALTHY (SENSITIVE)', color: '#FF7700', bg: 'rgba(255, 119, 0, 0.12)' };
    if (aqi <= 200) return { label: 'UNHEALTHY', color: '#FF3366', bg: 'rgba(255, 51, 102, 0.12)' };
    if (aqi <= 300) return { label: 'VERY UNHEALTHY', color: '#B600A8', bg: 'rgba(182, 0, 168, 0.12)' };
    return { label: 'HAZARDOUS', color: '#7E0023', bg: 'rgba(126, 0, 35, 0.2)' };
  };

  const aqiInfo = getAQICategory(reading.aqi);

  const metrics = [
    {
      id: 'aqi',
      name: 'Air Quality Index',
      value: reading.aqi.toFixed(0),
      unit: 'AQI',
      icon: Activity,
      category: aqiInfo.label,
      color: aqiInfo.color,
      limit: '100 EPA Limit',
      trend: reading.aqi > 75 ? 'up' : 'down'
    },
    {
      id: 'pm25',
      name: 'PM2.5 Fine Dust',
      value: reading.pm25.toFixed(1),
      unit: 'µg/m³',
      icon: Wind,
      category: reading.pm25 > 35 ? 'ELEVATED' : 'NOMINAL',
      color: reading.pm25 > 35 ? '#FF3366' : '#00FF9D',
      limit: '35.0 µg/m³ std',
      trend: reading.pm25 > 25 ? 'up' : 'steady'
    },
    {
      id: 'pm10',
      name: 'PM10 Particulate',
      value: reading.pm10.toFixed(1),
      unit: 'µg/m³',
      icon: Wind,
      category: reading.pm10 > 100 ? 'ELEVATED' : 'NOMINAL',
      color: reading.pm10 > 100 ? '#FFB800' : '#00FF9D',
      limit: '150 µg/m³ std',
      trend: 'steady'
    },
    {
      id: 'co2',
      name: 'Carbon Dioxide (CO₂)',
      value: reading.co2.toFixed(0),
      unit: 'ppm',
      icon: Flame,
      category: reading.co2 > 800 ? 'HIGH' : 'SAFE',
      color: reading.co2 > 800 ? '#FFB800' : '#00F0FF',
      limit: '1000 ppm max',
      trend: reading.co2 > 600 ? 'up' : 'steady'
    },
    {
      id: 'voc',
      name: 'Volatile Organics (VOC)',
      value: reading.voc.toFixed(0),
      unit: 'ppb',
      icon: AlertTriangle,
      category: reading.voc > 350 ? 'TOXIC RISK' : 'NORMAL',
      color: reading.voc > 350 ? '#FF3366' : '#00FF9D',
      limit: '300 ppb baseline',
      trend: reading.voc > 250 ? 'up' : 'down'
    },
    {
      id: 'methane',
      name: 'Methane (CH₄)',
      value: reading.methane.toFixed(2),
      unit: 'ppm',
      icon: Flame,
      category: reading.methane > 5.0 ? 'LEAK ALERT' : 'AMBIENT',
      color: reading.methane > 5.0 ? '#FF0055' : '#00F0FF',
      limit: '2.0 ppm baseline',
      trend: reading.methane > 3.0 ? 'up' : 'steady'
    },
    {
      id: 'ozone',
      name: 'Ground Ozone (O₃)',
      value: reading.ozone.toFixed(1),
      unit: 'ppb',
      icon: Activity,
      category: reading.ozone > 70 ? 'ELEVATED' : 'GOOD',
      color: reading.ozone > 70 ? '#FFB800' : '#00FF9D',
      limit: '70 ppb 8h max',
      trend: 'steady'
    },
    {
      id: 'temperature',
      name: 'Ambient Temperature',
      value: reading.temperature.toFixed(1),
      unit: '°C',
      icon: Thermometer,
      category: 'NOMINAL',
      color: '#FFB800',
      limit: 'Operating -20..+50°C',
      trend: 'steady'
    },
    {
      id: 'humidity',
      name: 'Relative Humidity',
      value: reading.humidity.toFixed(1),
      unit: '% RH',
      icon: Droplets,
      category: 'OPTIMAL',
      color: '#00F0FF',
      limit: 'Dew Pt: 12.8°C',
      trend: 'down'
    },
    {
      id: 'noise_level',
      name: 'Acoustic Noise',
      value: reading.noise_level.toFixed(1),
      unit: 'dB(A)',
      icon: Volume2,
      category: reading.noise_level > 80 ? 'LOUD' : 'QUIET',
      color: reading.noise_level > 80 ? '#FFB800' : '#00FF9D',
      limit: '85 dB OSHA std',
      trend: 'steady'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#00F0FF]" />
          <span>Multi-Gas & Environmental Sensor Array (10 Channels)</span>
        </h3>
        <span className="text-[10px] text-[#00FF9D] font-mono-telemetry bg-[#00FF9D]/10 px-2 py-0.5 rounded border border-[#00FF9D]/20">
          CALIBRATION: ACTIVE (±1.2%)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMetric === m.id;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMetric && onSelectMetric(m.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#161B2E] border-[#00F0FF] shadow-lg shadow-[#00F0FF]/15'
                  : 'bg-[#0D101A] border-white/5 hover:border-white/20 hover:bg-[#121624]'
              }`}
            >
              {/* Top Row: Icon, Name, Trend */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-400 truncate max-w-[100px]">{m.name}</span>
                <div className="flex items-center space-x-1">
                  {m.trend === 'up' && <TrendingUp className="w-3 h-3 text-[#FF3366]" />}
                  {m.trend === 'down' && <TrendingDown className="w-3 h-3 text-[#00FF9D]" />}
                  {m.trend === 'steady' && <Minus className="w-3 h-3 text-gray-400" />}
                </div>
              </div>

              {/* Middle Row: Large Value + Unit */}
              <div className="flex items-baseline space-x-1 my-1">
                <span className="text-2xl font-bold font-mono-telemetry tracking-tight" style={{ color: m.color }}>
                  {m.value}
                </span>
                <span className="text-[11px] text-gray-400 font-mono-telemetry">{m.unit}</span>
              </div>

              {/* Bottom Row: Category Pill + Limit */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                <span 
                  className="px-1.5 py-0.5 rounded font-mono-telemetry font-bold tracking-wider" 
                  style={{ color: m.color, backgroundColor: `${m.color}15` }}
                >
                  {m.category}
                </span>
                <span className="text-gray-500 font-mono-telemetry truncate max-w-[75px]">{m.limit}</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
