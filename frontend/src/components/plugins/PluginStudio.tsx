import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  Power, 
  CheckCircle2, 
  Cpu, 
  Flame, 
  Waves, 
  Radiation, 
  Trees, 
  Sparkles,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { PluginModule } from '../../types';

export const PluginStudio: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginModule[]>([]);

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    try {
      const data = await api.getPluginRegistry();
      setPlugins(data);
    } catch (err) {
      console.error('Failed to load plugin registry:', err);
    }
  };

  const handleToggle = async (pluginId: string) => {
    try {
      await api.togglePlugin(pluginId);
      await loadPlugins();
    } catch (err) {
      console.error('Failed to toggle plugin:', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AIR_POLLUTION': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'FORESTRY': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'MARINE_WATER': return <Waves className="w-5 h-5 text-cyan-400" />;
      case 'HAZMAT_DEFENSE': return <Radiation className="w-5 h-5 text-rose-400" />;
      case 'CLIMATE_CARBON': return <Trees className="w-5 h-5 text-emerald-400" />;
      default: return <Puzzle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/20">
              <Puzzle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider text-white flex items-center gap-3">
                EXTENSIBLE PLUGIN ARCHITECTURE STUDIO
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                  MODULAR SENSOR REGISTRY
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Hot-pluggable sensor drivers, dispersion kernels, and domain algorithms (Urban AQI, Wildfire, Maritime, Hazmat, Carbon)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plug) => {
          const isActive = plug.status === 'ACTIVE';

          return (
            <div
              key={plug.id}
              className={`p-6 rounded-2xl border backdrop-blur-xl space-y-4 transition-all ${
                isActive 
                  ? 'bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    {getCategoryIcon(plug.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{plug.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{plug.version} • {plug.author}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(plug.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                  title={isActive ? 'Deactivate Plugin' : 'Activate Plugin'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300">{plug.description}</p>

              <div className="space-y-2 text-[11px] font-mono">
                <div className="text-slate-400">
                  <strong className="text-slate-300">Channels:</strong> {plug.channels.join(', ')}
                </div>
                <div className="text-slate-400">
                  <strong className="text-slate-300">Algorithm:</strong> {plug.algorithm}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                <span className="text-indigo-400">{plug.category}</span>
                <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {plug.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
