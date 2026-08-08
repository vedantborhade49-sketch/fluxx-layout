import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  Power, 
  CheckCircle2, 
  Plane, 
  Layers, 
  Play, 
  Pause,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { MissionSchedule } from '../../types';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchedulerModal: React.FC<SchedulerModalProps> = ({ isOpen, onClose }) => {
  const [schedules, setSchedules] = useState<MissionSchedule[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('Daily at 06:00 AM');
  const [targetArea, setTargetArea] = useState<string>('Industrial Refining Corridor');
  const [droneAssigned, setDroneAssigned] = useState<string>('VTOL-001');
  const [surveyType, setSurveyType] = useState<string>('Hazardous Gas & VOC Sweep');

  useEffect(() => {
    if (isOpen) {
      loadSchedules();
    }
  }, [isOpen]);

  const loadSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.toggleSchedule(id);
      loadSchedules();
    } catch (err) {
      console.error('Failed to toggle schedule:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSchedule({
        title,
        frequency,
        target_area: targetArea,
        drone_assigned: droneAssigned,
        survey_type: surveyType,
        coverage_area_sqkm: 12.5,
        auto_dispatch: true
      });
      setShowAddForm(false);
      setTitle('');
      loadSchedules();
    } catch (err) {
      console.error('Failed to create schedule:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Calendar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AUTONOMOUS RECURRING MISSION SCHEDULER
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  CRON ENGINE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automate periodic industrial sweeps, morning forest patrols, and school rush hour monitoring.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Schedule Button */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule New Recurring Survey
          </button>
        ) : (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/40 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-indigo-300 uppercase">Create Recurring Survey Schedule</span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Mission Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Refinery VOC Inspection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Frequency & Timing</label>
                <input
                  type="text"
                  required
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Assigned Drone</label>
                <select
                  value={droneAssigned}
                  onChange={(e) => setDroneAssigned(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="VTOL-001">VTOL-001 (SkyGuardian Pro)</option>
                  <option value="VTOL-002">VTOL-002 (AeroSentry X8)</option>
                  <option value="VTOL-003">VTOL-003 (EcoHawk Ranger)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Target Airshed / Area</label>
                <input
                  type="text"
                  required
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Activate Automated Survey Schedule
            </button>
          </form>
        )}

        {/* Active Schedules List */}
        <div className="space-y-3">
          {schedules.map((sched) => (
            <div
              key={sched.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                sched.status === 'ACTIVE'
                  ? 'bg-slate-950/70 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    sched.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sched.status}
                  </span>
                  <span className="text-xs font-bold text-white">{sched.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                  <span className="text-indigo-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sched.frequency}
                  </span>
                  <span>•</span>
                  <span>Target: <strong className="text-slate-300">{sched.target_area}</strong></span>
                  <span>•</span>
                  <span>Drone: <strong className="text-cyan-300">{sched.drone_assigned}</strong></span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Next Scheduled Dispatch: {sched.next_run} ({sched.coverage_area_sqkm} km² coverage)
                </div>
              </div>

              <button
                onClick={() => handleToggle(sched.id)}
                className={`p-2.5 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-all self-end sm:self-center ${
                  sched.status === 'ACTIVE'
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {sched.status === 'ACTIVE' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {sched.status === 'ACTIVE' ? 'Pause' : 'Resume'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
