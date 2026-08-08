import { 
  DroneState, 
  SensorReading, 
  HeatmapPoint, 
  HeatmapLayerType, 
  Mission, 
  AIAnalysis, 
  Alert, 
  WeatherData, 
  DigitalTwinState, 
  PreFlightSimulationResult, 
  MultiSourceData, 
  OrganizationInfo, 
  FleetSummary, 
  FleetDroneItem, 
  CityTopology, 
  CitySimulationResult, 
  ExplainableEvent, 
  ERICoComposite, 
  AIMissionRecommendation, 
  MissionSchedule, 
  IncidentAnnotation, 
  RegulatoryDashboardData, 
  PlaybackTimelineSlice, 
  ComplianceReport, 
  DecisionPlan, 
  KnowledgeGraphData, 
  KnowledgeQueryResult, 
  MissionQualityScore, 
  MarketplaceMissionItem, 
  PluginModule, 
  DeveloperSDKSpy 
} from '../types';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  // Drones
  async getDrones(): Promise<DroneState[]> {
    const res = await fetch(`${API_BASE}/drone`);
    if (!res.ok) throw new Error('Failed to fetch drones');
    return res.json();
  },

  async getDrone(id: string): Promise<DroneState> {
    const res = await fetch(`${API_BASE}/drone/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch drone ${id}`);
    return res.json();
  },

  async setDroneStatus(id: string, status: string): Promise<DroneState> {
    const res = await fetch(`${API_BASE}/drone/${id}/status?status=${status}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to set drone status');
    return res.json();
  },

  // Telemetry
  async getLatestTelemetry(droneId: string = 'VTOL-001'): Promise<SensorReading> {
    const res = await fetch(`${API_BASE}/telemetry/latest?drone_id=${droneId}`);
    if (!res.ok) throw new Error('Failed to fetch latest telemetry');
    return res.json();
  },

  async getTelemetryHistory(droneId: string = 'VTOL-001', range: string = '1h'): Promise<SensorReading[]> {
    const res = await fetch(`${API_BASE}/telemetry/history?drone_id=${droneId}&range=${range}`);
    if (!res.ok) throw new Error('Failed to fetch telemetry history');
    return res.json();
  },

  // Heatmaps
  async getHeatmapPoints(layer: HeatmapLayerType | string = 'aqi'): Promise<{ layer: string; count: number; points: HeatmapPoint[] }> {
    const res = await fetch(`${API_BASE}/heatmap?layer=${layer}`);
    if (!res.ok) throw new Error('Failed to fetch heatmap points');
    return res.json();
  },

  // Missions
  async getMissions(): Promise<Mission[]> {
    const res = await fetch(`${API_BASE}/mission`);
    if (!res.ok) throw new Error('Failed to fetch missions');
    return res.json();
  },

  async getActiveMissions(): Promise<Mission[]> {
    const res = await fetch(`${API_BASE}/mission/active`);
    if (!res.ok) throw new Error('Failed to fetch active missions');
    return res.json();
  },

  async createMission(missionData: any): Promise<Mission> {
    const res = await fetch(`${API_BASE}/mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(missionData)
    });
    if (!res.ok) throw new Error('Failed to create mission');
    return res.json();
  },

  async abortMission(missionId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/mission/${missionId}/abort`, {
      method: 'POST'
    });
    if (!res.ok) {
      // Fallback
      return { status: 'ABORTED', mission_id: missionId };
    }
    return res.json();
  },

  async generateSurveyWaypoints(payload: {
    polygon: number[][];
    altitude?: number;
    spacing?: number;
    spacing_meters?: number;
    drone_id?: string;
    name?: string;
    angle?: number;
  }): Promise<{ waypoints: any[]; distance_km: number; estimated_time_min: number; flight_time_min?: number }> {
    const res = await fetch(`${API_BASE}/mission/generate-waypoints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate waypoints');
    const data = await res.json();
    return {
      ...data,
      flight_time_min: data.flight_time_min || data.estimated_time_min || 15
    };
  },

  async generateMissionGrid(payload: {
    polygon: number[][];
    altitude?: number;
    spacing?: number;
    spacing_meters?: number;
    drone_id?: string;
    name?: string;
    angle?: number;
  }): Promise<{ waypoints: any[]; distance_km: number; estimated_time_min: number; flight_time_min?: number }> {
    return this.generateSurveyWaypoints(payload);
  },

  // AI & Dispersion
  async getAIPrediction(droneId: string = 'VTOL-001'): Promise<AIAnalysis> {
    const res = await fetch(`${API_BASE}/ai/prediction/${droneId}`);
    if (!res.ok) throw new Error('Failed to fetch AI prediction');
    return res.json();
  },

  async getAIHotspots(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/ai/hotspots`);
    if (!res.ok) throw new Error('Failed to fetch hotspots');
    return res.json();
  },

  async getPlumeDispersion(droneId: string = 'VTOL-001'): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/plume-dispersion/${droneId}`);
    if (!res.ok) throw new Error('Failed to fetch plume dispersion');
    return res.json();
  },

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async resolveAlert(alertId: string): Promise<Alert> {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  },

  // Weather
  async getWeather(): Promise<WeatherData> {
    const res = await fetch(`${API_BASE}/weather`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
  },

  // Reports
  async getComplianceReport(filter: string = 'ALL'): Promise<ComplianceReport> {
    const res = await fetch(`${API_BASE}/reports/compliance?filter=${filter}`);
    if (!res.ok) throw new Error('Failed to fetch compliance report');
    return res.json();
  },

  // Digital Twin
  async getDigitalTwin(droneId: string = 'VTOL-001'): Promise<DigitalTwinState> {
    const res = await fetch(`${API_BASE}/digital-twin/${droneId}`);
    if (!res.ok) throw new Error('Failed to fetch digital twin');
    return res.json();
  },

  async simulatePreFlightMission(payload: {
    drone_id: string;
    distance_km: number;
    planned_altitude: number;
    wind_speed: number;
    payload_weight_kg?: number;
  }): Promise<PreFlightSimulationResult> {
    const res = await fetch(`${API_BASE}/digital-twin/simulate-mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to simulate pre-flight mission');
    return res.json();
  },

  // Multi-Source Fusion
  async getMultiSourceData(): Promise<MultiSourceData> {
    const res = await fetch(`${API_BASE}/sources`);
    if (!res.ok) throw new Error('Failed to fetch multi-source data');
    return res.json();
  },

  // Fleet Diagnostics
  async getFleetSummary(): Promise<FleetSummary> {
    const res = await fetch(`${API_BASE}/fleet/summary`);
    if (!res.ok) throw new Error('Failed to fetch fleet diagnostics');
    return res.json();
  },

  // Organizations
  async getOrganizations(): Promise<OrganizationInfo[]> {
    const res = await fetch(`${API_BASE}/organizations`);
    if (!res.ok) throw new Error('Failed to fetch organizations');
    return res.json();
  },

  // Simulator Control
  async injectSpike(droneId: string = 'VTOL-001'): Promise<any> {
    const res = await fetch(`${API_BASE}/simulator/inject-spike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drone_id: droneId })
    });
    return res.json();
  },

  async emergencyRTH(droneId: string = 'VTOL-001'): Promise<any> {
    const res = await fetch(`${API_BASE}/simulator/emergency-rth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drone_id: droneId })
    });
    return res.json();
  },

  async setWind(speed: number, direction: number = 210): Promise<any> {
    const res = await fetch(`${API_BASE}/simulator/set-wind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed, direction })
    });
    return res.json();
  },

  // City / Environment Digital Twin
  async getCityTopology(): Promise<CityTopology> {
    const res = await fetch(`${API_BASE}/city-twin/topology`);
    if (!res.ok) throw new Error('Failed to fetch city topology');
    return res.json();
  },

  async simulateCityWhatIf(payload: {
    source_id: string;
    emission_delta_percent: number;
    wind_speed_ms: number;
    wind_direction_deg: number;
    temperature_c?: number;
    inversion_layer_height_m?: number;
  }): Promise<CitySimulationResult> {
    const res = await fetch(`${API_BASE}/city-twin/simulate-what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to run city what-if simulation');
    return res.json();
  },

  // Environmental Intelligence & Explainable AI
  async getExplainableEvent(droneId: string = 'VTOL-001'): Promise<ExplainableEvent> {
    const res = await fetch(`${API_BASE}/intelligence/event?drone_id=${droneId}`);
    if (!res.ok) throw new Error('Failed to fetch explainable event');
    return res.json();
  },

  async getCompositeERI(droneId: string = 'VTOL-001'): Promise<ERICoComposite> {
    const res = await fetch(`${API_BASE}/intelligence/eri?drone_id=${droneId}`);
    if (!res.ok) throw new Error('Failed to fetch composite ERI');
    return res.json();
  },

  async getMissionRecommendations(): Promise<AIMissionRecommendation[]> {
    const res = await fetch(`${API_BASE}/intelligence/mission-recommendations`);
    if (!res.ok) throw new Error('Failed to fetch mission recommendations');
    return res.json();
  },

  // Autonomous Mission Scheduler
  async getSchedules(): Promise<MissionSchedule[]> {
    const res = await fetch(`${API_BASE}/scheduler/list`);
    if (!res.ok) throw new Error('Failed to fetch schedules');
    return res.json();
  },

  async toggleSchedule(scheduleId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/scheduler/toggle/${scheduleId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle schedule');
    return res.json();
  },

  async createSchedule(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/scheduler/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create schedule');
    return res.json();
  },

  // Collaboration & Incident Annotations
  async getAnnotations(): Promise<IncidentAnnotation[]> {
    const res = await fetch(`${API_BASE}/collaboration/annotations`);
    if (!res.ok) throw new Error('Failed to fetch annotations');
    return res.json();
  },

  async createAnnotation(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/collaboration/annotations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create annotation');
    return res.json();
  },

  async updateAnnotationStatus(noteId: string, newStatus: string): Promise<any> {
    const res = await fetch(`${API_BASE}/collaboration/annotations/status/${noteId}?new_status=${newStatus}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Regulatory Agency Dashboards
  async getRegulatoryDashboard(role: string = 'PCB'): Promise<RegulatoryDashboardData> {
    const res = await fetch(`${API_BASE}/regulatory/dashboard/${role}`);
    if (!res.ok) throw new Error('Failed to fetch regulatory dashboard');
    return res.json();
  },

  // Historical 4D Playback Timeline
  async getPlaybackTimeline(): Promise<PlaybackTimelineSlice[]> {
    const res = await fetch(`${API_BASE}/playback/timeline`);
    if (!res.ok) throw new Error('Failed to fetch playback timeline');
    return res.json();
  },

  // Decision Intelligence Operational Coordinator
  async getDecisionPlan(): Promise<DecisionPlan> {
    const res = await fetch(`${API_BASE}/decision-intelligence/plan`);
    if (!res.ok) throw new Error('Failed to fetch decision plan');
    return res.json();
  },

  async executeDecisionChain(planId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/decision-intelligence/execute-chain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId })
    });
    if (!res.ok) throw new Error('Failed to execute decision chain');
    return res.json();
  },

  async resetDecisionPlan(planId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/decision-intelligence/reset/${planId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset decision plan');
    return res.json();
  },

  // Unified Environmental Knowledge Graph
  async getKnowledgeGraph(): Promise<KnowledgeGraphData> {
    const res = await fetch(`${API_BASE}/knowledge-graph/graph`);
    if (!res.ok) throw new Error('Failed to fetch knowledge graph');
    return res.json();
  },

  async queryKnowledgeGraph(queryId: string = 'schools_near_emissions'): Promise<KnowledgeQueryResult> {
    const res = await fetch(`${API_BASE}/knowledge-graph/query?query_id=${queryId}`);
    if (!res.ok) throw new Error('Failed to query knowledge graph');
    return res.json();
  },

  // Mission Quality Scoring & Provenance
  async getMissionQualityScore(missionId: string = 'MSN-2041'): Promise<MissionQualityScore> {
    const res = await fetch(`${API_BASE}/mission-intelligence/score/${missionId}`);
    if (!res.ok) throw new Error('Failed to fetch mission quality score');
    return res.json();
  },

  // Cross-Agency Mission Marketplace
  async getMarketplaceMissions(): Promise<MarketplaceMissionItem[]> {
    const res = await fetch(`${API_BASE}/marketplace/missions`);
    if (!res.ok) throw new Error('Failed to fetch marketplace missions');
    return res.json();
  },

  async claimMarketplaceMission(missionId: string, droneId: string = 'VTOL-001'): Promise<any> {
    const res = await fetch(`${API_BASE}/marketplace/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mission_id: missionId, drone_id: droneId })
    });
    if (!res.ok) throw new Error('Failed to claim marketplace mission');
    return res.json();
  },

  // Extensible Plugins Registry
  async getPluginRegistry(): Promise<PluginModule[]> {
    const res = await fetch(`${API_BASE}/plugins/registry`);
    if (!res.ok) throw new Error('Failed to fetch plugins');
    return res.json();
  },

  async togglePlugin(pluginId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/plugins/toggle/${pluginId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to toggle plugin');
    return res.json();
  },

  // Developer SDK Specs
  async getSDKSpy(): Promise<DeveloperSDKSpy> {
    const res = await fetch(`${API_BASE}/sdk/specs`);
    if (!res.ok) throw new Error('Failed to fetch SDK specs');
    return res.json();
  }
};
