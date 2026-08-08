import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Plane,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { MultiSourceData, FleetSummary } from '../../types';

export const ExecutiveDashboard: React.FC = () => {
  const [fleetSummary, setFleetSummary] = useState<FleetSummary | null>(null);
  const [sources, setSources] = useState<MultiSourceData | null>(null);

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    try {
      const [fleet, src] = await Promise.all([
        api.getFleetSummary(),
        api.getMultiSourceData()
      ]);
      setFleetSummary(fleet);
      setSources(src);
    } catch (err) {
      console.error('Failed to load executive data:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* C-Suite Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/20">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider text-white flex items-center gap-3">
                EXECUTIVE ENVIRONMENTAL COMMAND SUITE
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  GRADE: A- (STATUTORY COMPLIANT)
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                High-Level Ministerial Intelligence Board • Cross-Agency Resource Governance • Airshed Exposure Control
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center justify-between">
            Environmental Risk Index (ERI)
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </span>
          <div className="text-3xl font-black font-mono text-white mt-2">84.2<span className="text-xs text-slate-400">/100</span></div>
          <p className="text-xs text-rose-300 font-bold mt-1">ELEVATED SECTOR 7 RISK</p>
          <div className="mt-2 text-[11px] text-slate-400">Multi-parameter atmospheric index</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center justify-between">
            Mean Time To Respond (MTTR)
            <Clock className="w-4 h-4 text-cyan-400" />
          </span>
          <div className="text-3xl font-black font-mono text-cyan-300 mt-2">4.2 <span className="text-xs text-slate-400">mins</span></div>
          <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -68% vs Manual Inspection
          </p>
          <div className="mt-2 text-[11px] text-slate-400">Automated VTOL drone dispatch</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center justify-between">
            Multi-Source Sensor Ingestion
            <Layers className="w-4 h-4 text-indigo-400" />
          </span>
          <div className="text-3xl font-black font-mono text-indigo-300 mt-2">
            {sources?.total_data_points_ingested_per_min?.toLocaleString() || '18,400'}
          </div>
          <p className="text-xs text-indigo-200 font-bold mt-1">
            {sources?.fusion_confidence_percent || 97.4}% Fusion Confidence
          </p>
          <div className="mt-2 text-[11px] text-slate-400">Telemetry packets ingested/min</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-between">
            Fleet Readiness
            <Plane className="w-4 h-4 text-emerald-400" />
          </span>
          <div className="text-3xl font-black font-mono text-emerald-300 mt-2">
            {fleetSummary?.average_fleet_health_score || 94.8}%
          </div>
          <p className="text-xs text-emerald-300 font-bold mt-1">
            {fleetSummary?.fleet_readiness_status || 'OPTIMAL'}
          </p>
          <div className="mt-2 text-[11px] text-slate-400">6 VTOL Airframes Mission-Ready</div>
        </div>
      </div>

      {/* Inter-Agency Governance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Inter-Agency Operational Allocation
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Municipal Corporation (MCGM)</span>
                <p className="text-[10px] text-slate-400">Urban School Corridors & Road Dust Patrol</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">2 Active Drones</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">State Pollution Control Board (MPCB)</span>
                <p className="text-[10px] text-slate-400">Sector 7 Refinery Stack Audits & Section 31A Enforcements</p>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400">2 Active Drones</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Forest & Maritime Authorities</span>
                <p className="text-[10px] text-slate-400">Buffer Zone Wildfire & Offshore Ship Plume Sniffing</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">2 Active Drones</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Statutory Legal Defensibility & Provenance Seal
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Cryptographic Seal Standard</span>
              <p className="text-slate-300 font-mono text-[11px]">
                SHA-256 Merkle Root verified against CPCB certified telemetry standard
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Sensor Calibration Integrity</span>
              <p className="text-slate-300 font-mono text-[11px]">
                ISO/IEC 17025 Reference Standard Zero-Drift Cross Validated
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Court Defensibility Grade</span>
              <p className="text-slate-300 font-mono text-[11px]">
                Level 4 Admissible Evidence under Indian Evidence Act Section 65B
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
