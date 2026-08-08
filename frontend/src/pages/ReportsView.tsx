import React from 'react';
import { 
  FileText, 
  MapPin, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useEnvironmentStore } from '../stores/environmentStore';

export const ReportsView: React.FC = () => {
  const { eri, currentReading } = useEnvironmentStore();
  
  if (!currentReading || !currentReading.sensors) {
    return <div className="p-4">Loading reports data...</div>;
  }
  
  const sensors = currentReading.sensors;

  const categories = [
    { name: 'Survey Reports', count: 12, active: true },
    { name: 'Mission Logs', count: 42, active: false },
    { name: 'Incident Records', count: 3, active: false },
    { name: 'Compliance Audits', count: 1, active: false }
  ];

  const recentReports = [
    { title: 'Kharghar PM2.5 Spike Incident', date: '08 Aug 2026', type: 'Incident', active: true },
    { title: 'Sector 12 Baseline Survey', date: '07 Aug 2026', type: 'Survey', active: false },
    { title: 'Taloja Industrial Emission Check', date: '01 Aug 2026', type: 'Compliance', active: false }
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-5">
      
      {/* LEFT: Report Library Sidebar */}
      <div className="w-full lg:w-72 flex flex-col space-y-4">
        
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">REPORT CATEGORIES</div>
          <div className="space-y-1.5">
            {categories.map(cat => (
              <div 
                key={cat.name} 
                className={`flex justify-between items-center px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  cat.active 
                    ? 'bg-[#E0F2FE] text-[#0284C7]' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                  cat.active ? 'bg-white/50 text-[#0284C7]' : 'bg-slate-100 text-slate-400'
                }`}>{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">RECENT DOCUMENTS</div>
          <div className="space-y-3">
            {recentReports.map(report => (
              <div 
                key={report.title} 
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  report.active 
                    ? 'border-[#0EA5E9] bg-white shadow-sm ring-1 ring-[#0EA5E9]/10' 
                    : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 leading-tight mb-2">
                  {report.title}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{report.date}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    report.type === 'Incident' ? 'bg-red-50 text-red-600' :
                    report.type === 'Survey' ? 'bg-[#F0F9FF] text-[#0EA5E9]' :
                    'bg-slate-100 text-slate-600'
                  }`}>{report.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT: Document Generator Preview */}
      <div className="flex-1 flex flex-col space-y-4">
        
        {/* Document Actions Bar */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-3 flex justify-between items-center">
          <div className="text-xs font-bold text-slate-700 ml-2">Document Preview: <span className="font-medium text-slate-500">Kharghar PM2.5 Spike Incident</span></div>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center space-x-2 text-xs font-bold transition-colors cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center space-x-2 text-xs font-bold transition-colors cursor-pointer">
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-[#0EA5E9] text-white hover:bg-[#0284C7] flex items-center space-x-2 text-xs font-bold transition-colors shadow-sm cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>GENERATE PDF</span>
            </button>
          </div>
        </div>

        {/* Realistic A4 Paper Preview */}
        <div className="flex-1 bg-slate-100 rounded-2xl overflow-y-auto flex justify-center py-8">
          
          <div className="w-[800px] bg-white shadow-2xl p-12 shrink-0 border border-slate-200">
            
            {/* Report Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">FLUXX</h1>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Environmental Intelligence Report</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-800">INCIDENT REPORT</div>
                <div className="text-xs text-slate-500 mt-1">Generated: 08 Aug 2026, 16:32 IST</div>
                <div className="text-xs text-slate-500">ID: REP-20260808-042</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-8">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Executive Summary</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                On August 8th, 2026, the FLUXX Environmental monitoring system detected a significant surge in PM2.5 particulate matter in the Kharghar Sector 12 region. The Environmental Risk Index (ERI) reached a peak score of <span className="font-bold text-red-600">64 (Moderate Risk)</span>. The anomaly was verified with 87% confidence by the decision intelligence engine. Immediate health advisories are recommended for sensitive groups.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Pollutant</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-black text-slate-900">{sensors.pm25.toFixed(1)}</span>
                  <span className="text-xs font-bold text-slate-500 mb-1">µg/m³ PM2.5</span>
                </div>
                <div className="text-[10px] font-bold text-red-500 mt-1">+8.2% from baseline</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Risk Score</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-black text-slate-900">{eri.score}</span>
                  <span className="text-xs font-bold text-slate-500 mb-1">/ 100 ERI</span>
                </div>
                <div className="text-[10px] font-bold text-amber-600 mt-1 uppercase">MODERATE</div>
              </div>
            </div>

            {/* Static Map Snapshot Simulation */}
            <div className="mb-8">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Spatial Distribution Snapshot</h2>
              <div className="w-full h-64 bg-slate-200 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.05,73.07&zoom=14&size=800x400&maptype=satellite')] bg-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent" />
                
                {/* Fake Legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded shadow text-[9px] font-bold text-slate-700 flex flex-col">
                  <span className="mb-1">PM2.5 Heatmap</span>
                  <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500" />
                </div>
                
                {/* Fake Marker */}
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                </div>
              </div>
              <div className="text-[9px] text-center text-slate-400 mt-2">Figure 1.0: Interpolated PM2.5 dispersion model over Kharghar node.</div>
            </div>

            {/* Findings & Signatures */}
            <div>
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Key Findings & Automation</h2>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mb-12">
                <li>Wind stagnation (2.6 m/s SW) is contributing to a 41% localized accumulation of particulate matter.</li>
                <li>CO2 levels remain within nominal thresholds ({sensors.co2.toFixed(0)} ppm).</li>
                <li>Automated mitigation protocol engaged: VTOL Fleet dispatched for low-altitude volumetric sampling.</li>
              </ul>

              <div className="flex justify-between items-end border-t border-slate-200 pt-8 mt-12">
                <div className="w-48">
                  <div className="border-b border-slate-400 h-8 mb-2" />
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Authorized Signature</div>
                  <div className="text-xs font-medium text-slate-800">System generated via FLUXX AI</div>
                </div>
                <div className="w-32">
                  <div className="border-b border-slate-400 h-8 mb-2" />
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Date</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
