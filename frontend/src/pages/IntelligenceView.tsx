import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Wind, 
  Factory, 
  Thermometer, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useEnvironmentStore } from '../stores/environmentStore';

export const IntelligenceView: React.FC = () => {
  const { eri, anomalies = [] } = useEnvironmentStore();

  const activeEvent = anomalies.length > 0 ? anomalies[0] : null;

  return (
    <div className="h-full flex flex-col xl:flex-row gap-5 overflow-y-auto overflow-x-hidden p-2">
      
      {/* LEFT: Risk Ring & Active Event */}
      <div className="w-full xl:w-[450px] flex flex-col space-y-5">
        
        {/* Risk Ring */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6 w-full text-center">ENVIRONMENTAL RISK INDEX</div>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Base SVG Ring */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Background track */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              {/* Progress track (simulating 64) */}
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke={eri.score > 75 ? "#EF4444" : eri.score > 50 ? "#F59E0B" : "#10B981"} 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${eri.score * 2.82} 282`}
                strokeDashoffset="0"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">{eri.score}</span>
              <span className={`text-sm font-bold uppercase tracking-widest mt-1 ${
                eri.score > 75 ? 'text-red-500' : eri.score > 50 ? 'text-amber-500' : 'text-emerald-500'
              }`}>{eri.level}</span>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-600 leading-relaxed px-4">
            {eri.recommendation}
          </div>
        </div>

        {/* Active Event */}
        {activeEvent ? (
          <div className="bg-white border border-red-200 shadow-sm rounded-2xl p-6">
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base uppercase tracking-tight">Active Anomaly Detected</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TYPE</div>
                <div className="text-sm font-bold text-slate-800">{activeEvent.type}</div>
              </div>
              
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">LOCATION</div>
                <div className="text-sm font-bold text-slate-800">19.04° N, 73.07° E</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONFIDENCE</div>
                  <div className="text-[10px] font-bold text-[#0EA5E9]">{activeEvent.confidence}%</div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: `${activeEvent.confidence}%` }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center py-12 text-slate-400">
            <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-400 opacity-50" />
            <div className="text-sm font-bold text-slate-500">No active anomalies detected</div>
            <div className="text-xs text-slate-400">AI monitoring active</div>
          </div>
        )}
      </div>

      {/* RIGHT: Explainable AI Breakdown */}
      <div className="flex-1 flex flex-col space-y-5">
        
        {/* Contribution Chart */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FEATURE IMPORTANCE (SHAP VALUES)</div>
            <div className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-wide">
              DECISION INTELLIGENCE
            </div>
          </div>
          
          <div className="space-y-5">
            {[
              { name: 'PM2.5 Concentration', icon: Factory, val: 0.85, color: 'bg-red-500' },
              { name: 'PM10 Concentration', icon: Factory, val: 0.62, color: 'bg-amber-500' },
              { name: 'Wind Stagnation', icon: Wind, val: 0.41, color: 'bg-[#0EA5E9]' },
              { name: 'Humidity Index', icon: Thermometer, val: 0.22, color: 'bg-indigo-400' },
              { name: 'Temperature Inversion', icon: Activity, val: 0.15, color: 'bg-slate-400' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-center">
                  <div className="w-40 flex items-center space-x-3 shrink-0">
                    <div className={`p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-500`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">{feature.name}</span>
                  </div>
                  
                  <div className="flex-1 h-3 bg-slate-50 rounded overflow-hidden ml-4 flex">
                    <div className={`h-full ${feature.color} rounded-r`} style={{ width: `${feature.val * 100}%` }} />
                  </div>
                  
                  <div className="w-12 text-right text-[10px] font-mono text-slate-500 ml-4">
                    +{feature.val.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Environmental Timeline & Mitigations */}
        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">AI RECOMMENDATIONS & MITIGATION PLAN</div>
          
          <div className="flex-1 space-y-6">
            
            <div className="flex items-start">
              <div className="w-8 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center border border-red-200 z-10">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                </div>
                <div className="w-px h-16 bg-slate-200 mt-2" />
              </div>
              <div className="flex-1 ml-4 pt-1">
                <div className="text-xs font-bold text-slate-800 mb-1">Issue Health Advisory</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  PM2.5 levels are highly elevated. Issue immediate warnings for sensitive groups within the Kharghar Sector 12 radius to remain indoors.
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#E0F2FE] flex items-center justify-center border border-[#BAE6FD] z-10">
                  <ShieldAlert className="w-3 h-3 text-[#0EA5E9]" />
                </div>
                <div className="w-px h-16 bg-slate-200 mt-2" />
              </div>
              <div className="flex-1 ml-4 pt-1">
                <div className="text-xs font-bold text-slate-800 mb-1">Deploy Drone Fleet</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  Dispatch VTOL unit FLUXX-ALPHA to coordinate aerial sampling at 40m altitude to track plume trajectory and confirm source origin.
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 z-10">
                  <TrendingUp className="w-3 h-3 text-slate-600" />
                </div>
              </div>
              <div className="flex-1 ml-4 pt-1">
                <div className="text-xs font-bold text-slate-800 mb-1">Traffic Rerouting</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  Coordinate with traffic signals to reduce stagnation along the main arterial roads near Sector 12 to reduce localized emissions.
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer">
              Export AI Log
            </button>
            <button className="px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
              Execute Mitigations
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
