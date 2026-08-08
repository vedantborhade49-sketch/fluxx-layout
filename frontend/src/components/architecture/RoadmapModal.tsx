import React, { useState } from 'react';
import { 
  X, 
  Server, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Globe, 
  Radio,
  Clock,
  Database,
  Activity,
  Sparkles,
  GitBranch,
  CloudLightning,
  ChevronRight
} from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'topology' | 'comparison' | 'security'>('pipeline');
  const [selectedStage, setSelectedStage] = useState<number>(0);

  if (!isOpen) return null;

  const pipelineStages = [
    {
      id: 0,
      name: "Edge & Onboard IoT",
      protocol: "mTLS 1.3 / Hardware TPM",
      tech: "STM32 + Micro-ROS + Onboard GPS/Sensors",
      description: "Airborne VTOL payload captures raw multispectral, gas (PM2.5/10, NO2, SO2), and LiDAR telemetry at 50Hz, signing each packet cryptographically.",
      metrics: { rate: "50 Hz", latency: "< 5ms", security: "AES-256-GCM" },
      icon: Radio,
      color: "text-[#00B8FF]",
      bg: "bg-[#00B8FF]/10",
      border: "border-[#00B8FF]/40",
    },
    {
      id: 1,
      name: "High-Throughput Ingestion",
      protocol: "Async WebSockets / MQTT 5.0",
      tech: "FastAPI + EMQX Cluster + Kafka",
      description: "Distributed message brokers ingest up to 10,000 msg/s with partitioned event queues and instant WebSocket broadcast to command clients.",
      metrics: { throughput: "10k msg/s", brokers: "3 Nodes", failover: "Zero-loss" },
      icon: Zap,
      color: "text-[#00E7B3]",
      bg: "bg-[#00E7B3]/10",
      border: "border-[#00E7B3]/40",
    },
    {
      id: 2,
      name: "Real-Time AI & Physics Engine",
      protocol: "PyTorch / Gaussian Plume CFD",
      tech: "CUDA Accelerated Microservices",
      description: "Computes 3D atmospheric dispersion plumes, predicts sensor degradation, and runs SHAP explainable root-cause attribution in real-time.",
      metrics: { compute: "275 TOPS", accuracy: "99.4%", xai_layers: "5 Trees" },
      icon: Cpu,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/40",
    },
    {
      id: 3,
      name: "Spatial DB & Knowledge Graph",
      protocol: "TimescaleDB + PostGIS + RDF",
      tech: "Hypertable Clustering + Redis Geo",
      description: "Cross-entity graph linking industrial stack sources to wind vectors, urban wards, sensitive schools/hospitals, and drone trajectories.",
      metrics: { queries: "< 12ms", storage: "Petabyte-ready", relations: "120k Nodes" },
      icon: Database,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
    },
    {
      id: 4,
      name: "Autonomous Dispatch & Glass HUD",
      protocol: "gRPC + WebGL Three.js",
      tech: "React 19 + Three.js + WebSockets",
      description: "Instantaneous situational awareness with 3D digital twin rendering, autonomous mission dispatch, and statutory enforcement reports.",
      metrics: { client_fps: "60 FPS", dispatch: "< 100ms", sla: "99.9% Uptime" },
      icon: Activity,
      color: "text-[#00B8FF]",
      bg: "bg-[#00B8FF]/10",
      border: "border-[#00B8FF]/40",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in font-sans text-slate-100">
      <div className="bg-[#070b14]/95 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col p-6 sm:p-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00B8FF] to-[#00E7B3] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#00B8FF]/20">
              <Server className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00E7B3] uppercase">
                  ENTERPRISE BACKEND ARCHITECTURE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-[9px]">
                  LIVE WORKINGS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Data Pipeline, Microservices & Scalability Topology
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scalability Benchmarks Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-[#00B8FF] text-[11px] font-mono font-semibold">
              <Radio className="w-3.5 h-3.5" />
              Concurrent Fleet
            </div>
            <div className="text-2xl font-black font-mono text-white">100+ VTOL</div>
            <div className="text-[10px] text-slate-400 font-mono">Simultaneous Autonomous Agents</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-[#00E7B3] text-[11px] font-mono font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Peak Ingestion
            </div>
            <div className="text-2xl font-black font-mono text-[#00E7B3]">10,000 msg/s</div>
            <div className="text-[10px] text-slate-400 font-mono">Kafka Partitioned Queue</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-mono font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Glass-to-Glass Latency
            </div>
            <div className="text-2xl font-black font-mono text-purple-300">&lt; 250 ms</div>
            <div className="text-[10px] text-slate-400 font-mono">Telemetry Sensor to UI</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Platform Reliability
            </div>
            <div className="text-2xl font-black font-mono text-rose-300">99.9% Uptime</div>
            <div className="text-[10px] text-slate-400 font-mono">Active-Active Cluster SLA</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-gradient-to-r from-[#00B8FF] to-[#00E7B3] text-slate-950 shadow-md shadow-[#00B8FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Interactive Data Pipeline
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'topology'
                ? 'bg-gradient-to-r from-[#00B8FF] to-[#00E7B3] text-slate-950 shadow-md shadow-[#00B8FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Microservices Topology
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-[#00B8FF] to-[#00E7B3] text-slate-950 shadow-md shadow-[#00B8FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            MVP vs Production Matrix
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-[#00B8FF] to-[#00E7B3] text-slate-950 shadow-md shadow-[#00B8FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Security & Statutory Governance
          </button>
        </div>

        {/* Tab 1: Interactive Visual Data Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Visual Stage Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {pipelineStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isSelected = selectedStage === idx;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/10 border-[#00B8FF] shadow-lg shadow-[#00B8FF]/20'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${stage.bg} ${stage.border} border`}>
                        <Icon className={`w-4 h-4 ${stage.color}`} />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        0{idx + 1}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white tracking-tight">
                        {stage.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        {stage.protocol}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Stage Detail Card */}
            {(() => {
              const cur = pipelineStages[selectedStage];
              const Icon = cur.icon;
              return (
                <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${cur.bg} ${cur.border} border`}>
                        <Icon className={`w-6 h-6 ${cur.color}`} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#00E7B3] uppercase tracking-wider">
                          STAGE 0{cur.id + 1} // {cur.protocol}
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          {cur.name}
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#00B8FF]">
                      Tech Stack: {cur.tech}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {cur.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                    {Object.entries(cur.metrics).map(([key, val]) => (
                      <div key={key} className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                          {key.replace('_', ' ')}
                        </span>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Tab 2: Microservices Topology */}
        {activeTab === 'topology' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00B8FF] font-mono uppercase">
                  City Twin & Dispersion Service
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates real-time 3D Gaussian plume dispersion with forward trajectory wind modeling. Simulates atmospheric pollutant transport across Mumbai and industrial zones.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00E7B3] font-mono uppercase">
                  Decision Intelligence & Auto-Scheduler
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Autonomous agent that monitors air quality threshold breaches, checks drone battery states, and auto-dispatches containment missions with optimal waypoints.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 font-mono uppercase">
                  Sensor Fusion & Multi-Source Engine
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fuses airborne drone telemetry with CPCB ground stations, Sentinel-5P satellite optical layers, and municipal traffic density feeds into a unified 16-layer matrix.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 font-mono uppercase">
                  Knowledge Graph Semantic Reasoner
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Relational graph mapping industrial polluters to sensitive schools, hospitals, and population exposure indexes for statutory environmental court notices.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: MVP vs Production Matrix */}
        {activeTab === 'comparison' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="text-[10px] uppercase font-mono text-slate-400 border-b border-white/10 pb-2">
                  <th className="py-3">System Subsystem</th>
                  <th className="py-3 text-[#00B8FF]">Hackathon MVP (Interactive)</th>
                  <th className="py-3 text-[#00E7B3]">Production Enterprise System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                <tr>
                  <td className="py-3 font-bold text-white font-sans">Telemetry Stream</td>
                  <td className="py-3 text-[#00B8FF]">FastAPI Async WebSockets + Ring Buffer</td>
                  <td className="py-3 text-[#00E7B3]">EMQX MQTT 5.0 Cluster + Kafka Partitioning</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white font-sans">Persistence Layer</td>
                  <td className="py-3 text-[#00B8FF]">SQLite In-Memory + JSON Telemetry Log</td>
                  <td className="py-3 text-[#00E7B3]">TimescaleDB Hypertables + Redis GeoCluster</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white font-sans">Plume Modeling</td>
                  <td className="py-3 text-[#00B8FF]">3D Gaussian Plume + Drone Battery SOH</td>
                  <td className="py-3 text-[#00E7B3]">WRF-Chem Meso-scale CFD Modeling Engine</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white font-sans">Explainable AI</td>
                  <td className="py-3 text-[#00B8FF]">Multi-Pollutant ERI + Root-Cause Tree</td>
                  <td className="py-3 text-[#00E7B3]">SHAP Ensemble Models + Continuous PyTorch Retraining</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white font-sans">Hardware Security</td>
                  <td className="py-3 text-[#00B8FF]">Bearer API Keys + Role-Based Simulators</td>
                  <td className="py-3 text-[#00E7B3]">mTLS 1.3 + TPM 2.0 Hardware Cryptographic Signing</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Security & Governance */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                <Lock className="w-4 h-4" />
                Cryptographic Tamper-Evidence
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Every sensor reading captured by airborne VTOL payloads is signed onboard using a private key embedded in the drone's hardware TPM 2.0. This guarantees chain-of-custody for evidentiary submission in environmental courts (e.g. NGT) when issuing industrial shutdown orders.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#00B8FF] font-mono text-xs font-bold">
                <Globe className="w-4 h-4" />
                Multi-Tenant Agency Separation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Granular Role-Based Access Control (RBAC) partitions data access so State Pollution Control Board officers access legal enforcement modules, Municipal authorities view ward exposure scores, and industrial tenants only view their own compliance telemetry.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
