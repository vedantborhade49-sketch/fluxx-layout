import React, { useState } from 'react';
import { 
  Camera, 
  Eye, 
  Flame, 
  Layers, 
  Scan, 
  Maximize2, 
  ShieldAlert, 
  Crosshair,
  Sparkles,
  Download
} from 'lucide-react';
import { DetectionObject } from '../../types';

interface CameraFeedProps {
  droneId: string;
  detections: DetectionObject[];
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ droneId, detections }) => {
  const [feedMode, setFeedMode] = useState<'OPTICAL' | 'THERMAL' | 'NDVI'>('OPTICAL');
  const [showAIBoxes, setShowAIBoxes] = useState<boolean>(true);
  const [gimbalPitch, setGimbalPitch] = useState<number>(-35);

  return (
    <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
      
      {/* Feed Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Live Aerial Gimbal Payload Stream
          </h3>
          <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-ping" />
          <span className="text-[10px] text-[#FF3366] font-mono-telemetry font-bold">REC 4K@60FPS</span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-[#141824] p-1 rounded-lg border border-white/5 text-xs">
          <button
            onClick={() => setFeedMode('OPTICAL')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              feedMode === 'OPTICAL' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            RGB Optical
          </button>
          <button
            onClick={() => setFeedMode('THERMAL')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              feedMode === 'THERMAL' ? 'bg-[#FF5500]/20 text-[#FF5500]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Thermal IR
          </button>
          <button
            onClick={() => setFeedMode('NDVI')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              feedMode === 'NDVI' ? 'bg-[#00FF9D]/20 text-[#00FF9D]' : 'text-gray-400 hover:text-white'
            }`}
          >
            NDVI Bio
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative w-full h-[280px] bg-[#08090D] rounded-xl border border-white/10 overflow-hidden group">
        
        {/* Dynamic Background Shader based on Mode */}
        {feedMode === 'OPTICAL' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1524] via-[#101b2b] to-[#0a121e]">
            {/* Simulated Aerial Topographic Terrain */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        )}

        {feedMode === 'THERMAL' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a0845] via-[#64147d] to-[#ff4b2b] opacity-80">
            <div className="absolute inset-0 bg-[radial-gradient(#FFB800_2px,transparent_2px)] [background-size:24px_24px] opacity-40 animate-pulse" />
          </div>
        )}

        {feedMode === 'NDVI' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#15803d] opacity-90">
            <div className="absolute inset-0 bg-[radial-gradient(#00FF9D_2px,transparent_2px)] [background-size:20px_20px] opacity-30" />
          </div>
        )}

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

        {/* HUD Crosshairs & Telemetry Overlays */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none font-mono-telemetry text-xs">
          
          {/* Top Left: Drone ID, Gimbal Pitch, Zoom */}
          <div className="flex items-center space-x-3 text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 w-fit">
            <span>{droneId}</span>
            <span>•</span>
            <span>PITCH: {gimbalPitch}°</span>
            <span>•</span>
            <span>ZOOM: 2.4X</span>
          </div>

          {/* Center Crosshair Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-1 h-3 bg-[#00F0FF] absolute top-0" />
              <div className="w-1 h-3 bg-[#00F0FF] absolute bottom-0" />
              <div className="h-1 w-3 bg-[#00F0FF] absolute left-0" />
              <div className="h-1 w-3 bg-[#00F0FF] absolute right-0" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
            </div>
          </div>

          {/* Bottom Left: Coordinates & Laser Rangefinder */}
          <div className="flex items-center space-x-3 text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 w-fit">
            <span>TARGET RANGE: 284m</span>
            <span>•</span>
            <span>FOV: 84°</span>
          </div>

        </div>

        {/* YOLO Object Detection Bounding Boxes */}
        {showAIBoxes && detections && detections.map((det) => {
          // BBox normalized coords: [ymin, xmin, ymax, xmax]
          const top = `${det.bbox[0] * 100}%`;
          const left = `${det.bbox[1] * 100}%`;
          const width = `${(det.bbox[3] - det.bbox[1]) * 100}%`;
          const height = `${(det.bbox[2] - det.bbox[0]) * 100}%`;

          return (
            <div
              key={det.id}
              className="absolute border-2 rounded transition-all duration-300 pointer-events-auto"
              style={{
                top,
                left,
                width,
                height,
                borderColor: det.color,
                boxShadow: `0 0 12px ${det.color}66`
              }}
            >
              {/* Detection Tag Badge */}
              <div
                className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono-telemetry font-bold text-black flex items-center space-x-1 shadow-md whitespace-nowrap"
                style={{ backgroundColor: det.color }}
              >
                <span>{det.label}</span>
                <span>{(det.confidence * 100).toFixed(0)}%</span>
              </div>
              
              {det.area_m2 && (
                <div className="absolute -bottom-5 right-0 px-1.5 py-0.2 rounded bg-black/70 text-[9px] font-mono-telemetry text-white">
                  {det.area_m2} m²
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* Footer Controls & AI Hazard Summary */}
      <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAIBoxes(!showAIBoxes)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              showAIBoxes
                ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>YOLOv10 AI Vision {showAIBoxes ? 'ON' : 'OFF'}</span>
          </button>
          
          <span className="text-[11px] text-gray-400 font-mono-telemetry">
            {detections.length} Target(s) Locked
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">Gimbal:</span>
          <button 
            onClick={() => setGimbalPitch(Math.max(-90, gimbalPitch - 10))}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white font-mono-telemetry"
          >
            -10°
          </button>
          <button 
            onClick={() => setGimbalPitch(Math.min(0, gimbalPitch + 10))}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white font-mono-telemetry"
          >
            +10°
          </button>
        </div>
      </div>

    </div>
  );
};
