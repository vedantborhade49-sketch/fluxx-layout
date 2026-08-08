import React from 'react';

interface StatusBadgeProps {
  status: 'LIVE' | 'REPLAY' | 'SIMULATION' | 'OFFLINE' | 'WARNING' | 'CRITICAL';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'LIVE': return { color: 'bg-fluxx-red', text: 'text-fluxx-red', label: 'LIVE' };
      case 'REPLAY': return { color: 'bg-fluxx-teal', text: 'text-fluxx-teal', label: 'DATA REPLAY' };
      case 'WARNING': return { color: 'bg-fluxx-amber', text: 'text-fluxx-amber', label: 'WARNING' };
      case 'CRITICAL': return { color: 'bg-fluxx-red', text: 'text-fluxx-red', label: 'CRITICAL' };
      default: return { color: 'bg-fluxx-muted', text: 'text-fluxx-muted', label: status };
    }
  };

  const conf = getConfig();

  return (
    <div className="flex items-center space-x-2">
      <span className={`w-2 h-2 rounded-full ${conf.color} ${status === 'LIVE' || status === 'CRITICAL' ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${conf.text}`}>
        {conf.label}
      </span>
    </div>
  );
};
