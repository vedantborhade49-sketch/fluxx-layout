import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MapPin, 
  Compass, 
  Play, 
  Square, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  ShieldAlert,
  Sparkles,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { Mission, DroneState } from '../../types';
import { api } from '../../services/api';

interface MissionPlannerProps {
  drones: DroneState[];
  selectedDroneId: string;
  onMissionCreated?: (m: Mission) => void;
}

export const MissionPlanner: React.FC<MissionPlannerProps> = ({
  drones,
  selectedDroneId,
  onMissionCreated
}) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionName, setMissionName] = useState<string>('Alpha Corridor Industrial Sweep #5');
  const [missionType, setMissionType] = useState<string>('Industrial Inspection');
  const [droneId, setDroneId] = useState<string>(selectedDroneId);
  const [altitude, setAltitude] = useState<number>(120);
  const [spacing, setSpacing] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);
  const [gridResult, setGridResult] = useState<any>(null);

  // Preset survey zones
  const presetZones = [
    {
      name: 'Alpha Refinery & Industrial Hub',
      type: 'Industrial Inspection',
      polygon: [[37.770, -122.425], [37.780, -122.425], [37.780, -122.410], [37.770, -122.410]]
    },
    {
      name: 'Downtown Commercial Metro Grid',
      type: 'Environmental Survey',
      polygon: [[37.780, -122.415], [37.790, -122.415], [37.790, -122.400], [37.780, -122.400]]
    },
    {
      name: 'Presidio Ecological Green Corridor',
      type: 'Forest Monitoring',
      polygon: [[37.760, -122.445], [37.770, -122.445], [37.770, -122.430], [37.760, -122.430]]
    }
  ];

  const [selectedZone, setSelectedZone] = useState(presetZones[0]);

  // Load existing missions
  const loadMissions = async () => {
    try {
      const data = await api.getMissions();
      setMissions(data);
    } catch (e) {
      console.error('Error loading missions:', e);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  // Compute grid preview
  const handleGenerateGrid = async (zone = selectedZone) => {
    try {
      setLoading(true);
      const result = await api.generateMissionGrid({
        polygon: zone.polygon,
        altitude,
        spacing_meters: spacing,
        drone_id: droneId,
        name: missionName
      });
      setGridResult(result);
    } catch (e) {
      console.error('Error generating grid:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateGrid();
  }, [selectedZone, altitude, spacing, droneId]);

  // Dispatch Mission
  const handleDispatchMission = async () => {
    if (!gridResult) return;
    try {
      setLoading(true);
      const newMission = await api.createMission({
        drone_id: droneId,
        name: missionName,
        type: missionType,
        area_name: selectedZone.name,
        area_polygon: selectedZone.polygon,
        waypoints: gridResult.waypoints,
        distance_km: gridResult.distance_km,
        flight_time_min: gridResult.flight_time_min,
        coverage_sqkm: gridResult.coverage_sqkm
      });
      setMissions([newMission, ...missions]);
      if (onMissionCreated) onMissionCreated(newMission);
      alert(`🚀 Mission [${newMission.name}] successfully uploaded to ${droneId}! Telemetry grid active.`);
    } catch (e) {
      console.error('Error creating mission:', e);
    } finally {
      setLoading(false);
    }
  };

  // Abort Mission
  const handleAbort = async (mId: string) => {
    try {
      await api.abortMission(mId);
      loadMissions();
    } catch (e) {
      console.error('Error aborting mission:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Send className="w-5 h-5 text-[#00F0FF]" />
            <span>Autonomous VTOL Mission Control & Serpentine Grid Planner</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            GIS Polygon Ingestion • Automated Survey Pattern Generator • Real-Time Flight Path Upload
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono-telemetry text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 font-bold">
            RTK WAYPOINT ENGINE ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Mission Configurator (5 cols) */}
        <div className="lg:col-span-5 bg-[#0D101A] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide pb-2 border-b border-white/5">
            Mission Flight Parameters
          </h3>

          {/* Mission Name & Type */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium">Mission Title</label>
            <input
              type="text"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              className="w-full bg-[#121624] text-xs text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          {/* Assigned Drone */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium">Assigned VTOL Airframe</label>
            <select
              value={droneId}
              onChange={(e) => setDroneId(e.target.value)}
              className="w-full bg-[#121624] text-xs text-[#00F0FF] font-bold font-mono-telemetry px-3 py-2 rounded-lg border border-white/10 focus:outline-none"
            >
              {drones.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#121624] text-white">
                  {d.id} • {d.name || d.model} (Battery: {d.battery.toFixed(0)}%)
                </option>
              ))}
            </select>
          </div>

          {/* Survey Zone Presets */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium">Target Survey Zone</label>
            <div className="space-y-2">
              {presetZones.map((z, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedZone(z);
                    setMissionType(z.type);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    selectedZone.name === z.name
                      ? 'bg-[#141828] border-[#00F0FF] text-white shadow-md shadow-[#00F0FF]/10'
                      : 'bg-[#121624]/60 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">{z.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono-telemetry">{z.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Altitude & Spacing Controls */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#121624] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Survey Altitude</span>
                <span className="font-mono-telemetry text-white font-bold">{altitude}m</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={altitude}
                onChange={(e) => setAltitude(parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>

            <div className="bg-[#121624] p-3 rounded-xl border border-white/5 space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Grid Spacing</span>
                <span className="font-mono-telemetry text-white font-bold">{spacing}m</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="25"
                value={spacing}
                onChange={(e) => setSpacing(parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#00FF9D]"
              />
            </div>
          </div>

          {/* Dispatch Button */}
          <button
            onClick={handleDispatchMission}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#B600A8] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00F0FF]/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>Upload Flight Grid & Dispatch Drone</span>
          </button>

        </div>

        {/* Right: Grid Waypoints & Mission Logs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Estimated Calculations Bar */}
          {gridResult && (
            <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#00FF9D]" />
                <span>AI Flight Analytics & Estimated Resource Consumption</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono-telemetry">
                <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase">Distance</span>
                  <div className="text-lg font-bold text-white my-0.5">{gridResult.distance_km} km</div>
                </div>

                <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase">Duration</span>
                  <div className="text-lg font-bold text-[#00F0FF] my-0.5">{gridResult.flight_time_min} min</div>
                </div>

                <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase">Coverage</span>
                  <div className="text-lg font-bold text-[#00FF9D] my-0.5">{gridResult.coverage_sqkm} km²</div>
                </div>

                <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase">Waypoints</span>
                  <div className="text-lg font-bold text-[#FFB800] my-0.5">{gridResult.waypoints?.length || 0} pts</div>
                </div>
              </div>

              {/* Waypoint Coordinates Table Preview */}
              <div className="bg-[#121624] p-3 rounded-xl border border-white/5 max-h-36 overflow-y-auto">
                <div className="text-[11px] font-mono-telemetry text-gray-400 mb-2 font-bold uppercase">
                  Generated Serpentine Coordinates (MAVLink Ingestion Queue):
                </div>
                <div className="space-y-1 font-mono-telemetry text-xs">
                  {gridResult.waypoints?.map((w: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-gray-300 py-0.5 border-b border-white/5">
                      <span>WP-{idx + 1} [{w.action}]</span>
                      <span>{w.lat.toFixed(5)}°N, {w.lng.toFixed(5)}°W</span>
                      <span className="text-[#00F0FF]">{w.alt}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Missions Log Table */}
          <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Active & Historic Mission Logs
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#121624] p-3 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center space-x-2">
                      <span>{m.name}</span>
                      <span className="text-[10px] text-[#00F0FF] font-mono-telemetry">[{m.id}]</span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono-telemetry mt-0.5">
                      {m.drone_id} • {m.area_name} • {m.distance_km} km • {m.flight_time_min}m
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-mono-telemetry font-bold ${
                      m.status === 'IN_PROGRESS' || m.status === 'UPLOADING'
                        ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 animate-pulse'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {m.status}
                    </span>

                    {m.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleAbort(m.id)}
                        className="px-2 py-0.5 rounded bg-[#FF3366]/20 text-[#FF3366] hover:bg-[#FF3366]/30 transition-all font-semibold"
                      >
                        Abort
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
