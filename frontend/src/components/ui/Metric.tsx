import React from 'react';

interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export const Metric: React.FC<MetricProps> = ({ label, value, unit, trend, trendDirection }) => {
  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-fluxx-red';
    if (trendDirection === 'down') return 'text-fluxx-teal';
    return 'text-fluxx-muted';
  };

  return (
    <div className="flex flex-col">
      <div className="text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-black text-fluxx-text">{value}</span>
        {unit && <span className="text-xs font-semibold text-fluxx-muted">{unit}</span>}
      </div>
      {trend && (
        <div className={`text-[10px] font-bold mt-0.5 ${getTrendColor()}`}>
          {trendDirection === 'up' && '↑ '}
          {trendDirection === 'down' && '↓ '}
          {trend}
        </div>
      )}
    </div>
  );
};
