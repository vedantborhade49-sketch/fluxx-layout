import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  Building, 
  School, 
  Flame, 
  Plane, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  Link,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { KnowledgeGraphData, KnowledgeQueryResult, KnowledgeNode } from '../../types';

export const KnowledgeGraphStudio: React.FC = () => {
  const [graphData, setGraphData] = useState<KnowledgeGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [activeQueryId, setActiveQueryId] = useState<string>('schools_near_emissions');
  const [queryResult, setQueryResult] = useState<KnowledgeQueryResult | null>(null);
  const [loadingQuery, setLoadingQuery] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    loadGraph();
    runQuery(activeQueryId);
  }, []);

  const loadGraph = async () => {
    try {
      const data = await api.getKnowledgeGraph();
      setGraphData(data);
      if (data.nodes.length > 0) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error('Failed to load knowledge graph:', err);
    }
  };

  const runQuery = async (queryId: string) => {
    setActiveQueryId(queryId);
    setLoadingQuery(true);
    try {
      const res = await api.queryKnowledgeGraph(queryId);
      setQueryResult(res);
    } catch (err) {
      console.error('Failed to run query:', err);
    } finally {
      setLoadingQuery(false);
    }
  };

  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-72 text-slate-400 font-mono text-xs animate-pulse">
        Initializing Unified Environmental Knowledge Graph...
      </div>
    );
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'INDUSTRIAL_SOURCE': return <Flame className="w-4 h-4 text-rose-400" />;
      case 'SENSITIVE_RECEPTOR': return <School className="w-4 h-4 text-amber-400" />;
      case 'SURVEILLANCE_AGENT': return <Plane className="w-4 h-4 text-[#00B8FF]" />;
      case 'EMISSION_PLUME': return <Sparkles className="w-4 h-4 text-[#00E7B3]" />;
      default: return <Building className="w-4 h-4 text-purple-400" />;
    }
  };

  const filteredNodes = filterType === 'ALL' 
    ? graphData.nodes 
    : graphData.nodes.filter(n => n.type === filterType);

  const connectedEdges = graphData.edges.filter(
    (e) => e.source === selectedNode?.id || e.target === selectedNode?.id
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-100">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#070b14]/90 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00B8FF] to-[#00E7B3] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#00B8FF]/20">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00E7B3] uppercase">
                  SEMANTIC ONTOLOGY & REASONING ENGINE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-[9px]">
                  {graphData.nodes.length} ENTITIES • {graphData.edges.length} RELATIONS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Unified Environmental Knowledge Graph
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">FILTER:</span>
            {['ALL', 'INDUSTRIAL_SOURCE', 'SENSITIVE_RECEPTOR', 'EMISSION_PLUME'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-semibold transition-all ${
                  filterType === f
                    ? 'bg-[#00B8FF] text-slate-950 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Semantic Natural Language Query Workbench */}
      <div className="p-6 rounded-3xl bg-[#070b14]/85 border border-white/10 backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00B8FF]">
            <Search className="w-3.5 h-3.5" />
            Natural Language Relational Queries
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Click a prompt to evaluate graph inference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => runQuery('schools_near_emissions')}
            className={`p-3.5 rounded-2xl text-xs font-medium text-left transition-all border flex items-start gap-2.5 ${
              activeQueryId === 'schools_near_emissions'
                ? 'bg-[#00B8FF]/10 border-[#00B8FF] text-white shadow-md shadow-[#00B8FF]/20'
                : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#00B8FF] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">"Show industrial polluters causing AQI &gt; 150 near schools"</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Discovers plume trajectory intersections with vulnerable education centers</div>
            </div>
          </button>

          <button
            onClick={() => runQuery('hospital_vulnerability')}
            className={`p-3.5 rounded-2xl text-xs font-medium text-left transition-all border flex items-start gap-2.5 ${
              activeQueryId === 'hospital_vulnerability'
                ? 'bg-[#00E7B3]/10 border-[#00E7B3] text-white shadow-md shadow-[#00E7B3]/20'
                : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#00E7B3] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">"Identify hospitals in direct path of active dispersion plume"</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Calculates atmospheric wind vector overlap with pulmonary healthcare wards</div>
            </div>
          </button>
        </div>

        {/* Resolved Query Inference Output */}
        {queryResult && (
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-[#00B8FF]/30 space-y-3 animate-fade-in">
            <div className="text-xs font-bold text-white font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E7B3] animate-ping" />
                <span className="text-[#00E7B3]">Graph Resolution:</span>
                <span>{queryResult.query_text}</span>
              </div>
              <span className="text-[10px] text-slate-400">Confidence: 98.4%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-rose-400">
                  Attributed Emission Sources
                </span>
                {queryResult.matched_sources.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-300 border-b border-white/5 pb-1">
                    <span className="font-semibold text-white">{s.source}</span>
                    <span className="text-rose-400 font-mono font-bold">Peak AQI {s.peak_aqi}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                  Threatened Sensitive Receptors
                </span>
                {queryResult.affected_schools.map((sch, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-300 border-b border-white/5 pb-1">
                    <span className="font-semibold text-white">{sch.name}</span>
                    <span className="text-amber-300 font-mono">{sch.distance} ({sch.threat_level})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#00B8FF]/10 border border-[#00B8FF]/20 text-xs text-[#00B8FF] font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#00B8FF] shrink-0" />
              <span><strong>Statutory Enforcement Notice:</strong> {queryResult.statutory_recommendation}</span>
            </div>
          </div>
        )}
      </div>

      {/* Relational Entity Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Filtered Entities List */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#070b14]/85 border border-white/10 backdrop-blur-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#00B8FF]" />
              Graph Entities ({filteredNodes.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedNode?.id === node.id
                    ? 'bg-[#00B8FF]/15 border-[#00B8FF] text-white shadow-lg shadow-[#00B8FF]/10'
                    : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{node.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{node.type}</div>
                  </div>
                </div>
                {node.risk_tier && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {node.risk_tier}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Node Detail & Connected Relations */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#070b14]/85 border border-white/10 backdrop-blur-2xl space-y-4">
          <div className="pb-3 border-b border-white/10 flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Link className="w-3.5 h-3.5 text-[#00E7B3]" />
              Entity Triples & Relationships
            </span>
            <span className="text-xs font-mono text-[#00B8FF] font-bold">{selectedNode?.id}</span>
          </div>

          {selectedNode && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white">{selectedNode.label}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {selectedNode.type}
                  </span>
                </div>
                {selectedNode.population && (
                  <div className="text-slate-300">Population: <strong className="text-white font-mono">{selectedNode.population.toLocaleString()}</strong></div>
                )}
                {selectedNode.students && (
                  <div className="text-slate-300">Enrolled Students: <strong className="text-amber-300 font-mono">{selectedNode.students}</strong></div>
                )}
                {selectedNode.beds && (
                  <div className="text-slate-300">Hospital ICU Beds: <strong className="text-[#00E7B3] font-mono">{selectedNode.beds}</strong></div>
                )}
              </div>

              {/* Connected Relationships */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-[#00E7B3]">
                  Connected Semantic Triples ({connectedEdges.length})
                </span>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {connectedEdges.map((edge, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-[#00B8FF] font-bold">{edge.source}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="px-2 py-0.5 rounded-full bg-[#00E7B3]/15 text-[#00E7B3] text-[9px] font-bold">
                          {edge.relation}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="text-white font-bold">{edge.target}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{(edge.confidence * 100).toFixed(0)}% Conf</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
