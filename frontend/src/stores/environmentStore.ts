/**
 * FLUXX Environmental Global Reactive Store
 * Single source of truth for normalized sensor readings, rolling history, replay controls & AI anomalies.
 */

import { useState, useEffect } from 'react';
import {
  NormalizedReading,
  ReplayStatus,
  AnomalyEvent,
  EnvironmentalRiskIndex
} from '../types/environment';

const API_BASE = 'http://localhost:8000/api';
const WS_URL = 'ws://localhost:8000/ws/live';

export type DataSourceType = 'LIVE HARDWARE' | 'DATA REPLAY' | 'SIMULATION';
export type PrimarySection = 'overview' | 'environment' | 'missions' | 'intelligence' | 'reports';
export type MapEngineType = 'google_3d' | 'maplibre_twin';

interface EnvironmentState {
  currentReading: NormalizedReading;
  history: NormalizedReading[];
  allSamples: NormalizedReading[];
  replayStatus: ReplayStatus;
  eri: EnvironmentalRiskIndex;
  anomalies: AnomalyEvent[];
  selectedLayer: 'pm25' | 'pm10' | 'co2' | 'temperature' | 'humidity' | 'windSpeed';
  showSensors: boolean;
  showHeatmap: boolean;
  showPath: boolean;
  showConfidence: boolean;
  showWindField: boolean;
  showVTOL: boolean;
  presentationMode: boolean;
  activeSection: PrimarySection;
  connected: boolean;
  dataSourceType: DataSourceType;
  googleMapsApiKey: string;
  mapEngine: MapEngineType;
}

const defaultInitialReading: NormalizedReading = {
  sample: 1,
  total_samples: 50,
  timestamp: '2026-08-08T06:00:00Z',
  source: 'kharghar_csv',
  mode: 'replay',
  location: {
    latitude: 19.05028,
    longitude: 73.06907,
    elevation: 15.0
  },
  sensors: {
    pm25: 48.5,
    pm10: 77.3,
    co2: 558.8,
    temperature: 28.1,
    humidity: 80.1,
    windSpeed: 2.6,
    windDirection: 240.0,
    voc: 87.3
  }
};

const defaultInitialERI: EnvironmentalRiskIndex = {
  score: 64,
  level: 'MODERATE',
  primary_pollutant: 'PM2.5',
  recommendation: 'Acceptable baseline. Sensitive groups should exercise mild caution.',
  timestamp: '2026-08-08T06:00:00Z'
};

const defaultInitialStatus: ReplayStatus = {
  playing: false,
  status: 'PAUSED',
  speed: 1.0,
  currentSample: 1,
  totalSamples: 50,
  timestamp: '2026-08-08T06:00:00Z',
  source: 'kharghar_csv',
  mode: 'replay'
};

const storedKey = typeof window !== 'undefined' 
  ? (localStorage.getItem('fluxx_gmaps_key') || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDY1spcnvs42sKq9JT0lzcUPmgjKbUAfGI') 
  : 'AIzaSyDY1spcnvs42sKq9JT0lzcUPmgjKbUAfGI';

// Global Store State
let globalState: EnvironmentState = {
  currentReading: defaultInitialReading,
  history: [defaultInitialReading],
  allSamples: [],
  replayStatus: defaultInitialStatus,
  eri: defaultInitialERI,
  anomalies: [],
  selectedLayer: 'pm25',
  showSensors: true,
  showHeatmap: true,
  showPath: true,
  showConfidence: false,
  showWindField: false,
  showVTOL: true,
  presentationMode: false,
  activeSection: 'overview',
  connected: false,
  dataSourceType: 'DATA REPLAY',
  googleMapsApiKey: storedKey,
  mapEngine: 'google_3d'
};

const listeners = new Set<(state: EnvironmentState) => void>();

function notify() {
  listeners.forEach((listener) => listener(globalState));
}

// WebSocket Connection Management
let ws: WebSocket | null = null;
let reconnectTimer: any = null;

function computeSourceType(reading: NormalizedReading): DataSourceType {
  if (reading.source === 'esp32' || reading.source === 'live_serial') return 'LIVE HARDWARE';
  if (reading.source === 'kharghar_csv' || reading.mode === 'replay') return 'DATA REPLAY';
  return 'SIMULATION';
}

function initWebSocket() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      globalState = { ...globalState, connected: true };
      notify();
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const eventType = payload.type || payload.event;

        if (eventType === 'sensor_reading' && payload.data) {
          const reading = payload.data as NormalizedReading;
          
          // Append to rolling history
          const newHistory = [...globalState.history, reading];
          if (newHistory.length > 50) newHistory.shift();

          globalState = {
            ...globalState,
            currentReading: reading,
            history: newHistory,
            dataSourceType: computeSourceType(reading),
            replayStatus: {
              ...globalState.replayStatus,
              currentSample: reading.sample,
              timestamp: reading.timestamp
            },
            eri: reading.eri || globalState.eri
          };
          notify();
        } else if (eventType === 'eri_update' && payload.data) {
          globalState = { ...globalState, eri: payload.data };
          notify();
        } else if (eventType === 'alert' && payload.data) {
          const anomaly = payload.data as AnomalyEvent;
          if (!globalState.anomalies.some((a) => a.id === anomaly.id)) {
            globalState = {
              ...globalState,
              anomalies: [anomaly, ...globalState.anomalies.slice(0, 19)]
            };
            notify();
          }
        }
      } catch (err) {
        console.error('WS Parse Error:', err);
      }
    };

    ws.onclose = () => {
      globalState = { ...globalState, connected: false };
      notify();
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          initWebSocket();
        }, 2500);
      }
    };

    ws.onerror = () => {
      if (ws) ws.close();
    };
  } catch (err) {
    console.error('WebSocket Init Exception:', err);
  }
}

// Fetch all dataset samples initially for complete map rendering
async function fetchAllSamples() {
  try {
    const res = await fetch(`${API_BASE}/replay/samples`);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'SUCCESS' && Array.isArray(data.data)) {
        globalState = {
          ...globalState,
          allSamples: data.data
        };
        notify();
      }
    }
  } catch (err) {
    console.warn('Could not fetch dataset samples:', err);
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initWebSocket();
  fetchAllSamples();
}

export function useEnvironmentStore() {
  const [state, setState] = useState<EnvironmentState>(globalState);

  useEffect(() => {
    const listener = (nextState: EnvironmentState) => setState(nextState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Replay Control Actions
  const startReplay = async () => {
    try {
      await fetch(`${API_BASE}/replay/start`, { method: 'POST' });
      globalState = {
        ...globalState,
        replayStatus: { ...globalState.replayStatus, playing: true, status: 'PLAYING' }
      };
      notify();
    } catch (err) {
      console.error('Replay start error:', err);
    }
  };

  const pauseReplay = async () => {
    try {
      await fetch(`${API_BASE}/replay/pause`, { method: 'POST' });
      globalState = {
        ...globalState,
        replayStatus: { ...globalState.replayStatus, playing: false, status: 'PAUSED' }
      };
      notify();
    } catch (err) {
      console.error('Replay pause error:', err);
    }
  };

  const resetReplay = async () => {
    try {
      await fetch(`${API_BASE}/replay/reset`, { method: 'POST' });
      globalState = {
        ...globalState,
        replayStatus: { ...globalState.replayStatus, currentSample: 1, playing: false }
      };
      notify();
    } catch (err) {
      console.error('Replay reset error:', err);
    }
  };

  const setSpeed = async (speed: number) => {
    try {
      await fetch(`${API_BASE}/replay/speed?speed=${speed}`, { method: 'POST' });
      globalState = {
        ...globalState,
        replayStatus: { ...globalState.replayStatus, speed }
      };
      notify();
    } catch (err) {
      console.error('Replay speed error:', err);
    }
  };

  const seekSample = async (sampleIndex: number) => {
    try {
      await fetch(`${API_BASE}/replay/seek?sample_index=${sampleIndex}`, { method: 'POST' });
      const targetReading = globalState.allSamples[sampleIndex - 1];
      if (targetReading) {
        globalState = {
          ...globalState,
          currentReading: targetReading,
          replayStatus: { ...globalState.replayStatus, currentSample: sampleIndex }
        };
        notify();
      }
    } catch (err) {
      console.error('Replay seek error:', err);
    }
  };

  const setSelectedLayer = (layer: EnvironmentState['selectedLayer']) => {
    globalState = { ...globalState, selectedLayer: layer };
    notify();
  };

  const setShowSensors = (val: boolean) => {
    globalState = { ...globalState, showSensors: val };
    notify();
  };

  const setShowHeatmap = (val: boolean) => {
    globalState = { ...globalState, showHeatmap: val };
    notify();
  };

  const setShowPath = (val: boolean) => {
    globalState = { ...globalState, showPath: val };
    notify();
  };

  const setShowConfidence = (val: boolean) => {
    globalState = { ...globalState, showConfidence: val };
    notify();
  };

  const setShowWindField = (val: boolean) => {
    globalState = { ...globalState, showWindField: val };
    notify();
  };

  const setShowVTOL = (val: boolean) => {
    globalState = { ...globalState, showVTOL: val };
    notify();
  };

  const setPresentationMode = (val: boolean) => {
    globalState = { ...globalState, presentationMode: val };
    notify();
  };

  const setActiveSection = (section: PrimarySection) => {
    globalState = { ...globalState, activeSection: section };
    notify();
  };

  const setGoogleMapsApiKey = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fluxx_gmaps_key', key);
    }
    globalState = { ...globalState, googleMapsApiKey: key };
    notify();
  };

  const setMapEngine = (engine: MapEngineType) => {
    globalState = { ...globalState, mapEngine: engine };
    notify();
  };

  return {
    ...state,
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
    seekSample,
    setSelectedLayer,
    setShowSensors,
    setShowHeatmap,
    setShowPath,
    setShowConfidence,
    setShowWindField,
    setShowVTOL,
    setPresentationMode,
    setActiveSection,
    setGoogleMapsApiKey,
    setMapEngine
  };
}
