import React from 'react';
import { LayoutDashboard, Globe, Plane, Brain, FileText, Settings } from 'lucide-react';
import { PrimarySection } from '../../stores/environmentStore';

interface NavigationRailProps {
  activeSection: PrimarySection;
  onNavigate: (section: PrimarySection) => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'environment', icon: Globe, label: 'Environment' },
    { id: 'missions', icon: Plane, label: 'Missions' },
    { id: 'intelligence', icon: Brain, label: 'Intelligence' },
    { id: 'reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <div className="w-20 h-full py-6 flex flex-col items-center justify-between fluxx-glass rounded-2xl z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className="w-10 h-10 bg-fluxx-teal rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer">
          F
        </div>
        
        {/* Nav Links */}
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PrimarySection)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  active 
                    ? 'bg-fluxx-teal text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
};
