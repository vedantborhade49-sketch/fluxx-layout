import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Plane, 
  Activity, 
  Wind, 
  Flame, 
  ShieldAlert, 
  Layers, 
  FastForward,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { PlaybackTimelineSlice } from '../../types';

export const HistoricalPlayback: React.FC = () => {
  const [slices, setSlices] = useState<PlaybackTimelineSlice[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(4); // default LIVE
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2000); // ms per step

  useEffect(() => {
    loadTimeline();
  }, []);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying && slices.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slices.length);
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, slices, playbackSpeed]);

  const loadTimeline = async () => {
    try {
      const data = await api.getPlaybackTimeline();
      setSlices(data);
    } catch (err) {
      console.error('Failed to load playback timeline:', err);
    }
  };

  const currentSlice = slices[currentIndex] || null;

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                  HISTORICAL 4D MISSION & PLUME PLAYBACK
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                    {currentSlice?.time_label || 'LIVE STREAM'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Temporal scrubbing • Retrospective incident replay • Plume evolution & flight coordinate trajectory
                </p>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
              title={isPlaying ? 'Pause' : 'Play Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex(0);
              }}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-all border border-slate-800"
              title="Rewind to Beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="px-3 text-xs font-mono text-indigo-300">
              Step {currentIndex + 1} / {slices.length || 5}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Scrubber Ribbon */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-300">Temporal Scrubber</span>
          <span className="font-mono text-cyan-300">{currentSlice?.timestamp}</span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {slices.map((slice, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                currentIndex === idx
                  ? 'bg-indigo-600/30 border-indigo-500 shadow-lg shadow-indigo-600/20 text-white'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono font-bold block text-indigo-400">0{idx + 1}</span>
              <span className="text-xs font-bold block mt-0.5">{slice.time_label}</span>
              <span className="text-[10px] text-slate-500 block truncate mt-1">
                ERI {slice.eri_composite}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Slice Telemetry & Physical Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fleet Flight Coordinates & State */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Plane className="w-4 h-4 text-indigo-400" />
              Airborne Fleet Coordinates at {currentSlice?.time_label}
            </h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentSlice?.plume_active ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {currentSlice?.plume_active ? 'ACTIVE PLUME TRACKING' : 'NOMINAL SURVEY'}
            </span>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <strong className="text-indigo-300">Airshed Synopsis: </strong>
            {currentSlice?.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {currentSlice?.drones.map((d) => (
              <div key={d.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{d.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    {d.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                  <div>GPS: {d.lat.toFixed(4)}°N, {d.lng.toFixed(4)}°E</div>
                  <div>Altitude: {d.alt} m • Battery: {d.battery}%</div>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex justify-between text-xs font-mono">
                  <span className="text-indigo-300 font-bold">AQI {d.aqi}</span>
                  <span className="text-amber-300">VOC {d.voc} ppb</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Temporal Meteorological & ERI Context */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Composite ERI Snapshot
            </h3>
            <span className="text-[10px] font-mono text-rose-400 font-bold">
              {currentSlice?.eri_status}
            </span>
          </div>

          <div className="flex items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-center">
              <div className="text-4xl font-black font-mono text-rose-400">
                {currentSlice?.eri_composite}
              </div>
              <div className="text-[10px] uppercase text-slate-400 mt-1">Composite Risk Score</div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Atmospheric Wind Conditions
            </span>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" />
                Velocity & Bearing:
              </span>
              <span className="text-cyan-300 font-bold">
                {currentSlice?.wind.speed_ms} m/s @ {currentSlice?.wind.dir_deg}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
