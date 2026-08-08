import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { ReportPreview } from '../components/ui/ReportPreview';
import { Download, Printer, Share2, FileText, Calendar } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const reportsList = [
    { id: 1, title: 'Kharghar PM2.5 Spike', type: 'Incident', date: '08 Aug 2026', active: true },
    { id: 2, title: 'Sector 12 Baseline', type: 'Survey', date: '07 Aug 2026', active: false },
    { id: 3, title: 'Industrial Emission', type: 'Compliance', date: '01 Aug 2026', active: false }
  ];

  return (
    <div className="w-full h-full flex space-x-4 overflow-hidden">
      
      {/* Left Sidebar: Document Library */}
      <GlassPanel className="w-80 h-full flex flex-col shadow-sm bg-white/70">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-xl font-black text-fluxx-text">Report Library</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {reportsList.map((report) => (
            <div 
              key={report.id} 
              className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                report.active 
                  ? 'bg-white border-fluxx-teal shadow-sm ring-1 ring-fluxx-teal/10' 
                  : 'bg-transparent border-slate-200 hover:bg-white/50'
              }`}
            >
              <div className="text-sm font-bold text-fluxx-text mb-2 line-clamp-1">{report.title}</div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className={`px-2 py-0.5 rounded-full uppercase tracking-widest ${
                  report.type === 'Incident' ? 'bg-red-50 text-red-600' :
                  report.type === 'Survey' ? 'bg-teal-50 text-fluxx-teal' :
                  'bg-slate-100 text-slate-500'
                }`}>{report.type}</span>
                <span className="text-slate-400 flex items-center"><Calendar className="w-3 h-3 mr-1" />{report.date}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Right Area: Document Editor / Preview */}
      <div className="flex-1 h-full flex flex-col">
        {/* Toolbar */}
        <GlassPanel className="w-full h-16 px-6 mb-4 flex items-center justify-between shadow-sm bg-white/70">
          <div className="text-sm font-bold text-fluxx-text flex items-center">
            <FileText className="w-4 h-4 mr-2 text-fluxx-muted" />
            Kharghar PM2.5 Spike Incident
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white flex items-center text-xs font-bold transition-colors cursor-pointer bg-slate-50">
              <Share2 className="w-3.5 h-3.5 mr-2" /> Share
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white flex items-center text-xs font-bold transition-colors cursor-pointer bg-slate-50">
              <Printer className="w-3.5 h-3.5 mr-2" /> Print
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-fluxx-teal text-white hover:bg-fluxx-teal-hover flex items-center text-xs font-bold transition-colors shadow-sm cursor-pointer">
              <Download className="w-3.5 h-3.5 mr-2" /> GENERATE PDF
            </button>
          </div>
        </GlassPanel>

        {/* Scrollable A4 Document Container */}
        <div className="flex-1 overflow-y-auto bg-slate-200/50 rounded-2xl flex justify-center py-8 px-4 border border-slate-200 shadow-inner">
          <ReportPreview />
        </div>
      </div>

    </div>
  );
};
