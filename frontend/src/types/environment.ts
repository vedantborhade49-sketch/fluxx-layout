/**
 * Standard FLUXX Environmental Data Contract & Types
 */

export type DataSource = 'kharghar_csv' | 'esp32_sensor' | 'vtol_telemetry' | 'hardware_node';
export type DataMode = 'replay' | 'live' | 'simulation';
export type ReplayStatusType = 'PAUSED' | 'PLAYING' | 'COMPLETED';

export interface EnvironmentalSensors {
  pm25: number;
  pm10: number;
  co2: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  voc?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  elevation?: number;
}

export interface EnvironmentalRiskIndex {
  score: number;
  level: 'GOOD' | 'MODERATE' | 'UNHEALTHY' | 'HAZARDOUS';
  primary_pollutant: string;
  recommendation?: string;
  sub_scores?: Record<string, number>;
  timestamp: string;
}

export interface NormalizedReading {
  sample: number;
  total_samples?: number;
  timestamp: string;
  source: DataSource | string;
  mode: DataMode | string;
  location: GeoLocation;
  sensors: EnvironmentalSensors;
  eri?: EnvironmentalRiskIndex;
}

export interface ReplayStatus {
  playing: boolean;
  status: ReplayStatusType | string;
  speed: number;
  currentSample: number;
  totalSamples: number;
  timestamp: string;
  source: string;
  mode: string;
}

export interface AnomalyEvent {
  id: string;
  sample: number;
  timestamp: string;
  type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  primary_indicator: string;
  baseline_value: number;
  observed_value: number;
  change_percent: number;
  supporting_indicators: string[];
  confidence: number;
  location: GeoLocation;
  source: string;
}
