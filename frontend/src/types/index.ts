export interface DroneState {
  id: string;
  serial_number: string;
  model: string;
  firmware: string;
  status: 'ACTIVE' | 'IDLE' | 'CHARGING' | 'RETURNING' | 'OFFLINE' | 'RTH' | 'EMERGENCY' | 'MAINTENANCE';
  battery: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  signal_strength: number;
  current_mission_id?: string;
  last_seen: string;
  name?: string;
}

export interface SensorReading {
  id?: number;
  drone_id: string;
  mission_id?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude: number;
  battery: number;
  aqi: number;
  pm25: number;
  pm10: number;
  co2: number;
  voc: number;
  ozone: number;
  methane: number;
  temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  uv_index: number;
  noise_level: number;
  confidence_score?: number;
  provenance_source?: string;
}

export type HeatmapLayerType = 
  | 'aqi' 
  | 'pm25' 
  | 'pm10' 
  | 'co2' 
  | 'voc' 
  | 'temp' 
  | 'humidity' 
  | 'wind' 
  | 'noise' 
  | 'ozone' 
  | 'methane'
  | 'industrial_risk'
  | 'fire_risk'
  | 'crop_stress'
  | 'carbon_footprint';

export interface HeatmapPoint {
  lat: number;
  lng: number;
  val: number;
  weight?: number;
  layer: HeatmapLayerType | string;
  pm25?: number;
  pm10?: number;
  co2?: number;
  voc?: number;
  temp?: number;
  wind?: number;
  ozone?: number;
  methane?: number;
  noise?: number;
  timestamp?: string;
}

export interface Waypoint {
  lat: number;
  lng: number;
  alt: number;
  action: 'TAKEOFF' | 'WAYPOINT' | 'SURVEY' | 'HOVER' | 'LAND' | 'RTH';
  speed: number;
}

export interface Mission {
  id: string;
  drone_id?: string;
  name: string;
  type: string;
  status: 'PENDING' | 'UPLOADING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED' | 'RETURNING';
  area_name: string;
  area_polygon?: number[][];
  waypoints?: Waypoint[];
  start_time: string;
  end_time?: string;
  distance_km: number;
  flight_time_min: number;
  coverage_sqkm: number;
  average_aqi: number;
}

export interface DetectionObject {
  id: string;
  label: string;
  confidence: number;
  bbox: number[];
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
  area_m2?: number;
}

export interface HourlyForecastItem {
  hour: string;
  predicted_aqi: number;
  confidence_lower: number;
  confidence_upper: number;
}

export interface AIAnalysis {
  current_aqi: number;
  prediction_30m: number;
  prediction_1h: number;
  prediction_6h: number;
  prediction_24h: number;
  confidence_score: number;
  atmospheric_risk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  risk_level: string;
  pollution_type: string;
  source_hypothesis: string;
  recommendation: string;
  suggested_actions: string[];
  detections: DetectionObject[];
  hourly_timeline?: HourlyForecastItem[];
}

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';

export interface Alert {
  id: string;
  drone_id?: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  metric_name?: string;
  metric_value?: number;
  threshold_value?: number;
  timestamp: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  rain_probability: number;
  uv_index: number;
  condition: string;
  visibility_km?: number;
  dew_point?: number;
  sunrise: string;
  sunset: string;
}

export interface DigitalTwinState {
  id: string;
  drone_id: string;
  name: string;
  battery_soh: number;
  battery_cycles: number;
  battery_temp: number;
  motor1_temp: number;
  motor2_temp: number;
  motor3_temp: number;
  motor4_temp: number;
  esc_temp: number;
  vibration_level: number;
  compass_health: number;
  servo_wear: number;
  failure_risk_score: number;
  flight_hours_total: number;
  last_calibration: string;
  simulated_burn_rate: number;
  firmware_version: string;
  synced_at?: string;
}

export interface PreFlightSimulationResult {
  drone_id: string;
  drone_name: string;
  simulation_timestamp: string;
  inputs: {
    distance_km: number;
    planned_altitude_m: number;
    wind_speed_ms: number;
    payload_weight_kg: number;
  };
  twin_metrics: {
    battery_soh: number;
    failure_risk_score: number;
    vibration_nominal_g: number;
  };
  predicted_metrics: {
    flight_duration_min: number;
    predicted_battery_drain_percent: number;
    estimated_landing_battery: number;
    effective_burn_rate_pct_min: number;
    max_wind_resistance_ms: number;
  };
  feasibility: 'OPTIMAL' | 'MODERATE_RISK' | 'HIGH_RISK';
  ai_recommendation: string;
  energy_profile_curve: { min: number; battery: number }[];
}

export interface OrganizationInfo {
  id: string;
  name: string;
  code: string;
  domain: string;
  region: string;
  active_drones: number;
  active_missions: number;
  clearance_level: string;
}

export interface FleetDroneItem {
  id: string;
  name: string;
  serial: string;
  status: string;
  health_status: string;
  health_score: number;
  flight_hours: number;
  missions_completed: number;
  battery_health: number;
  firmware: string;
  assigned_operator: string;
  assigned_org: string;
  maintenance_due_in_hours: number;
  hardware_diagnostics: {
    motors_status?: string;
    motor_health?: number;
    battery_status?: string;
    imu_status?: string;
    sensors_status?: string;
    vibration_status?: string;
    esc_thermals?: string;
    vibration_rms?: string;
    gps_hdop?: string;
  };
}

export interface FleetSummary {
  total_drones: number;
  active_drones: number;
  active_airborne?: number;
  charging_docked?: number;
  under_maintenance?: number;
  in_mission_drones: number;
  maintenance_required: number;
  average_fleet_health_score: number;
  fleet_average_health?: number;
  total_fleet_flight_hours?: number;
  fleet_readiness_status: string;
  drones: FleetDroneItem[];
}

export interface MultiSourceData {
  drones_active_count: number;
  ground_stations_count: number;
  satellite_coverage_percent: number;
  cpcb_stations_count: number;
  total_data_points_ingested_per_min: number;
  fusion_confidence_percent: number;
  layer_contributions: {
    vtol_drones: number;
    ground_iot: number;
    regulatory_cpcb: number;
    sentinel5p_satellite: number;
    industrial_cems: number;
  };
  ground_stations?: { id: string; name: string; type?: string; lat: number; lng: number; aqi: number; pm25: number; status: string }[];
  government_reference_stations?: { id: string; name: string; agency: string; lat: number; lng: number; aqi: number; certified: boolean }[];
  industrial_point_sources?: { id: string; name: string; type: string; primary_gas?: string; risk?: string; lat: number; lng: number; emission_rate: string; status: string }[];
}

// City Digital Twin Interfaces
export interface CityTopology {
  city_name: string;
  bounds: { north: number; south: number; east: number; west: number };
  center: { lat: number; lng: number };
  emission_sources: {
    id: string;
    name: string;
    type: string;
    category?: string;
    lat: number;
    lng: number;
    stack_height_m: number;
    base_emission_rate_g_s: number;
    pollutants: string[];
    risk_level: string;
  }[];
  wards: {
    id: string;
    name: string;
    polygon: number[][];
    population: number;
    vulnerable_population: number;
    base_aqi: number;
  }[];
}

export interface CitySimulationResult {
  simulation_id: string;
  timestamp: string;
  source_id: string;
  emission_delta_percent: number;
  effective_stack_height_m?: number;
  plume_rise_m?: number;
  macro_exposure_impact?: {
    total_affected_population: number;
    vulnerable_demographics_count: number;
    residential_wards_exceeded_threshold: number;
    peak_plume_ground_aqi_surge?: number;
  };
  atmospheric_conditions?: {
    plume_travel_bearing_deg?: number;
    effective_wind_speed_ms?: number;
  };
  ward_impacts: {
    ward_id: string;
    ward_name: string;
    distance_from_source_km?: number;
    baseline_aqi?: number;
    projected_aqi: number;
    delta_aqi?: number;
    predicted_aqi_increase?: number;
    exposure_severity?: string;
    peak_ground_concentration_ug_m3?: number;
    risk_classification?: string;
    affected_population: number;
    vulnerable_demographics?: number;
  }[];
  gaussian_plume_field?: {
    lat: number;
    lng: number;
    concentration_ug_m3: number;
    aqi_impact: number;
  }[];
  plume_contours?: {
    distance_km?: number;
    center_lat?: number;
    center_lng?: number;
    estimated_arrival_minutes?: number;
    mean_concentration_voc_ppb?: number;
    concentration_threshold?: string;
    max_downwind_distance_km?: number;
    crosswind_spread_km?: number;
    polygon?: number[][];
  }[];
  tactical_mitigations: string[];
}

export type WhatIfSimulationResult = CitySimulationResult;

export interface ERICoComposite {
  composite_score?: number;
  eri_score?: number;
  risk_tier?: string;
  category?: string;
  status: string;
  advisory?: string;
  component_breakdown?: {
    aqi_contribution: number;
    pm25_contribution: number;
    voc_contribution: number;
    ozone_contribution: number;
    thermal_contribution: number;
    wind_contribution: number;
    acoustic_contribution: number;
  };
  pollutant_contributions?: {
    aqi_contribution: number;
    voc_contribution: number;
    pm25_contribution: number;
    ozone_contribution: number;
    thermal_contribution: number;
    wind_contribution: number;
    acoustic_contribution: number;
  };
}

export interface ExplainableEvent {
  event_id: string;
  timestamp: string;
  target_drone_id: string;
  eri_composite: ERICoComposite;
  primary_cause: string;
  source_origin: string;
  confidence_score: number;
  confidence_level: string;
  affected_population: number;
  vulnerable_demographics_count: number;
  predicted_duration: string;
  dispersion_trajectory: {
    wind_drift_bearing: string;
    affected_radius_km: number;
    plume_velocity_kmh: number;
    eta_residential_ward: string;
  };
  explainable_ai_breakdown: {
    feature_importances: {
      sensor: string;
      importance_pct: number;
      value: string;
      statutory_limit: string;
      status: string;
    }[];
    model_architecture: string;
    model_assumptions: string[];
    uncertainty_margin_pct: number;
  };
  suggested_actions: {
    id: string;
    action: string;
    priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
    automated_executable: boolean;
    target_drone?: string;
    target_channel?: string;
  }[];
}

export interface AIMissionRecommendation {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  target_area_name: string;
  suggested_drone_id: string;
  recommended_survey_type: string;
  confidence_score: number;
  ai_reasoning: string;
  estimated_distance_km: number;
  estimated_duration_min: number;
  target_polygon: number[][];
  recommended_altitude_m: number;
  recommended_spacing_m: number;
  expected_resource_drain_battery_pct: number;
}

export interface MissionSchedule {
  id: string;
  title: string;
  frequency: string;
  cron_expression: string;
  target_area: string;
  drone_assigned: string;
  survey_type: string;
  status: 'ACTIVE' | 'PAUSED';
  next_run: string;
  last_run_status: string;
  coverage_area_sqkm: number;
  auto_dispatch: boolean;
}

export interface IncidentAnnotation {
  id: string;
  incident_id: string;
  author: string;
  role: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  area_name: string;
  title: string;
  notes: string;
  assigned_to: string;
  status: 'OPEN' | 'INVESTIGATING' | 'ACTION_TAKEN' | 'RESOLVED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RegulatoryDashboardData {
  agency_title: string;
  kpis: { label: string; value: string; status: string; alert?: boolean }[];
  active_violations: Record<string, any>[];
  actionable_tools: string[];
}

export interface PlaybackTimelineSlice {
  time_label: string;
  timestamp: string;
  summary: string;
  drones: {
    id: string;
    lat: number;
    lng: number;
    alt: number;
    battery: number;
    status: string;
    aqi: number;
    voc: number;
  }[];
  eri_composite: number;
  eri_status: string;
  plume_active: boolean;
  wind: { speed_ms: number; dir_deg: number };
}

export interface ComplianceReport {
  report_id: string;
  generated_at: string;
  reporting_period: string;
  jurisdiction: string;
  executive_summary: {
    compliance_grade?: string;
    compliance_status?: string;
    average_aqi?: number;
    peak_aqi?: number;
    total_telemetry_samples?: number;
    completed_missions_count?: number;
    overall_compliance_rate_percent?: number;
    total_missions_evaluated?: number;
    critical_violations_detected?: number;
    penalties_levied_inr?: string;
    statutory_defensibility_grade?: string;
  };
  gas_averages: {
    pm25_ug_m3: number;
    pm10_ug_m3: number;
    co2_ppm: number;
    voc_ppb: number;
  };
  regulatory_limits: {
    pm25_standard: string;
    pm10_standard: string;
    co2_standard: string;
    voc_standard: string;
  };
  major_violators?: {
    entity_name: string;
    industry_type: string;
    violation_count: number;
    peak_aqi_recorded: number;
    statutory_section: string;
    recommended_action: string;
  }[];
  ward_compliance?: {
    ward_name: string;
    average_aqi: number;
    exceedance_days: number;
    compliance_status: string;
  }[];
  ai_conclusions: string[];
}

// ----------------- Decision Intelligence Types -----------------
export interface DecisionActionItem {
  step: number;
  action_type: string;
  target: string;
  instruction: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  estimated_duration_sec: number;
  details: string;
  executed_at?: string;
}

export interface DecisionPlan {
  id: string;
  trigger_event_id: string;
  title: string;
  created_at: string;
  status: 'READY_FOR_EXECUTION' | 'EXECUTED_IN_FIELD';
  confidence_score: number;
  summary: string;
  actions: DecisionActionItem[];
  impact_mitigation: {
    estimated_exposure_reduction_pct: number;
    prevented_vulnerable_exposures: number;
    economic_damage_averted_inr: string;
  };
  executed_at?: string;
}

// ----------------- Knowledge Graph Types -----------------
export interface KnowledgeNode {
  id: string;
  label: string;
  type: string;
  category?: string;
  lat?: number;
  lng?: number;
  risk_tier?: string;
  peak_aqi?: number;
  students?: number;
  beds?: number;
  population?: number;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relation: string;
  confidence: number;
  label: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  summary: {
    total_entities: number;
    total_relationships: number;
    threatened_schools_count: number;
    threatened_hospitals_count: number;
    primary_culprit: string;
  };
}

export interface KnowledgeQueryResult {
  query_text: string;
  matched_sources: {
    source: string;
    emissions: string;
    peak_aqi?: number;
    distance_to_nearest_school?: string;
    violations_count?: number;
  }[];
  affected_schools: {
    name: string;
    distance: string;
    threat_level: string;
    exposure_hours: number;
  }[];
  graph_subgraph_nodes: string[];
  statutory_recommendation: string;
}

// ----------------- Mission Quality Scoring Types -----------------
export interface MissionQualityScore {
  mission_id: string;
  overall_quality_score: number;
  quality_tier: string;
  statutory_acceptance_status: string;
  component_scores: {
    metric: string;
    score: number;
    weight_pct: number;
    status: string;
    details: string;
  }[];
  data_provenance: {
    airframe_serial: string;
    firmware_version: string;
    calibration_standard: string;
    last_calibration_timestamp: string;
    sensor_accuracy: string;
    cryptographic_seal: string;
    multi_source_confidence_index: number;
  };
}

// ----------------- Marketplace Types -----------------
export interface MarketplaceMissionItem {
  id: string;
  publishing_agency: string;
  agency_code: string;
  title: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reward_credits: number;
  target_area: string;
  required_payload: string;
  estimated_flight_min: number;
  coverage_km2: number;
  status: 'OPEN' | 'CLAIMED' | 'DISPATCHED';
  claimed_by_drone: string | null;
  description: string;
}

// ----------------- Plugin Architecture Types -----------------
export interface PluginModule {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'ACTIVE' | 'INACTIVE' | 'STANDBY';
  author: string;
  channels: string[];
  algorithm: string;
  description: string;
}

// ----------------- Developer SDK Types -----------------
export interface DeveloperSDKSpy {
  version: string;
  documentation_url: string;
  supported_languages: string[];
  code_examples: {
    python: string;
    typescript: string;
    curl: string;
  };
  sdk_packages: {
    name: string;
    version: string;
    downloads: string;
  }[];
}
