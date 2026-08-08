import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  CheckCheck,
  Flame,
  Radio
} from 'lucide-react';
import { Alert, AlertSeverity } from '../../types';

interface AlertCenterProps {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ alerts, onResolveAlert }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'RESOLVED') return a.resolved;
    return a.severity === filterSeverity && !a.resolved;
  });

  const getSeverityStyle = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
      case 'EMERGENCY':
        return { color: '#FF3366', bg: 'rgba(255, 51, 102, 0.12)', border: 'rgba(255, 51, 102, 0.3)' };
      case 'WARNING':
        return { color: '#FFB800', bg: 'rgba(255, 184, 0, 0.12)', border: 'rgba(255, 184, 0, 0.3)' };
      default:
        return { color: '#00F0FF', bg: 'rgba(0, 240, 255, 0.12)', border: 'rgba(0, 240, 255, 0.3)' };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-[#FF3366]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Real-Time Incident & Regulatory Alert Center
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono-telemetry font-bold bg-[#FF3366]/20 text-[#FF3366]">
            {alerts.filter((a) => !a.resolved).length} UNRESOLVED
          </span>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center space-x-1 bg-[#141824] p-1 rounded-lg border border-white/5 text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterSeverity(f)}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                filterSeverity === f
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-2.5 max-h-[480px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="bg-[#0D101A] border border-white/5 rounded-xl p-8 text-center text-xs text-gray-500 font-mono-telemetry">
            No incidents found in this category. All environmental thresholds nominal.
          </div>
        ) : (
          filtered.map((alert) => {
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className="bg-[#0D101A] border rounded-xl p-4 transition-all flex flex-wrap items-start justify-between gap-3"
                style={{ borderColor: style.border }}
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: style.bg }}
                  >
                    <AlertTriangle className="w-4 h-4" style={{ color: style.color }} />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white tracking-wide">{alert.title}</span>
                      <span 
                        className="px-1.5 py-0.2 rounded text-[10px] font-mono-telemetry font-bold"
                        style={{ color: style.color, backgroundColor: style.bg }}
                      >
                        {alert.severity}
                      </span>
                      {alert.drone_id && (
                        <span className="text-[10px] text-gray-400 font-mono-telemetry">[{alert.drone_id}]</span>
                      )}
                    </div>

                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">{alert.description}</p>

                    <div className="flex items-center space-x-4 text-[10px] text-gray-500 font-mono-telemetry mt-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      {alert.location_name && <span>LOC: {alert.location_name}</span>}
                      {alert.threshold_value && (
                        <span className="text-[#FF3366]">
                          Threshold: {alert.threshold_value} (Recorded: {alert.metric_value?.toFixed(1)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resolve Action */}
                {!alert.resolved ? (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00FF9D]/20 text-gray-300 hover:text-[#00FF9D] border border-white/10 hover:border-[#00FF9D]/30 text-xs font-semibold transition-all flex items-center space-x-1.5"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Acknowledge & Resolve</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono-telemetry text-[#00FF9D] flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>RESOLVED</span>
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
