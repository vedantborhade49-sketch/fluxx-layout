import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { AlertTriangle, MapPin, Printer, Download } from 'lucide-react';

export const ReportPreview: React.FC = () => {
  const { currentReading, eri } = useEnvironmentStore();
  const s = currentReading?.sensors;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-12 shrink-0 border border-slate-200 text-slate-800 mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">FLUXX</h1>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Environmental Intelligence Report</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-800 uppercase tracking-widest">INCIDENT REPORT</div>
          <div className="text-xs text-slate-500 mt-1">Generated: {new Date().toLocaleDateString()}</div>
          <div className="text-xs text-slate-500">ID: REP-{Date.now().toString().slice(-6)}</div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-10">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Executive Summary</h2>
        <p className="text-sm text-slate-700 leading-relaxed font-serif">
          On {new Date().toLocaleDateString()}, the FLUXX Environmental monitoring system detected a significant surge in PM2.5 particulate matter in the Kharghar Sector 12 region. The Environmental Risk Index (ERI) reached a score of <span className="font-bold text-red-600">{eri.score} ({eri.level})</span>.
        </p>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Pollutant</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{s?.pm25.toFixed(1) || '--'}</span>
            <span className="text-xs font-bold text-slate-500">µg/m³ PM2.5</span>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ERI Score</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{eri.score}</span>
            <span className="text-xs font-bold text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Map Snapshot Simulation */}
      <div className="mb-10">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Spatial Distribution Snapshot</h2>
        <div className="w-full h-64 bg-slate-200 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.05,73.07&zoom=14&size=800x400&maptype=roadmap')] bg-cover opacity-90 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent" />
          
          {/* Fake Marker */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-6 h-6 bg-red-500/20 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white relative shadow-md" />
          </div>
        </div>
        <div className="text-[9px] text-center text-slate-500 mt-2 font-mono">Figure 1.0: Interpolated PM2.5 dispersion model</div>
      </div>

    </div>
  );
};
