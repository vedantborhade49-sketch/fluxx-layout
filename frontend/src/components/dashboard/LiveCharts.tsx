import React, { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { SensorReading } from '../../types';

interface LiveChartsProps {
  history: SensorReading[];
  selectedMetric: string;
  onSelectMetric: (metric: string) => void;
  timeRange: string;
  onSelectTimeRange: (range: string) => void;
}

export const LiveCharts: React.FC<LiveChartsProps> = ({
  history,
  selectedMetric,
  onSelectMetric,
  timeRange,
  onSelectTimeRange
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const metricConfig: Record<string, { label: string; unit: string; color: string; threshold?: number }> = {
    aqi: { label: 'Air Quality Index', unit: 'AQI', color: '#00F0FF', threshold: 100 },
    pm25: { label: 'PM2.5 Fine Dust', unit: 'µg/m³', color: '#FF3366', threshold: 35 },
    pm10: { label: 'PM10 Particulate', unit: 'µg/m³', color: '#FFB800', threshold: 150 },
    co2: { label: 'Carbon Dioxide', unit: 'ppm', color: '#00FF9D', threshold: 800 },
    voc: { label: 'Volatile Organics (VOC)', unit: 'ppb', color: '#B600A8', threshold: 350 },
    methane: { label: 'Methane (CH₄)', unit: 'ppm', color: '#FF0055', threshold: 4 },
    temperature: { label: 'Temperature', unit: '°C', color: '#FFB800' },
    humidity: { label: 'Relative Humidity', unit: '% RH', color: '#00F0FF' },
    altitude: { label: 'Flight Altitude', unit: 'm', color: '#38BDF8' },
    battery: { label: 'Battery Level', unit: '%', color: '#00FF9D', threshold: 20 }
  };

  const currentConfig = metricConfig[selectedMetric] || metricConfig.aqi;

  // Extract data values
  const dataPoints = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.map((h, i) => {
      const val = (h as any)[selectedMetric] ?? 0;
      return {
        timestamp: h.timestamp ? new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : `T-${i}`,
        value: typeof val === 'number' ? val : parseFloat(val) || 0
      };
    }).reverse();
  }, [history, selectedMetric]);

  // Summary Metrics
  const stats = useMemo(() => {
    if (dataPoints.length === 0) return { min: '0', max: '0', avg: '0', current: '0' };
    const values = dataPoints.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const current = values[values.length - 1];
    return {
      min: min.toFixed(1),
      max: max.toFixed(1),
      avg: avg.toFixed(1),
      current: current.toFixed(1)
    };
  }, [dataPoints]);

  // SVG dimensions
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales safely with numeric parsing
  const parsedMin = parseFloat(stats.min) || 0;
  const parsedMax = parseFloat(stats.max) || 100;
  const minVal = Math.min(0, parsedMin * 0.9);
  const maxVal = Math.max(parsedMax * 1.15, (currentConfig.threshold || 50) * 1.1, 10);

  const pointsString = useMemo(() => {
    if (dataPoints.length < 2) return '';
    return dataPoints
      .map((d, i) => {
        const x = padding.left + (i / (dataPoints.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
        return `${x},${y}`;
      })
      .join(' ');
  }, [dataPoints, minVal, maxVal, chartWidth, chartHeight]);

  const areaString = useMemo(() => {
    if (!pointsString || dataPoints.length < 2) return '';
    const firstX = padding.left;
    const lastX = padding.left + chartWidth;
    const baseY = padding.top + chartHeight;
    return `${firstX},${baseY} ${pointsString} ${lastX},${baseY}`;
  }, [pointsString, chartWidth, chartHeight, dataPoints]);

  const thresholdY = currentConfig.threshold
    ? padding.top + chartHeight - ((currentConfig.threshold - minVal) / (maxVal - minVal)) * chartHeight
    : null;

  return (
    <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl">
      
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-3 border-b border-white/5">
        
        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(metricConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => onSelectMetric(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                selectedMetric === key
                  ? 'bg-white/15 text-white border border-white/30 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cfg.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-1 bg-[#141824] p-1 rounded-lg border border-white/5 text-xs">
          <Clock className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
          {['1m', '5m', '15m', '1h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => onSelectTimeRange(range)}
              className={`px-2 py-0.5 rounded font-mono-telemetry text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

      </div>

      {/* Metric Summary Stats Row */}
      <div className="grid grid-cols-4 gap-2 mb-3 bg-[#121624]/60 p-2.5 rounded-xl border border-white/5 text-center">
        <div>
          <span className="text-[10px] text-gray-400 uppercase">Live Current</span>
          <div className="text-base font-bold font-mono-telemetry" style={{ color: currentConfig.color }}>
            {stats.current} {currentConfig.unit}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase">Average</span>
          <div className="text-base font-bold font-mono-telemetry text-white">
            {stats.avg} {currentConfig.unit}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase">Peak Max</span>
          <div className="text-base font-bold font-mono-telemetry text-[#FF3366]">
            {stats.max} {currentConfig.unit}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase">Min Recorded</span>
          <div className="text-base font-bold font-mono-telemetry text-[#00FF9D]">
            {stats.min} {currentConfig.unit}
          </div>
        </div>
      </div>

      {/* SVG Time-Series Chart */}
      <div className="relative w-full h-[240px] bg-[#0A0C14] rounded-xl border border-white/5 overflow-hidden">
        
        {dataPoints.length < 2 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono-telemetry">
            Awaiting streaming telemetry packets...
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((e.clientX - rect.left) / rect.width) * width;
              const idx = Math.round(((relX - padding.left) / chartWidth) * (dataPoints.length - 1));
              if (idx >= 0 && idx < dataPoints.length) {
                setHoverIndex(idx);
              }
            }}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = padding.top + chartHeight * pct;
              const val = (maxVal - pct * (maxVal - minVal)).toFixed(0);
              return (
                <g key={pct}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    fill="#666"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Threshold Line */}
            {thresholdY !== null && thresholdY >= padding.top && thresholdY <= padding.top + chartHeight && (
              <g>
                <line
                  x1={padding.left}
                  y1={thresholdY}
                  x2={width - padding.right}
                  y2={thresholdY}
                  stroke="#FF3366"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                />
                <text
                  x={width - padding.right}
                  y={thresholdY - 5}
                  fill="#FF3366"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="end"
                  fontWeight="bold"
                >
                  LIMIT {currentConfig.threshold}
                </text>
              </g>
            )}

            {/* Area Fill */}
            <polygon points={areaString} fill="url(#chartGradient)" />

            {/* Main Spline Line */}
            <polyline
              points={pointsString}
              fill="none"
              stroke={currentConfig.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Tooltip & Crosshair */}
            {hoverIndex !== null && dataPoints[hoverIndex] && (
              <g>
                {(() => {
                  const pt = dataPoints[hoverIndex];
                  const x = padding.left + (hoverIndex / (dataPoints.length - 1)) * chartWidth;
                  const y = padding.top + chartHeight - ((pt.value - minVal) / (maxVal - minVal)) * chartHeight;
                  return (
                    <>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={padding.top + chartHeight}
                        stroke="#00F0FF"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <circle cx={x} cy={y} r="5" fill="#00F0FF" stroke="#fff" strokeWidth="2" />
                      <g transform={`translate(${Math.min(x, width - 130)}, ${Math.max(y - 45, 10)})`}>
                        <rect width="115" height="36" rx="6" fill="#141824" stroke="rgba(0,240,255,0.4)" />
                        <text x="8" y="15" fill="#aaa" fontSize="9" fontFamily="JetBrains Mono">
                          {pt.timestamp}
                        </text>
                        <text x="8" y="29" fill="#00F0FF" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
                          {pt.value.toFixed(1)} {currentConfig.unit}
                        </text>
                      </g>
                    </>
                  );
                })()}
              </g>
            )}
          </svg>
        )}
      </div>

    </div>
  );
};
