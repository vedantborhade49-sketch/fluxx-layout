import React from 'react';
import { 
  BrainCircuit, 
  Wind, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Navigation, 
  Clock, 
  CheckCircle,
  Activity,
  Flame,
  ArrowRight
} from 'lucide-react';
import { AIAnalysis } from '../../types';

interface AIStudioProps {
  analysis: AIAnalysis | null;
  droneId: string;
}

export const AIStudio: React.FC<AIStudioProps> = ({ analysis, droneId }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0D101A] via-[#141A2D] to-[#0D101A] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF9D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#00FF9D] p-[1.5px] shadow-lg shadow-[#00FF9D]/20">
              <div className="w-full h-full bg-[#0D101A] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-[#00FF9D] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                  AI Environmental Intelligence & Dispersion Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono-telemetry font-bold bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30">
                  CONFIDENCE {(analysis.confidence_score * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono-telemetry mt-0.5">
                Neural Multi-Horizon Forecast • Atmospheric Plume Dispersion • Root Cause Diagnosis
              </p>
            </div>
          </div>

          <div className="bg-[#121624] px-3.5 py-1.5 rounded-xl border border-white/5 text-right font-mono-telemetry">
            <span className="text-[10px] text-gray-400">ATMOSPHERIC RISK:</span>
            <span className="text-xs font-bold text-[#FF3366] ml-2">
              ● {analysis.atmospheric_risk}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Forecast Horizons + Root Cause Plume Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Predictive Horizons & Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Horizons Cards */}
          <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#00F0FF]" />
              <span>Multi-Horizon AQI Predictions</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono-telemetry">
              
              <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400">+30 MIN HORIZON</span>
                <div className="text-2xl font-bold text-[#00F0FF] my-1">
                  {analysis.prediction_30m} <span className="text-xs font-normal text-gray-400">AQI</span>
                </div>
                <span className="text-[9px] text-[#00FF9D]">Short-term trajectory</span>
              </div>

              <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400">+1 HOUR HORIZON</span>
                <div className="text-2xl font-bold text-[#FFB800] my-1">
                  {analysis.prediction_1h} <span className="text-xs font-normal text-gray-400">AQI</span>
                </div>
                <span className="text-[9px] text-[#FFB800]">Anticipated peak</span>
              </div>

              <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400">+6 HOURS HORIZON</span>
                <div className="text-2xl font-bold text-[#FF7700] my-1">
                  {analysis.prediction_6h} <span className="text-xs font-normal text-gray-400">AQI</span>
                </div>
                <span className="text-[9px] text-gray-400">Dispersion phase</span>
              </div>

              <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400">+24 HOURS HORIZON</span>
                <div className="text-2xl font-bold text-[#00FF9D] my-1">
                  {analysis.prediction_24h} <span className="text-xs font-normal text-gray-400">AQI</span>
                </div>
                <span className="text-[9px] text-[#00FF9D]">Baseline recovery</span>
              </div>

            </div>

            {/* Hourly Forecast Timeline */}
            {analysis.hourly_timeline && (
              <div className="bg-[#121624] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="text-xs font-semibold text-gray-300">
                  24-Hour Projected AQI Timeline Curve:
                </div>
                <div className="space-y-1.5 pt-1">
                  {analysis.hourly_timeline.slice(0, 5).map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono-telemetry">
                      <span className="text-gray-400">{h.hour}</span>
                      <div className="flex-1 mx-3 bg-black/40 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00FF9D] via-[#FFB800] to-[#FF3366] rounded-full"
                          style={{ width: `${Math.min(100, (h.predicted_aqi / 180) * 100)}%` }}
                        />
                      </div>
                      <span className="text-white font-bold">{h.predicted_aqi} AQI</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right: Plume Dispersion & Actionable Mitigation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Root Cause & Dispersion Model */}
          <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Wind className="w-4 h-4 text-[#FF3366]" />
              <span>Pollution Plume Dispersion & Root-Cause Attribution</span>
            </h3>

            {/* Plume Dynamics Box */}
            <div className="bg-[#121624] p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-start space-x-3">
                <Flame className="w-5 h-5 text-[#FF3366] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#FF3366] uppercase tracking-wider font-mono-telemetry">
                    SOURCE HYPOTHESIS: {analysis.source_hypothesis}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Primary Pollutant: <span className="text-white font-semibold">{analysis.pollution_type}</span>
                  </div>
                </div>
              </div>

              {/* Dispersion Dynamics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center font-mono-telemetry text-xs">
                <div className="bg-[#161B2E] p-2.5 rounded-lg">
                  <span className="text-[10px] text-gray-400">PLUME SPREAD</span>
                  <div className="text-white font-bold my-0.5">South-West 210°</div>
                </div>
                <div className="bg-[#161B2E] p-2.5 rounded-lg">
                  <span className="text-[10px] text-gray-400">AFFECTED RADIUS</span>
                  <div className="text-[#FFB800] font-bold my-0.5">3.8 km</div>
                </div>
                <div className="bg-[#161B2E] p-2.5 rounded-lg">
                  <span className="text-[10px] text-gray-400">EST. ARRIVAL (ETA)</span>
                  <div className="text-[#FF3366] font-bold my-0.5">38 minutes</div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div className="bg-[#121624] p-4 rounded-xl border border-[#00FF9D]/30 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#00FF9D] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Autonomous AI Operational Recommendation</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-sans">
                {analysis.recommendation}
              </p>

              {/* Actionable List */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  Suggested Tactical Mitigations:
                </div>
                {analysis.suggested_actions?.map((act, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00FF9D] flex-shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
