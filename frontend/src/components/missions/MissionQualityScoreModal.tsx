import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Cpu, 
  Battery, 
  Wind, 
  Radio, 
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { MissionQualityScore } from '../../types';

interface MissionQualityScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId?: string;
}

export const MissionQualityScoreModal: React.FC<MissionQualityScoreModalProps> = ({ 
  isOpen, 
  onClose,
  missionId = 'MSN-2041' 
}) => {
  const [scoreData, setScoreData] = useState<MissionQualityScore | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadScore();
    }
  }, [isOpen, missionId]);

  const loadScore = async () => {
    try {
      const data = await api.getMissionQualityScore(missionId);
      setScoreData(data);
    } catch (err) {
      console.error('Failed to load mission score:', err);
    }
  };

  if (!isOpen || !scoreData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                MISSION QUALITY &amp; DEFENSIVE INTELLIGENCE SCORE
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {scoreData.mission_id}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Composite Mission Verification • Multi-Factor Sensor &amp; Aviation Telemetry Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Overall Mission Score</span>
              <div className="text-4xl font-black font-mono text-emerald-300 mt-1">
                {scoreData.overall_quality_score}%
              </div>
              <p className="text-xs text-slate-300 mt-1">Status: <strong className="text-white">{scoreData.statutory_acceptance_status}</strong></p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold self-start md:self-center">
              {scoreData.quality_tier}
            </div>
          </div>

          {/* Component Factors Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-indigo-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Evaluation Components &amp; Factor Weights
            </h3>

            <div className="space-y-2.5">
              {scoreData.component_scores.map((comp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {comp.metric} <span className="text-[10px] text-slate-500 font-mono">({comp.weight_pct}% weight)</span>
                    </span>
                    <span className="font-mono font-black text-emerald-300">{comp.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full"
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">{comp.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Provenance & Cryptographic Signature */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
            <h3 className="text-xs font-black uppercase text-indigo-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Cryptographic Provenance &amp; Sensor Calibration Stamp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div>Airframe Serial: <strong className="text-white">{scoreData.data_provenance.airframe_serial}</strong></div>
              <div>Firmware: <strong className="text-white">{scoreData.data_provenance.firmware_version}</strong></div>
              <div>Calibration Std: <strong className="text-cyan-300">{scoreData.data_provenance.calibration_standard}</strong></div>
              <div>Sensor Precision: <strong className="text-emerald-300">{scoreData.data_provenance.sensor_accuracy}</strong></div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 break-all">
              Seal: {scoreData.data_provenance.cryptographic_seal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
