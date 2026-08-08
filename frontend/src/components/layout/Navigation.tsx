import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Send, 
  ShieldAlert, 
  FileText, 
  Cpu, 
  Plane,
  Building2,
  Sparkles,
  Landmark,
  Clock,
  MessageSquare,
  Calendar,
  Server,
  Bot,
  Network,
  Award,
  ShoppingBag,
  Puzzle,
  Code2
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'executive'
  | 'decision_intelligence'
  | 'knowledge_graph'
  | 'marketplace'
  | 'plugins'
  | 'city_twin'
  | 'intelligence'
  | 'digital_twin' 
  | 'heatmaps' 
  | 'missions' 
  | 'regulatory'
  | 'playback'
  | 'collaboration'
  | 'fleet' 
  | 'reports' 
  | 'alerts';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unresolvedAlertsCount?: number;
  onOpenScheduler?: () => void;
  onOpenRoadmap?: () => void;
  onOpenQualityScore?: () => void;
  onOpenSDK?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  unresolvedAlertsCount = 0,
  onOpenScheduler,
  onOpenRoadmap,
  onOpenQualityScore,
  onOpenSDK
}) => {
  const tabs = [
    { id: 'overview' as NavTab, label: 'Command Center', icon: LayoutDashboard },
    { id: 'executive' as NavTab, label: 'Executive Board', icon: Award, badge: 'C-SUITE' },
    { id: 'decision_intelligence' as NavTab, label: 'Decision Intelligence', icon: Bot, badge: 'AUTO-OPS' },
    { id: 'knowledge_graph' as NavTab, label: 'Knowledge Graph', icon: Network, badge: 'ONTOLOGY' },
    { id: 'marketplace' as NavTab, label: 'Mission Exchange', icon: ShoppingBag, badge: 'TENANT' },
    { id: 'plugins' as NavTab, label: 'Sensor Plugins', icon: Puzzle, badge: 'DRIVERS' },
    { id: 'city_twin' as NavTab, label: 'City Twin 3D', icon: Building2, badge: 'PLUME' },
    { id: 'intelligence' as NavTab, label: 'Explainable AI', icon: Sparkles, badge: 'XAI' },
    { id: 'regulatory' as NavTab, label: 'Regulatory Hub', icon: Landmark, badge: 'SPCB' },
    { id: 'playback' as NavTab, label: '4D Playback', icon: Clock },
    { id: 'digital_twin' as NavTab, label: 'Drone Twin', icon: Cpu, badge: 'PHYSICS' },
    { id: 'heatmaps' as NavTab, label: 'Heatmaps', icon: Map, badge: '16 LAYERS' },
    { id: 'missions' as NavTab, label: 'Mission Planner', icon: Send },
    { id: 'collaboration' as NavTab, label: 'Collaboration', icon: MessageSquare },
    { id: 'fleet' as NavTab, label: 'Fleet Health', icon: Plane },
    { id: 'reports' as NavTab, label: 'Audit Reports', icon: FileText },
    { id: 'alerts' as NavTab, label: 'Alerts', icon: ShieldAlert, alertCount: unresolvedAlertsCount }
  ];

  return (
    <nav className="bg-[#070b14]/90 border-b border-white/10 px-4 lg:px-6 sticky top-0 z-40 backdrop-blur-2xl">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2.5 gap-3">
        
        {/* Navigation Items */}
        <div className="flex items-center space-x-1.5 flex-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00B8FF]/20 to-[#00E7B3]/20 text-white border border-[#00B8FF]/50 shadow-md shadow-[#00B8FF]/15'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00B8FF]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {/* Badge */}
                {tab.badge && (
                  <span className={`hidden xl:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    isActive ? 'bg-[#00E7B3]/20 text-[#00E7B3]' : 'bg-white/10 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}

                {/* Alert Badge */}
                {tab.alertCount !== undefined && tab.alertCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold animate-pulse">
                    {tab.alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Action Modals */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {onOpenRoadmap && (
            <button
              onClick={onOpenRoadmap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00B8FF]/10 to-[#00E7B3]/10 hover:from-[#00B8FF]/20 hover:to-[#00E7B3]/20 border border-[#00B8FF]/30 text-[#00B8FF] text-xs font-semibold whitespace-nowrap transition-all shadow-sm cursor-pointer"
              title="Enterprise Backend Architecture"
            >
              <Server className="w-3.5 h-3.5 text-[#00E7B3]" />
              <span className="hidden sm:inline">Backend Pipeline</span>
            </button>
          )}

          {onOpenQualityScore && (
            <button
              onClick={onOpenQualityScore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold whitespace-nowrap transition-all shadow-sm cursor-pointer"
              title="Mission Intelligence Score"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Mission Score</span>
            </button>
          )}

          {onOpenSDK && (
            <button
              onClick={onOpenSDK}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold whitespace-nowrap transition-all shadow-sm cursor-pointer"
              title="Developer SDK & APIs"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">SDK</span>
            </button>
          )}

          {onOpenScheduler && (
            <button
              onClick={onOpenScheduler}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold whitespace-nowrap transition-all shadow-sm cursor-pointer"
              title="Autonomous Mission Scheduler"
            >
              <Calendar className="w-3.5 h-3.5 text-[#00B8FF]" />
              <span className="hidden sm:inline">Scheduler</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};
