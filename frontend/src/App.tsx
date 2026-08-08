import React, { useEffect } from 'react';
import { useEnvironmentStore } from './stores/environmentStore';
import { NavigationRail } from './components/ui/NavigationRail';
import { TopBar } from './components/ui/TopBar';
import { ReplayTimeline } from './components/ui/ReplayTimeline';
import { OverviewView } from './pages/OverviewView';
import { EnvironmentView } from './pages/EnvironmentView';
import { MissionsView } from './pages/MissionsView';
import { IntelligenceView } from './pages/IntelligenceView';
import { ReportsView } from './pages/ReportsView';

export const App: React.FC = () => {
  const { activeSection, setActiveSection, currentReading } = useEnvironmentStore();

  const timeStr = currentReading 
    ? new Date(currentReading.timestamp).toLocaleTimeString('en-US', { hour12: false }) 
    : '15:42:00';

  return (
    <div className="w-screen h-screen bg-fluxx-bg p-4 flex flex-col gap-4 overflow-hidden text-fluxx-text font-sans">
      
      {/* Top Header */}
      <TopBar />

      {/* Main Layout Area */}
      <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
        {/* Sidebar */}
        <NavigationRail activeSection={activeSection} onNavigate={setActiveSection} />

        {/* Dynamic Page Content */}
        <div className="flex-1 h-full relative overflow-hidden rounded-2xl">
          {activeSection === 'overview' && <OverviewView />}
          {activeSection === 'environment' && <EnvironmentView />}
          {activeSection === 'missions' && <MissionsView />}
          {activeSection === 'intelligence' && <IntelligenceView />}
          {activeSection === 'reports' && <ReportsView />}
        </div>
      </div>

      {/* Footer Timeline */}
      <ReplayTimeline currentTime={timeStr} />
      
    </div>
  );
};

export default App;
