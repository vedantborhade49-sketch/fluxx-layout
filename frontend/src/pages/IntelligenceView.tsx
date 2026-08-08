import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { RiskRing } from '../components/ui/RiskRing';
import { useEnvironmentStore } from '../stores/environmentStore';
import { AlertTriangle, TrendingUp, Wind, Droplets } from 'lucide-react';

export const IntelligenceView: React.FC = () => {
  const { eri, anomalies = [] } = useEnvironmentStore();
  const activeEvent = anomalies.length > 0 ? anomalies[0] : null;

  return (
    <div className="w-full h-full flex space-x-4">
      
      {/* LEFT: Anomaly Context */}
      <div className="w-1/3 flex flex-col space-y-4">
        <GlassPanel className="p-8 flex-1 flex flex-col items-center justify-center bg-white/70">
          <div className="text-[10px] font-bold text-fluxx-muted uppercase tracking-widest mb-8">Environmental Risk Index</div>
          <RiskRing score={eri.score} />
          
          <div className="mt-8 text-center">
            <h3 className={`text-xl font-black ${eri.score > 75 ? 'text-fluxx-red' : eri.score > 50 ? 'text-fluxx-amber' : 'text-fluxx-teal'}`}>
              {eri.level}
            </h3>
            <p className="text-sm text-fluxx-muted mt-2">
              {eri.recommendation}
            </p>
          </div>
        </GlassPanel>
      </div>

      {/* RIGHT: Explainable AI Breakdown */}
      <div className="flex-1 flex flex-col space-y-4">
        <GlassPanel className="p-8 flex-1 bg-white/70">
          <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-fluxx-text">AI Diagnostic Breakdown</h2>
              <p className="text-sm text-fluxx-muted mt-1">SHAP value contribution to current risk model</p>
            </div>
            {activeEvent && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle className="w-4 h-4 text-fluxx-red" />
                <span className="text-xs font-bold text-fluxx-red uppercase">{activeEvent.type}</span>
              </div>
            )}
          </div>

          <div className="space-y-6 max-w-2xl">
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4">
                <TrendingUp className="w-5 h-5 text-fluxx-red" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm font-bold text-fluxx-text mb-2">
                  <span>Particulate Matter (PM2.5) Surge</span>
                  <span>+45% impact</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-fluxx-red" style={{ width: '45%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4">
                <Wind className="w-5 h-5 text-fluxx-amber" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm font-bold text-fluxx-text mb-2">
                  <span>Wind Stagnation (Poor Dispersion)</span>
                  <span>+25% impact</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-fluxx-amber" style={{ width: '25%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4">
                <Droplets className="w-5 h-5 text-fluxx-teal" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm font-bold text-fluxx-text mb-2">
                  <span>Relative Humidity Mitigation</span>
                  <span>-15% impact</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-fluxx-teal" style={{ width: '15%' }} />
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-fluxx-text uppercase tracking-widest mb-2">Automated Recommendation</h4>
            <p className="text-sm text-fluxx-muted mb-4">
              AI suggests dispatching a VTOL drone for localized air volumetric sampling at altitude 150m to verify the pollution ceiling.
            </p>
            <button className="px-4 py-2 bg-fluxx-teal text-white rounded-lg text-sm font-bold hover:bg-fluxx-teal-hover transition-colors shadow-sm cursor-pointer">
              Deploy VTOL-002
            </button>
          </div>

        </GlassPanel>
      </div>

    </div>
  );
};
