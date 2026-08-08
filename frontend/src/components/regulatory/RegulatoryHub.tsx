import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Trees, 
  Landmark, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Send, 
  TrendingUp, 
  Flame,
  Volume2,
  Users,
  Radio,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { RegulatoryDashboardData } from '../../types';

export const RegulatoryHub: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'PCB' | 'FOREST' | 'MUNICIPAL' | 'DISASTER'>('PCB');
  const [dashboardData, setDashboardData] = useState<RegulatoryDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadAgencyDashboard(selectedRole);
  }, [selectedRole]);

  const loadAgencyDashboard = async (role: string) => {
    try {
      setIsLoading(true);
      const data = await api.getRegulatoryDashboard(role);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load regulatory dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerAction = (tool: string) => {
    setActionNotice(`Triggered statutory workflow: "${tool}". Transmission logged to regulatory audit trail.`);
    setTimeout(() => setActionNotice(null), 4500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Agency Switcher Ribbon */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-xl">
        <button
          onClick={() => setSelectedRole('PCB')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedRole === 'PCB'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Building className="w-4 h-4" />
          Pollution Control Board (PCB)
        </button>

        <button
          onClick={() => setSelectedRole('FOREST')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedRole === 'FOREST'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Trees className="w-4 h-4" />
          Forest & Wildlife Department
        </button>

        <button
          onClick={() => setSelectedRole('MUNICIPAL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedRole === 'MUNICIPAL'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Municipal Smart City Corp
        </button>

        <button
          onClick={() => setSelectedRole('DISASTER')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            selectedRole === 'DISASTER'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          Disaster Management Cell
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Agency Dashboard Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Statutory Agency View
            </span>
            <h1 className="text-xl font-extrabold text-white mt-0.5">
              {dashboardData?.agency_title || 'Regulatory Compliance Overview'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Statutory threshold audits, show-cause generation, and automated enforcement coordination.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live CAAQM / EPA Feed Synced
            </span>
          </div>
        </div>

        {/* Agency Key Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {dashboardData?.kpis.map((kpi, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                {kpi.label}
              </span>
              <span className={`text-lg font-black font-mono block ${
                kpi.alert ? 'text-rose-400' : 'text-white'
              }`}>
                {kpi.value}
              </span>
              <span className="text-[10px] font-bold text-slate-500 block mt-1">
                Status: {kpi.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Violations & Agency Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Enforcement Incidents */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Active Regulatory Notices & Violations
            </h3>
            <span className="text-[10px] text-slate-400">
              Auto-Compiled from Continuous Drone Sweeps
            </span>
          </div>

          <div className="space-y-3">
            {dashboardData?.active_violations.map((viol, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    {viol.source || viol.corridor || viol.ward || 'Statutory Source'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                    NON-COMPLIANT
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  {Object.entries(viol).map(([k, v]) => (
                    k !== 'source' && k !== 'corridor' && k !== 'ward' ? (
                      <div key={k} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <span className="text-slate-500 capitalize block text-[10px]">{k.replace('_', ' ')}:</span>
                        <strong className="text-indigo-300 font-mono">{String(v)}</strong>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Statutory Action Tools */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Statutory Action Desk
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Execute certified government orders backed by cryptographically stamped VTOL drone sensor logs.
          </p>

          <div className="space-y-2.5 mt-3">
            {dashboardData?.actionable_tools.map((tool, idx) => (
              <button
                key={idx}
                onClick={() => handleTriggerAction(tool)}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-left text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between transition-all group"
              >
                <span>{tool}</span>
                <Send className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
