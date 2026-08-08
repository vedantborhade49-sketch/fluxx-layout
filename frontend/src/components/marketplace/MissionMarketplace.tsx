import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Send, 
  CheckCircle2, 
  Clock, 
  Building, 
  Flame, 
  Plane, 
  Compass, 
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { MarketplaceMissionItem } from '../../types';

export const MissionMarketplace: React.FC = () => {
  const [missions, setMissions] = useState<MarketplaceMissionItem[]>([]);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await api.getMarketplaceMissions();
      setMissions(data);
    } catch (err) {
      console.error('Failed to load marketplace missions:', err);
    }
  };

  const handleClaim = async (missionId: string) => {
    setClaimingId(missionId);
    try {
      await api.claimMarketplaceMission(missionId, 'VTOL-001');
      await loadMissions();
    } catch (err) {
      console.error('Failed to claim mission:', err);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/20">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider text-white flex items-center gap-3">
                CROSS-AGENCY MISSION MARKETPLACE
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                  MULTI-TENANT EXCHANGE
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Inter-governmental environmental surveillance exchange • Municipalities • Pollution Boards • Forest Depts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((m) => {
          const isDispatched = m.status === 'CLAIMED' || m.status === 'DISPATCHED';

          return (
            <div
              key={m.id}
              className={`p-6 rounded-2xl border backdrop-blur-xl space-y-4 transition-all ${
                isDispatched 
                  ? 'bg-slate-950/80 border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                      {m.agency_code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{m.publishing_agency}</span>
                  </div>
                  <h3 className="text-base font-black text-white">{m.title}</h3>
                </div>

                <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold shrink-0 ${
                  m.priority === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {m.priority}
                </span>
              </div>

              <p className="text-xs text-slate-300">{m.description}</p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400">
                <div>Target: <strong className="text-white">{m.target_area}</strong></div>
                <div>Payload: <strong className="text-cyan-300">{m.required_payload}</strong></div>
                <div>Flight: <strong className="text-white">{m.estimated_flight_min} min</strong></div>
                <div>Coverage: <strong className="text-emerald-300">{m.coverage_km2} km²</strong></div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="text-xs font-mono text-indigo-300 font-bold">
                  Reward: <span className="text-white font-black">{m.reward_credits.toLocaleString()} Credits</span>
                </div>

                {isDispatched ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Assigned: {m.claimed_by_drone || 'VTOL-002'}
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(m.id)}
                    disabled={claimingId === m.id}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {claimingId === m.id ? 'Claiming...' : 'Claim & Dispatch VTOL'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
