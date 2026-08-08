import React, { useState, useEffect } from 'react';
import { Header } from './components/dashboard/Header';
import { Navigation, NavTab } from './components/layout/Navigation';
import { FleetOverview } from './components/dashboard/FleetOverview';
import { SensorGauges } from './components/dashboard/SensorGauges';
import { LiveCharts } from './components/dashboard/LiveCharts';
import { CameraFeed } from './components/dashboard/CameraFeed';
import { MapContainer } from './components/maps/MapContainer';
import { DigitalTwinStudio } from './components/digitaltwin/DigitalTwinStudio';
import { MissionPlanner } from './components/missions/MissionPlanner';
import { AIStudio } from './components/ai/AIStudio';
import { FleetDiagnostics } from './components/fleet/FleetDiagnostics';
import { AuditReportView } from './components/reports/AuditReportView';
import { AlertCenter } from './components/alerts/AlertCenter';
import { SimulatorModal } from './components/simulator/SimulatorModal';

// Enterprise Intelligence & City Twin Modules
import { CityTwinStudio } from './components/citytwin/CityTwinStudio';
import { ExplainableAIView } from './components/intelligence/ExplainableAIView';
import { RegulatoryHub } from './components/regulatory/RegulatoryHub';
import { HistoricalPlayback } from './components/playback/HistoricalPlayback';
import { IncidentTracker } from './components/collaboration/IncidentTracker';
import { SchedulerModal } from './components/missions/SchedulerModal';
import { RoadmapModal } from './components/architecture/RoadmapModal';

// v2.0 Decision Intelligence & Ecosystem Modules
import { DecisionIntelligenceView } from './components/intelligence/DecisionIntelligenceView';
import { KnowledgeGraphStudio } from './components/knowledgegraph/KnowledgeGraphStudio';
import { ExecutiveDashboard } from './components/executive/ExecutiveDashboard';
import { MissionMarketplace } from './components/marketplace/MissionMarketplace';
import { PluginStudio } from './components/plugins/PluginStudio';
import { MissionQualityScoreModal } from './components/missions/MissionQualityScoreModal';
import { DeveloperSDKModal } from './components/sdk/DeveloperSDKModal';

// Original Website Sections
import { HeroSection } from './components/sections/HeroSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';

import { 
  DroneState, 
  SensorReading, 
  HeatmapPoint, 
  HeatmapLayerType, 
  Mission, 
  AIAnalysis, 
  Alert, 
  WeatherData, 
  OrganizationInfo, 
  MultiSourceData,
  AIMissionRecommendation
} from './types';
import { api } from './services/api';
import { socketService } from './services/socket';

export const App: React.FC = () => {
  // View Mode: 'website' (Original Pulled Layout) | 'dashboard' (Live Intelligence Platform)
  const [viewMode, setViewMode] = useState<'website' | 'dashboard'>('website');

  // Main State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [drones, setDrones] = useState<DroneState[]>([]);
  const [selectedDroneId, setSelectedDroneId] = useState<string>('VTOL-001');
  const [latestSensorReading, setLatestSensorReading] = useState<SensorReading | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<SensorReading[]>([]);
  
  // Organizations & Weather
  const [organizations, setOrganizations] = useState<OrganizationInfo[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('ORG-MPCB-MUMBAI');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  // Heatmaps & Multi-Sources
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [currentHeatmapLayer, setCurrentHeatmapLayer] = useState<HeatmapLayerType>('aqi');
  const [multiSources, setMultiSources] = useState<MultiSourceData | null>(null);
  const [hotspots, setHotspots] = useState<any[]>([]);

  // AI & Missions
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Telemetry Chart Controls
  const [selectedMetric, setSelectedMetric] = useState<string>('aqi');
  const [timeRange, setTimeRange] = useState<string>('1h');

  // UI Modals & Audio
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState<boolean>(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState<boolean>(false);
  const [isQualityScoreOpen, setIsQualityScoreOpen] = useState<boolean>(false);
  const [isSDKOpen, setIsSDKOpen] = useState<boolean>(false);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      try {
        const [dronesData, orgsData, weatherData, alertsData, aiData, multiData, hsData, histData] = await Promise.all([
          api.getDrones(),
          api.getOrganizations(),
          api.getWeather(),
          api.getAlerts(),
          api.getAIPrediction(selectedDroneId),
          api.getMultiSourceData(),
          api.getAIHotspots(),
          api.getTelemetryHistory(selectedDroneId, timeRange)
        ]);

        setDrones(dronesData);
        if (dronesData.length > 0 && !selectedDroneId) {
          setSelectedDroneId(dronesData[0].id);
        }
        setOrganizations(orgsData);
        setWeather(weatherData);
        setAlerts(alertsData);
        setAiAnalysis(aiData);
        setMultiSources(multiData);
        setHotspots(hsData);
        setTelemetryHistory(histData);

        // Load Heatmap points
        const hmData = await api.getHeatmapPoints(currentHeatmapLayer);
        setHeatmapPoints(hmData.points || []);
      } catch (err) {
        console.error('Error fetching initial platform data:', err);
      }
    };

    initData();
  }, []);

  // Update Heatmap Points when Layer changes
  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const hmData = await api.getHeatmapPoints(currentHeatmapLayer);
        setHeatmapPoints(hmData.points || []);
      } catch (err) {
        console.error('Failed to update heatmap points:', err);
      }
    };
    fetchHeatmap();
  }, [currentHeatmapLayer]);

  // Connect Real-Time WebSocket Telemetry
  useEffect(() => {
    socketService.connect();

    const unsubStatus = socketService.onStatusChange((status) => {
      setIsConnected(status);
    });

    const unsubTelemetry = socketService.onTelemetry((telemetry) => {
      // Update specific drone coordinates and battery
      setDrones((prevDrones) =>
        prevDrones.map((d) =>
          d.id === telemetry.drone_id
            ? {
                ...d,
                latitude: telemetry.latitude,
                longitude: telemetry.longitude,
                altitude: telemetry.altitude,
                battery: telemetry.battery,
                status: (telemetry as any).status || d.status
              }
            : d
        )
      );

      // If telemetry belongs to currently inspected drone, update sensor gauges and time-series
      if (telemetry.drone_id === selectedDroneId) {
        const newReading: SensorReading = {
          drone_id: telemetry.drone_id,
          timestamp: telemetry.timestamp,
          latitude: telemetry.latitude,
          longitude: telemetry.longitude,
          altitude: telemetry.altitude,
          battery: telemetry.battery,
          aqi: telemetry.aqi,
          pm25: telemetry.pm25,
          pm10: telemetry.pm10,
          co2: telemetry.co2,
          voc: telemetry.voc,
          ozone: telemetry.ozone,
          methane: telemetry.methane,
          temperature: telemetry.temperature,
          humidity: telemetry.humidity,
          pressure: telemetry.pressure,
          wind_speed: telemetry.wind_speed,
          wind_direction: telemetry.wind_direction,
          uv_index: 3.5,
          noise_level: telemetry.noise_level,
          confidence_score: 96.8
        };

        setLatestSensorReading(newReading);
        setTelemetryHistory((prev) => [newReading, ...prev.slice(0, 150)]);
      }
    });

    const unsubHeatmap = socketService.onHeatmapBatch((batch) => {
      if (batch.points && batch.points.length > 0) {
        setHeatmapPoints(batch.points);
      }
    });

    const unsubAlert = socketService.onAlert((newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      if (audioAlertsEnabled) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        } catch (e) {
          // Fallback
        }
      }
    });

    return () => {
      unsubStatus();
      unsubTelemetry();
      unsubHeatmap();
      unsubAlert();
    };
  }, [selectedDroneId, audioAlertsEnabled]);

  // Handle Drone Selection
  const handleSelectDrone = async (droneId: string) => {
    setSelectedDroneId(droneId);
    try {
      const [aiData, histData] = await Promise.all([
        api.getAIPrediction(droneId),
        api.getTelemetryHistory(droneId, timeRange)
      ]);
      setAiAnalysis(aiData);
      setTelemetryHistory(histData);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Org Selection
  const handleSelectOrg = (orgId: string) => {
    setSelectedOrgId(orgId);
  };

  // Handle Alert Resolution
  const handleResolveAlert = async (alertId: string) => {
    try {
      const updated = await api.resolveAlert(alertId);
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)));
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Dispatch Drone from City Twin
  const handleDispatchPlumeIntercept = (lat: number, lng: number, name: string) => {
    const newMission: Mission = {
      id: `MSN-${Date.now().toString().slice(-4)}`,
      name,
      type: 'DISPERSION_INTERCEPT',
      status: 'IN_PROGRESS',
      area_name: 'Plume Trajectory Intercept',
      drone_id: 'VTOL-002',
      start_time: new Date().toISOString(),
      distance_km: 8.4,
      flight_time_min: 24,
      coverage_sqkm: 6.2,
      average_aqi: 145,
      waypoints: [
        { lat, lng, alt: 90, action: 'SURVEY', speed: 14.0 }
      ]
    };
    setActiveMission(newMission);
    setActiveTab('overview');
  };

  // Handle Accept AI Recommendation
  const handleAcceptAIRecommendation = (rec: AIMissionRecommendation) => {
    const newMission: Mission = {
      id: `MSN-${Date.now().toString().slice(-4)}`,
      name: `AI Mission: ${rec.target_area_name}`,
      type: rec.recommended_survey_type,
      status: 'IN_PROGRESS',
      area_name: rec.target_area_name,
      drone_id: rec.suggested_drone_id,
      start_time: new Date().toISOString(),
      distance_km: rec.estimated_distance_km,
      flight_time_min: rec.estimated_duration_min,
      coverage_sqkm: 5.5,
      average_aqi: 168,
      area_polygon: rec.target_polygon
    };
    setActiveMission(newMission);
    setSelectedDroneId(rec.suggested_drone_id);
    setActiveTab('overview');
  };

  const currentDrone = drones.find((d) => d.id === selectedDroneId) || drones[0] || null;
  const unresolvedCount = alerts.filter((a) => !a.resolved).length;

  // 1. Website Landing View (Original Pulled Design)
  if (viewMode === 'website') {
    return (
      <div className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-sans selection:bg-[#B600A8]/30 selection:text-white relative">
        <HeroSection onLaunchPlatform={() => setViewMode('dashboard')} />
        <MarqueeSection />
        <AboutSection onLaunchPlatform={() => setViewMode('dashboard')} />
        <ServicesSection />
        <ProjectsSection onLaunchPlatform={() => setViewMode('dashboard')} />

        {/* Floating Quick-Launch Platform HUD */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#0A0D14]/90 backdrop-blur-xl border border-[#00F0FF]/30 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] animate-pulse" />
            <span className="text-xs font-mono text-gray-300">Live AI & VTOL Telemetry Active</span>
          </div>
          <button 
            onClick={() => setViewMode('dashboard')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#00FF9D] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            Launch Mission Control ⚡
          </button>
        </div>
      </div>
    );
  }

  // 2. Full Intelligence Platform View
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col selection:bg-[#00F0FF] selection:text-black">
      
      {/* Top Banner / Switch to Landing Website */}
      <div className="bg-[#0D111A] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs">
        <button
          onClick={() => setViewMode('website')}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer font-medium"
        >
          <span>← Back to FLUXX Website</span>
        </button>
        <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
          <span>ENVIRONMENTAL INTELLIGENCE PLATFORM v2.0 • LIVE MISSION CONTROL</span>
        </div>
      </div>

      {/* Header with Multi-Tenant & Drone Switcher */}
      <Header
        drones={drones}
        selectedDroneId={selectedDroneId}
        onSelectDrone={handleSelectDrone}
        isConnected={isConnected}
        weather={weather}
        organizations={organizations}
        selectedOrgId={selectedOrgId}
        onSelectOrg={handleSelectOrg}
        onOpenSimModal={() => setIsSimModalOpen(true)}
        audioAlertsEnabled={audioAlertsEnabled}
        onToggleAudio={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
      />

      {/* Primary Navigation Tabs with Global Modals */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unresolvedAlertsCount={unresolvedCount}
        onOpenScheduler={() => setIsSchedulerOpen(true)}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onOpenQualityScore={() => setIsQualityScoreOpen(true)}
        onOpenSDK={() => setIsSDKOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 lg:p-6 space-y-6">
        
        {/* Tab 1: Command Center */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FleetOverview
                drone={currentDrone}
                sensor={latestSensorReading}
                onEmergencyRTH={(id) => api.emergencyRTH(id)}
                onSetStatus={(id, st) => api.setDroneStatus(id, st)}
              />

              <SensorGauges
                reading={latestSensorReading}
                selectedMetric={selectedMetric}
                onSelectMetric={setSelectedMetric}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MapContainer
                  drones={drones}
                  selectedDroneId={selectedDroneId}
                  onSelectDrone={handleSelectDrone}
                  heatmapPoints={heatmapPoints}
                  currentLayer={currentHeatmapLayer}
                  onChangeLayer={setCurrentHeatmapLayer}
                  activeMission={activeMission}
                  multiSources={multiSources}
                  hotspots={hotspots}
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between">
                <CameraFeed
                  droneId={selectedDroneId}
                  detections={aiAnalysis?.detections || []}
                />
              </div>
            </div>

            <LiveCharts
              history={telemetryHistory}
              selectedMetric={selectedMetric}
              onSelectMetric={setSelectedMetric}
              timeRange={timeRange}
              onSelectTimeRange={setTimeRange}
            />
          </div>
        )}

        {/* Tab: Executive Command Suite */}
        {activeTab === 'executive' && (
          <ExecutiveDashboard />
        )}

        {/* Tab: Decision Intelligence Operational Coordinator */}
        {activeTab === 'decision_intelligence' && (
          <DecisionIntelligenceView />
        )}

        {/* Tab: Unified Environmental Knowledge Graph */}
        {activeTab === 'knowledge_graph' && (
          <KnowledgeGraphStudio />
        )}

        {/* Tab: Cross-Agency Mission Marketplace */}
        {activeTab === 'marketplace' && (
          <MissionMarketplace />
        )}

        {/* Tab: Extensible Sensor Plugins Studio */}
        {activeTab === 'plugins' && (
          <PluginStudio />
        )}

        {/* Tab: City / Environment Digital Twin Studio */}
        {activeTab === 'city_twin' && (
          <CityTwinStudio onDispatchDrone={handleDispatchPlumeIntercept} />
        )}

        {/* Tab: Explainable AI & Environmental Risk Index (ERI) */}
        {activeTab === 'intelligence' && (
          <ExplainableAIView onDispatchMission={handleAcceptAIRecommendation} />
        )}

        {/* Tab: Regulatory Agency Hub (PCB, Forest, Municipal, Disaster) */}
        {activeTab === 'regulatory' && (
          <RegulatoryHub />
        )}

        {/* Tab: 4D Historical Playback Timeline */}
        {activeTab === 'playback' && (
          <HistoricalPlayback />
        )}

        {/* Tab: Drone Digital Twin Physics Studio */}
        {activeTab === 'digital_twin' && (
          <DigitalTwinStudio droneId={selectedDroneId} />
        )}

        {/* Tab: Geospatial Heatmaps Full View */}
        {activeTab === 'heatmaps' && (
          <div className="space-y-6">
            <MapContainer
              drones={drones}
              selectedDroneId={selectedDroneId}
              onSelectDrone={handleSelectDrone}
              heatmapPoints={heatmapPoints}
              currentLayer={currentHeatmapLayer}
              onChangeLayer={setCurrentHeatmapLayer}
              activeMission={activeMission}
              multiSources={multiSources}
              hotspots={hotspots}
            />
            <SensorGauges
              reading={latestSensorReading}
              selectedMetric={selectedMetric}
              onSelectMetric={setSelectedMetric}
            />
          </div>
        )}

        {/* Tab: Mission Planner */}
        {activeTab === 'missions' && (
          <MissionPlanner
            drones={drones}
            selectedDroneId={selectedDroneId}
            onMissionCreated={(m) => {
              setActiveMission(m);
              setActiveTab('overview');
            }}
          />
        )}

        {/* Tab: Incident Collaboration & Operator Annotations */}
        {activeTab === 'collaboration' && (
          <IncidentTracker />
        )}

        {/* Tab: Fleet Diagnostics */}
        {activeTab === 'fleet' && (
          <FleetDiagnostics />
        )}

        {/* Tab: Compliance Audit Report */}
        {activeTab === 'reports' && (
          <AuditReportView />
        )}

        {/* Tab: Alert Center */}
        {activeTab === 'alerts' && (
          <AlertCenter
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
          />
        )}

      </main>

      {/* Anomaly & Stress Simulator Modal */}
      <SimulatorModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        droneId={selectedDroneId}
      />

      {/* Autonomous Recurring Mission Scheduler Modal */}
      <SchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />

      {/* Enterprise Scalability Architecture Roadmap Modal */}
      <RoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      {/* Mission Intelligence Quality & Provenance Score Modal */}
      <MissionQualityScoreModal
        isOpen={isQualityScoreOpen}
        onClose={() => setIsQualityScoreOpen(false)}
        missionId={activeMission?.id || 'MSN-2041'}
      />

      {/* Developer SDK & API Workbench Modal */}
      <DeveloperSDKModal
        isOpen={isSDKOpen}
        onClose={() => setIsSDKOpen(false)}
      />

    </div>
  );
};

export default App;
