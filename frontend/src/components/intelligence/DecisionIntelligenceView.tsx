import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Plane, 
  Building2, 
  Activity, 
  FileText, 
  RotateCcw,
  Sparkles,
  Zap,
  TrendingDown
} from 'lucide-react';
import { api } from '../../services/api';
import { DecisionPlan } from '../../types';

export const DecisionIntelligenceView: React.FC = () => {
  const [plan, setPlan] = useState<DecisionPlan | null>(null);
  const [executing, setExecuting] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const data = await api.getDecisionPlan();
      setPlan(data);
    } catch (err) {
      console.error('Failed to load decision plan:', err);
    }
  };

  const handleExecuteChain = async () => {
    if (!plan) return;
    setExecuting(true);
    
    // Simulate interactive chained visual execution
    for (let i = 0; i < plan.actions.length; i++) {
      setActiveStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
    
    try {
      const res = await api.executeDecisionChain(plan.id);
      setPlan(res.plan);
    } catch (err) {
      console.error('Failed to execute plan:', err);
    } finally {
      setExecuting(false);
      setActiveStepIndex(-1);
    }
  };

  const handleReset = async () => {
    if (!plan) return;
    try {
      const res = await api.resetDecisionPlan(plan.id);
      setPlan(res);
    } catch (err) {
      console.error('Failed to reset plan:', err);
    }
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 animate-pulse">
        Initializing Decision Intelligence Operational Coordinator...
      </div>
    );
  }

  const isExecuted = plan.status === 'EXECUTED_IN_FIELD';

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/20">
                <Bot className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-wider text-white flex items-center gap-3">
                  DECISION INTELLIGENCE OPERATIONAL COORDINATOR
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                    isExecuted 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {plan.status}
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Autonomous Multi-Agent Orchestration • Closed-Loop Fleet & Statutory Response • Impact Mitigation
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isExecuted ? (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Coordinator
              </button>
            ) : (
              <button
                onClick={handleExecuteChain}
                disabled={executing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                {executing ? 'Executing Autonomous Chain...' : 'Execute Multi-Agent Decision Chain'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plan Summary & Impact Mitigation Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-bold text-indigo-400">Trigger Incident</span>
          <div className="text-lg font-black font-mono text-white mt-1">{plan.trigger_event_id}</div>
          <p className="text-xs text-slate-400 mt-1">{plan.title}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-bold text-cyan-400">AI Coordinator Confidence</span>
          <div className="text-lg font-black font-mono text-cyan-300 mt-1">{plan.confidence_score}%</div>
          <p className="text-xs text-slate-400 mt-1">Calculated across 8 sensor streams & aerodynamic twin</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Averted Public Exposure</span>
          <div className="text-lg font-black font-mono text-emerald-300 mt-1 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            -{plan.impact_mitigation.estimated_exposure_reduction_pct}% Exposure
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {plan.impact_mitigation.prevented_vulnerable_exposures} vulnerable citizens safeguarded
          </p>
        </div>
      </div>

      {/* Chained Action Step Sequence */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Autonomous Operational Coordinator Action Chain (6 Steps)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            {isExecuted ? '6 / 6 Completed' : executing ? `Executing Step ${activeStepIndex + 1}...` : 'Ready'}
          </span>
        </div>

        <div className="space-y-3">
          {plan.actions.map((act, index) => {
            const isStepActive = activeStepIndex === index;
            const isStepDone = isExecuted || (act.status === 'COMPLETED');

            return (
              <div
                key={act.step}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isStepActive 
                    ? 'bg-indigo-950/60 border-cyan-500/60 ring-1 ring-cyan-500/40' 
                    : isStepDone 
                    ? 'bg-slate-950/60 border-emerald-500/30' 
                    : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isStepDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isStepActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-spin'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isStepDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : act.step}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                        {act.action_type}
                      </span>
                      <span className="text-xs font-bold text-white">{act.target}</span>
                    </div>
                    <p className="text-xs text-slate-300">{act.instruction}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{act.details}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className={`text-[10px] px-2.5 py-1 rounded font-mono font-bold ${
                    isStepDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isStepActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isStepDone ? 'COMPLETED' : isStepActive ? 'EXECUTING...' : 'PENDING'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
