import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  Clock, 
  User, 
  MapPin, 
  ShieldAlert, 
  Send, 
  Tag, 
  FileText,
  Building
} from 'lucide-react';
import { api } from '../../services/api';
import { IncidentAnnotation } from '../../types';

export const IncidentTracker: React.FC = () => {
  const [annotations, setAnnotations] = useState<IncidentAnnotation[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('Sector 7 Industrial Zone');
  const [notes, setNotes] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('Dr. Ananya Sharma (SPCB Enforcement)');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  useEffect(() => {
    loadAnnotations();
  }, []);

  const loadAnnotations = async () => {
    try {
      const data = await api.getAnnotations();
      setAnnotations(data);
    } catch (err) {
      console.error('Failed to load annotations:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAnnotation({
        title,
        area_name: areaName,
        notes,
        assigned_to: assignedTo,
        priority,
        author: 'Cmdr. Rajesh Verma (Lead Flight Controller)',
        role: 'Chief Drone Operator'
      });
      setShowAddForm(false);
      setTitle('');
      setNotes('');
      loadAnnotations();
    } catch (err) {
      console.error('Failed to create annotation:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAnnotationStatus(id, newStatus);
      loadAnnotations();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
                <MessageSquare className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                  INCIDENT COLLABORATION & FIELD ANNOTATIONS
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    LIVE FIELD LOG
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Operator notes • Cross-agency investigation assignment • Field evidence & remediation status tracking
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Close Annotation Desk' : 'Log Field Incident Annotation'}
          </button>
        </div>
      </div>

      {/* New Annotation Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-4 animate-fade-in backdrop-blur-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Log New Environmental Field Annotation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Incident Title / Observation</label>
              <input
                type="text"
                required
                placeholder="e.g. Visual confirmation of fugitive VOC plume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Target Area / Geographic Grid</label>
              <input
                type="text"
                required
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Assign Investigation Officer / Desk</label>
              <input
                type="text"
                required
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Priority Level</label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-400">Detailed Drone Sensor & Visual Observations</label>
            <textarea
              rows={3}
              required
              placeholder="Enter sensor cross-checks, optical zoom notes, CAAQM readings..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30"
          >
            Publish Tamper-Evident Annotation to Audit Log
          </button>
        </form>
      )}

      {/* Incident Annotations Timeline */}
      <div className="space-y-4">
        {annotations.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ann.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  ann.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {ann.priority}
                </span>
                <span className="font-mono text-xs text-indigo-400 font-bold">{ann.incident_id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-bold text-white">{ann.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  {ann.timestamp}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  ann.status === 'ACTION_TAKEN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  ann.status === 'INVESTIGATING' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {ann.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              {ann.notes}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Logged By: {ann.author}
                </span>
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  Assigned: {ann.assigned_to}
                </span>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStatusChange(ann.id, 'INVESTIGATING')}
                  className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-cyan-300 border border-slate-800"
                >
                  Mark Investigating
                </button>
                <button
                  onClick={() => handleStatusChange(ann.id, 'ACTION_TAKEN')}
                  className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-emerald-300 border border-slate-800"
                >
                  Mark Action Taken
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
