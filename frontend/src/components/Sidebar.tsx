import React from 'react';
import { 
  Home,
  Globe2,
  Send,
  BrainCircuit,
  FileText,
  Settings,
  MonitorPlay,
  MonitorCheck
} from 'lucide-react';
import { PrimarySection } from '../stores/environmentStore';

interface SidebarProps {
  activeSection: PrimarySection;
  onSelectSection: (section: PrimarySection) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  onOpenSettings
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'environment', label: 'Environment', icon: Globe2 },
    { id: 'missions', label: 'Missions', icon: Send },
    { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-40 transition-all duration-300">
      
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center space-x-3">
            {/* Dot Matrix Logo Icon */}
            <div className="grid grid-cols-3 gap-[2px]">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${[1,3,4,5,7].includes(i) ? 'bg-[#0EA5E9]' : 'bg-[#0EA5E9]/30'}`} />
              ))}
            </div>
            
            <div className="flex flex-col">
              <span className="font-sans font-black text-[17px] tracking-tight text-slate-700 leading-tight">
                FLUXX
              </span>
              <span className="font-sans font-medium text-[8px] tracking-widest text-slate-400 uppercase leading-none mt-0.5">
                ENVIRONMENTAL
                <br/>
                INTELLIGENCE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id as PrimarySection)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E0F2FE] text-[#0284C7] shadow-sm border border-[#BAE6FD]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#0EA5E9]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Settings Button Separated */}
        <div className="px-4 mt-2">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer border border-transparent"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom Status Area */}
      <div className="p-6 pt-0">
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-4 mb-4">
          
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              SYSTEM STATUS
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              DATA SOURCE
            </div>
            <div className="text-xs font-medium text-slate-700">
              Kharghar Survey CSV
            </div>
          </div>

          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              PROCESSING
            </div>
            <div className="text-xs font-medium text-slate-700">
              IDW v1.0
            </div>
          </div>

        </div>

        <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 border-[#E0F2FE] text-[#0EA5E9] bg-white hover:bg-[#F0F9FF] font-semibold text-sm transition-colors cursor-pointer">
          <MonitorPlay className="w-4 h-4" />
          <span>Presentation Mode</span>
        </button>
      </div>

    </aside>
  );
};
