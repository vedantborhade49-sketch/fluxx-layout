import React, { useEffect } from 'react';
import { useEnvironmentStore } from './stores/environmentStore';
import { NavigationRail } from './components/ui/NavigationRail';
import { OverviewView } from './pages/OverviewView';
import { EnvironmentView } from './pages/EnvironmentView';
import { MissionsView } from './pages/MissionsView';
import { IntelligenceView } from './pages/IntelligenceView';
import { ReportsView } from './pages/ReportsView';

export const App: React.FC = () => {
  const { activeSection, setActiveSection, startWebSocket } = useEnvironmentStore();

  useEffect(() => {
    startWebSocket();
  }, [startWebSocket]);

  return (
    <div className="w-screen h-screen bg-[#F4F7F8] p-4 flex gap-4 overflow-hidden text-slate-800 font-sans">
      
      {/* Floating Navigation Rail */}
      <NavigationRail activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main Content Area */}
      <div className="flex-1 h-full relative rounded-2xl overflow-hidden">
        {activeSection === 'overview' && <OverviewView />}
        {activeSection === 'environment' && <EnvironmentView />}
        {activeSection === 'missions' && <MissionsView />}
        {activeSection === 'intelligence' && <IntelligenceView />}
        {activeSection === 'reports' && <ReportsView />}
      </div>
      
    </div>
  );
};

export default App;
