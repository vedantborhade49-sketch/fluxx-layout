import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Plus, 
  Minus as MinusIcon, 
  Crosshair, 
  Compass, 
  Globe,
  Radio,
  MapPin,
  Plane,
  Eye,
  X
} from 'lucide-react';
import { useEnvironmentStore, MapEngineType } from '../stores/environmentStore';
import { NormalizedReading } from '../types/environment';

export const EarthMap: React.FC = () => {
  const {
    currentReading,
    history,
    allSamples,
    replayStatus,
    selectedLayer,
    setSelectedLayer,
    showSensors,
    setShowSensors,
    showHeatmap,
    setShowHeatmap,
    showPath,
    setShowPath,
    showConfidence,
    setShowConfidence,
    showWindField,
    setShowWindField,
    showVTOL,
    setShowVTOL,
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
    seekSample,
    googleMapsApiKey,
    setGoogleMapsApiKey,
    mapEngine,
    setMapEngine
  } = useEnvironmentStore();

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<NormalizedReading | null>(null);
  const [mapMode, setMapMode] = useState<'SATELLITE' | 'HYBRID'>('SATELLITE');
  const [cameraTilt, setCameraTilt] = useState<number>(45);
  const [cameraRange, setCameraRange] = useState<number>(1400);
  const [inputKey, setInputKey] = useState<string>(googleMapsApiKey);
  const [keyModalOpen, setKeyModalOpen] = useState<boolean>(false);

  const map3DContainerRef = useRef<HTMLDivElement>(null);
  const map3DRef = useRef<any>(null);

  // Kharghar Dataset Bounding Box & Center
  const bounds = useMemo(() => {
    if (!allSamples || allSamples.length === 0) {
      return {
        centerLat: 19.05028,
        centerLng: 73.06907,
        minLat: 19.048,
        maxLat: 19.053,
        minLng: 73.066,
        maxLng: 73.072
      };
    }

    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    allSamples.forEach((s) => {
      if (s.location.latitude < minLat) minLat = s.location.latitude;
      if (s.location.latitude > maxLat) maxLat = s.location.latitude;
      if (s.location.longitude < minLng) minLng = s.location.longitude;
      if (s.location.longitude > maxLng) maxLng = s.location.longitude;
    });

    return {
      centerLat: (minLat + maxLat) / 2,
      centerLng: (minLng + maxLng) / 2,
      minLat,
      maxLat,
      minLng,
      maxLng
    };
  }, [allSamples]);

  // Load Google Maps 3D Script Dynamically
  useEffect(() => {
    if (mapEngine !== 'google_3d') return;

    if (!googleMapsApiKey) {
      setMapLoaded(false);
      return;
    }

    setLoadError(null);

    const scriptId = 'google-maps-3d-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initMaps3D = async () => {
      try {
        if ((window as any).google?.maps?.importLibrary) {
          await (window as any).google.maps.importLibrary('maps3d');
          await (window as any).google.maps.importLibrary('marker');
        }
        setMapLoaded(true);
      } catch (err: any) {
        console.warn('Google 3D init exception:', err);
        setLoadError('Google 3D Maps element initialization requires valid Maps 3D Platform quota.');
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&v=alpha&libraries=maps3d,marker`;
      script.async = true;

      script.onload = () => {
        initMaps3D();
      };

      script.onerror = () => {
        setLoadError('Failed to load Google Maps JavaScript API. Please verify network and API key.');
      };

      document.head.appendChild(script);
    } else {
      initMaps3D();
    }
  }, [googleMapsApiKey, mapEngine]);

  // Mount and Update Google 3D Map Custom Web Component
  useEffect(() => {
    if (!mapLoaded || !map3DContainerRef.current || mapEngine !== 'google_3d') return;

    const container = map3DContainerRef.current;
    container.innerHTML = '';

    try {
      const map3d = document.createElement('gmp-map-3d') as any;
      map3d.center = { lat: bounds.centerLat, lng: bounds.centerLng, altitude: 1100 };
      map3d.heading = 20;
      map3d.tilt = cameraTilt;
      map3d.range = cameraRange;
      map3d.mode = mapMode;
      map3d.style.width = '100%';
      map3d.style.height = '100%';
      map3d.style.display = 'block';

      // 1. Survey Trajectory Line
      if (showPath && allSamples && allSamples.length > 0) {
        const polyline = document.createElement('gmp-polyline-3d') as any;
        polyline.coordinates = allSamples.map((s) => ({
          lat: s.location.latitude,
          lng: s.location.longitude,
          altitude: 10
        }));
        polyline.strokeColor = '#3dd6c6';
        polyline.strokeWidth = 2.5;
        polyline.altitudeMode = 'RELATIVE_TO_GROUND';
        map3d.appendChild(polyline);
      }

      // 2. 50 Real Measurement Points
      if (showSensors && allSamples && allSamples.length > 0) {
        allSamples.forEach((sample) => {
          const isCurrent = sample.sample === currentReading?.sample;
          const marker = document.createElement('gmp-marker-3d') as any;
          marker.position = {
            lat: sample.location.latitude,
            lng: sample.location.longitude,
            altitude: 12
          };
          marker.altitudeMode = 'RELATIVE_TO_GROUND';
          marker.label = isCurrent ? `● LIVE #${sample.sample}` : `#${sample.sample}`;
          marker.addEventListener('gmp-click', () => setSelectedSample(sample));
          map3d.appendChild(marker);
        });
      }

      // 3. 3D VTOL Model at Current Sample Position & Altitude
      if (showVTOL && currentReading?.location) {
        const model = document.createElement('gmp-model-3d') as any;
        model.position = {
          lat: currentReading.location.latitude,
          lng: currentReading.location.longitude,
          altitude: 42
        };
        model.altitudeMode = 'RELATIVE_TO_GROUND';
        model.src = '/models/Drone_FLUXX_Brand_V3.glb';
        model.scale = 3.5;
        model.orientation = { heading: 218, tilt: 0, roll: 0 };
        map3d.appendChild(model);
      }

      container.appendChild(map3d);
      map3DRef.current = map3d;
    } catch (err: any) {
      console.error('Google 3D creation error:', err);
    }
  }, [
    mapLoaded,
    bounds,
    showPath,
    showSensors,
    showVTOL,
    allSamples,
    currentReading?.sample,
    mapEngine
  ]);

  // Recenter Camera
  const handleRecenter = () => {
    if (map3DRef.current) {
      try {
        map3DRef.current.center = { lat: bounds.centerLat, lng: bounds.centerLng, altitude: 1100 };
        map3DRef.current.tilt = cameraTilt;
        map3DRef.current.range = cameraRange;
      } catch (err) {}
    }
  };

  // Zoom In / Out
  const handleZoom = (delta: number) => {
    const nextRange = Math.max(400, Math.min(6000, cameraRange + delta));
    setCameraRange(nextRange);
    if (map3DRef.current) {
      try {
        map3DRef.current.range = nextRange;
      } catch (err) {}
    }
  };

  // Toggle 3D / 2D (45° vs 0°)
  const handleToggle3D = () => {
    const nextTilt = cameraTilt === 45 ? 0 : 45;
    setCameraTilt(nextTilt);
    if (map3DRef.current) {
      try {
        map3DRef.current.tilt = nextTilt;
      } catch (err) {}
    }
  };

  // Toggle Satellite vs Hybrid
  const handleToggleMode = () => {
    const nextMode = mapMode === 'SATELLITE' ? 'HYBRID' : 'SATELLITE';
    setMapMode(nextMode);
    if (map3DRef.current) {
      try {
        map3DRef.current.mode = nextMode;
      } catch (err) {}
    }
  };

  // If MapEngine is set to MapLibre Twin or Google Maps API key has load errors, render MapLibre 3D Satellite Twin
  if (mapEngine === 'maplibre_twin' || !googleMapsApiKey || loadError) {
    return (
      <div className="relative w-full h-full flex flex-col">
        {/* Banner with Google 3D Switcher */}
        <div className="bg-[var(--surface-2)] border-b border-[var(--border)] px-4 py-2 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[var(--accent)] font-bold">● ENGINE:</span>
            <span className="font-bold text-[var(--text-primary)]">
              MapLibre Satellite Digital Twin (Fallback GIS)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setMapEngine('google_3d');
                setKeyModalOpen(true);
              }}
              className="px-3 py-1 rounded-lg bg-[var(--accent)] text-slate-950 font-bold hover:opacity-90 transition-all cursor-pointer flex items-center space-x-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Activate Google 3D Earth</span>
            </button>
          </div>
        </div>

        {/* Existing MapLibre Twin Map */}
        <div className="flex-1 w-full h-full min-h-[520px]">
          {mapEngine === 'maplibre_twin' && (
            <div className="absolute inset-0 z-0">
              {/* MapLibre placeholder */}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GOOGLE PHOTOREALISTIC 3D MAP RENDERER
  // -------------------------------------------------------------
  return (
    <div className="relative w-full h-full min-h-[540px] bg-[#06090E] overflow-hidden select-none">
      
      {/* 1. Google 3D Map Custom Element Container */}
      <div ref={map3DContainerRef} className="w-full h-full min-h-[540px] block" />

      {/* 2. Top-Left Camera Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1.5 pointer-events-auto">
        <button
          onClick={() => handleZoom(-300)}
          className="p-2 rounded-xl bg-[#080b10]/90 border border-[#26303a] text-slate-200 hover:text-white hover:border-[#3dd6c6] transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(300)}
          className="p-2 rounded-xl bg-[#080b10]/90 border border-[#26303a] text-slate-200 hover:text-white hover:border-[#3dd6c6] transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title="Zoom Out"
        >
          <MinusIcon className="w-4 h-4" />
        </button>

        <button
          onClick={handleRecenter}
          className="p-2 rounded-xl bg-[#080b10]/90 border border-[#26303a] text-slate-200 hover:text-white hover:border-[#3dd6c6] transition-all cursor-pointer backdrop-blur-md shadow-lg"
          title="Recenter Kharghar"
        >
          <Crosshair className="w-4 h-4 text-[#3dd6c6]" />
        </button>

        <button
          onClick={handleToggle3D}
          className="px-2 py-1.5 rounded-xl bg-[#080b10]/90 border border-[#26303a] text-[10px] font-mono font-bold text-slate-200 hover:text-white hover:border-[#3dd6c6] transition-all cursor-pointer backdrop-blur-md shadow-lg text-center"
          title="Toggle 3D / 2D Tilt"
        >
          {cameraTilt === 45 ? '3D' : '2D'}
        </button>

        <button
          onClick={handleToggleMode}
          className="px-2 py-1.5 rounded-xl bg-[#080b10]/90 border border-[#26303a] text-[10px] font-mono font-bold text-[#3dd6c6] hover:border-[#3dd6c6] transition-all cursor-pointer backdrop-blur-md shadow-lg text-center"
          title="Toggle Satellite / Hybrid"
        >
          {mapMode === 'SATELLITE' ? 'SAT' : 'HYB'}
        </button>
      </div>

      {/* 3. Floating Glass Panel (Environment Radios & Map Layers) */}
      <div className="absolute top-4 right-4 z-20 p-4 rounded-2xl border border-[#26303a] bg-[#080b10]/95 backdrop-blur-2xl text-xs space-y-3.5 shadow-2xl w-56 text-slate-100 pointer-events-auto">
        
        {/* Environment Radios */}
        <div>
          <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
            ENVIRONMENT
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            {[
              { id: 'pm25', label: 'PM2.5' },
              { id: 'pm10', label: 'PM10' },
              { id: 'co2', label: 'CO₂' },
              { id: 'temperature', label: 'Temperature' },
              { id: 'humidity', label: 'Humidity' },
              { id: 'windSpeed', label: 'Wind' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedLayer(p.id as any)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedLayer === p.id
                    ? 'bg-[#3dd6c6]/20 text-[#3dd6c6] font-bold border border-[#3dd6c6]/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[10px] text-slate-400">
                  {(currentReading.sensors as any)[p.id]?.toFixed?.(1) ?? '--'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Map Overlays */}
        <div className="border-t border-[#26303a] pt-3">
          <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
            OVERLAYS
          </div>
          <div className="space-y-1.5 text-[11px] font-mono">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Sensors</span>
              <input
                type="checkbox"
                checked={showSensors}
                onChange={(e) => setShowSensors(e.target.checked)}
                className="rounded accent-[#3dd6c6]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Heatmap</span>
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="rounded accent-[#3dd6c6]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Survey path</span>
              <input
                type="checkbox"
                checked={showPath}
                onChange={(e) => setShowPath(e.target.checked)}
                className="rounded accent-[#3dd6c6]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Confidence</span>
              <input
                type="checkbox"
                checked={showConfidence}
                onChange={(e) => setShowConfidence(e.target.checked)}
                className="rounded accent-[#3dd6c6]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">3D VTOL</span>
              <input
                type="checkbox"
                checked={showVTOL}
                onChange={(e) => setShowVTOL(e.target.checked)}
                className="rounded accent-[#3dd6c6]"
              />
            </label>
          </div>
        </div>

      </div>

      {/* 4. Bottom 4D Replay Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 px-4 py-2.5 rounded-2xl border border-[#26303a] bg-[#080b10]/95 backdrop-blur-2xl text-xs flex flex-wrap items-center justify-between gap-3 text-slate-200 shadow-2xl pointer-events-auto">
        
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          {replayStatus.playing ? (
            <button
              onClick={pauseReplay}
              className="p-2 rounded-xl bg-[#3dd6c6] text-slate-950 hover:bg-[#3dd6c6]/80 transition-all font-bold cursor-pointer"
              title="Pause Replay"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={startReplay}
              className="p-2 rounded-xl bg-[#3dd6c6] text-slate-950 hover:bg-[#3dd6c6]/80 transition-all font-bold cursor-pointer"
              title="Play Replay"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            onClick={resetReplay}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Reset to Sample 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Multipliers */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 font-mono text-[10px]">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  replayStatus.speed === spd
                    ? 'bg-[#3dd6c6] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 min-w-[200px] flex items-center space-x-3">
          <input
            type="range"
            min={1}
            max={replayStatus.totalSamples || 50}
            value={currentReading?.sample || 1}
            onChange={(e) => seekSample(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3dd6c6]"
          />
          <span className="text-[11px] font-mono text-slate-400 shrink-0 font-bold">
            #{currentReading?.sample || 1} / {replayStatus.totalSamples || 50}
          </span>
        </div>

        {/* Observation Coordinates Badge */}
        <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-[#3dd6c6]" />
          <span>{currentReading?.location.latitude.toFixed(5)}°N, {currentReading?.location.longitude.toFixed(5)}°E</span>
        </div>

      </div>

      {/* 5. Clicked Sample Inspector Drawer */}
      {selectedSample && (
        <div className="absolute left-4 bottom-20 z-30 p-4 rounded-2xl border border-[#26303a] bg-[#080b10]/95 backdrop-blur-2xl text-xs space-y-2.5 shadow-2xl w-80 text-slate-100 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-[#26303a] pb-2">
            <span className="font-bold text-[var(--accent)] font-mono">
              OBSERVATION #{selectedSample.sample}
            </span>
            <button
              onClick={() => setSelectedSample(null)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>LATITUDE:</span>
              <span className="text-white">{selectedSample.location.latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>LONGITUDE:</span>
              <span className="text-white">{selectedSample.location.longitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PM2.5:</span>
              <span className="text-[#3dd6c6] font-bold">{selectedSample.sensors.pm25.toFixed(1)} µg/m³</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PM10:</span>
              <span className="text-cyan-400 font-bold">{selectedSample.sensors.pm10.toFixed(1)} µg/m³</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>CO₂:</span>
              <span className="text-amber-400 font-bold">{selectedSample.sensors.co2.toFixed(0)} ppm</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>TEMPERATURE:</span>
              <span className="text-orange-400 font-bold">{selectedSample.sensors.temperature.toFixed(1)} °C</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
