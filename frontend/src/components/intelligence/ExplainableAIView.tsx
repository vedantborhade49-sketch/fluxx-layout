import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Sliders, 
  Activity, 
  TrendingUp, 
  Users, 
  Clock, 
  Layers, 
  ArrowUpRight,
  Compass,
  AlertCircle,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { api } from '../../services/api';
import { ExplainableEvent, AIMissionRecommendation } from '../../types';

interface ExplainableAIViewProps {
  onDispatchMission?: (rec: AIMissionRecommendation) => void;
}

export const ExplainableAIView: React.FC<ExplainableAIViewProps> = ({ onDispatchMission }) => {
  const [eventData, setEventData] = useState<ExplainableEvent | null>(null);
  const [recommendations, setRecommendations] = useState<AIMissionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadIntelligenceData();
  }, []);

  const loadIntelligenceData = async () => {
    try {
      setIsLoading(true);
      const [ev, recs] = await Promise.all([
        api.getExplainableEvent('VTOL-001'),
        api.getMissionRecommendations()
      ]);
      setEventData(ev);
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to load intelligence data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = (actId: string) => {
    setExecutedActions(prev => ({ ...prev, [actId]: true }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                  ENVIRONMENTAL INTELLIGENCE & EXPLAINABLE AI
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                    EVENT ID: {eventData?.event_id || 'ENV-204'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Root-Cause Incident Attribution • Confidence Bounds • Multi-Horizon Plume Trajectory • Proactive Mission Recommender
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">AI Model Confidence</span>
              <span className="text-base font-mono font-bold text-emerald-400">
                {eventData?.confidence_score || 94.2}% (VERY HIGH)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Explainable Incident Attribution Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Incident Overview Banner */}
          <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl bg-rose-500/20 text-rose-300 border-l border-b border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ACTIVE INCIDENT ATTRIBUTION
            </div>

            <div className="mt-2 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Primary Identified Cause</span>
                <h2 className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                  {eventData?.primary_cause || 'Industrial Catalytic Cracker Hydrocarbon Stack Emission'}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                  <span className="text-slate-400">Origin: <strong className="text-indigo-300">{eventData?.source_origin}</strong></span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Predicted Event Duration: <strong className="text-amber-300">{eventData?.predicted_duration}</strong></span>
                </div>
              </div>

              {/* Macro Impact Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Affected Population</span>
                  <span className="text-lg font-black font-mono text-rose-400">
                    {eventData?.affected_population.toLocaleString() || '18,200'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Residential footprint</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Vulnerable Demographics</span>
                  <span className="text-lg font-black font-mono text-amber-400">
                    {eventData?.vulnerable_demographics_count.toLocaleString() || '3,450'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Children & elderly</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Plume Spread Radius</span>
                  <span className="text-lg font-black font-mono text-cyan-300">
                    {eventData?.dispersion_trajectory.affected_radius_km || 3.8} km
                  </span>
                  <span className="text-[10px] text-slate-500 block">Heading 210° SW</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Residential ETA</span>
                  <span className="text-lg font-black font-mono text-indigo-300">
                    {eventData?.dispersion_trajectory.eta_residential_ward || '38 min'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">At 16.2 km/h drift</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explainable AI (XAI) Contributing Sensors Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Explainable AI Feature Importance & Sensor Weights
              </h3>
              <span className="text-[10px] font-mono text-indigo-300">
                Architecture: {eventData?.explainable_ai_breakdown.model_architecture}
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {eventData?.explainable_ai_breakdown.feature_importances.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      {feat.sensor}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400">Observed: <strong className="text-white">{feat.value}</strong></span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {feat.status}
                      </span>
                      <span className="font-mono font-bold text-indigo-300">
                        {feat.importance_pct}% weight
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${feat.importance_pct * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Model Assumptions & Uncertainty */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                Model Assumptions & Confidence Bounds
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-400">
                {eventData?.explainable_ai_breakdown.model_assumptions.map((assump, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Tactical Mitigations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Prescribed Tactical Mitigations & Automated Dispatch
            </h3>
            <div className="space-y-2.5">
              {eventData?.suggested_actions.map((act) => (
                <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      act.priority === 'IMMEDIATE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {act.priority}
                    </span>
                    <span className="font-medium text-slate-200">{act.action}</span>
                  </div>

                  {act.automated_executable && (
                    <button
                      onClick={() => handleExecuteAction(act.id)}
                      disabled={executedActions[act.id]}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        executedActions[act.id] 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {executedActions[act.id] ? (
                        <>
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Triggered & Dispatched
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Execute Action
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Composite ERI & Proactive AI Mission Recommendations */}
        <div className="space-y-6">
          {/* Composite Environmental Risk Index (ERI) Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Composite Environmental Risk Index (ERI)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                {eventData?.eri_composite?.category || eventData?.eri_composite?.risk_tier || 'CRITICAL_RISK'}
              </span>
            </div>

            <div className="flex items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 relative">
              <div className="text-center">
                <div className="text-5xl font-black font-mono text-rose-400 tracking-tight">
                  {eventData?.eri_composite?.eri_score || eventData?.eri_composite?.composite_score || 84.0}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">
                  Out of 100 Risk Scale
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
              <strong className="text-rose-300">Advisory: </strong>
              {eventData?.eri_composite?.advisory || 'Public health advisory active in downwind wards'}
            </div>

            {/* ERI Component Contributions */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Multi-Pollutant Composite Weights
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">AQI (30%):</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    {eventData?.eri_composite?.component_breakdown?.aqi_contribution || 42.0}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">PM2.5 (25%):</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    {eventData?.eri_composite?.component_breakdown?.pm25_contribution || 26.5}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">VOC (15%):</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    {eventData?.eri_composite?.component_breakdown?.voc_contribution || 18.2}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Ozone (10%):</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    {eventData?.eri_composite?.component_breakdown?.ozone_contribution || 8.4}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Mission Recommendation Engine */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                AI Autonomous Mission Recommender
              </h3>
              <span className="text-[10px] text-slate-400">
                {recommendations.length} Suggestions
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rec.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {rec.priority}
                        </span>
                        <span className="text-xs font-bold text-white">{rec.target_area_name}</span>
                      </div>
                      <span className="text-[10px] text-cyan-300 font-mono block mt-0.5">
                        {rec.recommended_survey_type} • Assign: {rec.suggested_drone_id}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {rec.confidence_score}% Conf.
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {rec.ai_reasoning}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <span>Est: {rec.estimated_distance_km} km ({rec.estimated_duration_min} min)</span>
                    <span>Battery Drain: ~{rec.expected_resource_drain_battery_pct}%</span>
                  </div>

                  <button
                    onClick={() => onDispatchMission && onDispatchMission(rec)}
                    className="w-full mt-2 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Accept Recommendation & Dispatch {rec.suggested_drone_id}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
