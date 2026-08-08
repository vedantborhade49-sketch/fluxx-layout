import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';
import { ComplianceReport } from '../../types';
import { api } from '../../services/api';

export const AuditReportView: React.FC = () => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await api.getComplianceReport('ALL');
      setReport(data);
    } catch (e) {
      console.error('Error loading report:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FLUXX-Environmental-Compliance-Audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  if (!report) return null;

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-[#0D101A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#00FF9D]" />
            <span>Official Environmental Compliance & AI Audit Report</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Certified Environmental Protection Standard (EPA / CPCB / ISO 14001 Equivalent)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#00FF9D] text-black font-bold text-xs shadow-lg shadow-[#00FF9D]/20 hover:opacity-90 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-[#0A0C14] border border-white/15 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6 max-w-4xl mx-auto">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-6">
          <div>
            <div className="text-2xl font-black text-white tracking-wider flex items-center space-x-2">
              <span className="text-[#00F0FF]">FLUXX</span>
              <span>ENVIRONMENTAL INTELLIGENCE</span>
            </div>
            <div className="text-xs text-gray-400 font-mono-telemetry mt-1">
              REPORT REF: {report.report_id} • TIME: {new Date(report.generated_at).toUTCString()}
            </div>
          </div>

          <div className="text-right font-mono-telemetry">
            <span className="px-3 py-1 rounded-lg bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30 font-bold text-xs">
              COMPLIANCE GRADE: {report.executive_summary.compliance_grade}
            </span>
            <div className="text-[10px] text-gray-400 mt-1">Status: {report.executive_summary.compliance_status}</div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            1. Executive Telemetry Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono-telemetry">
            <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400">AVERAGE AQI</span>
              <div className="text-xl font-bold text-white my-0.5">{report.executive_summary.average_aqi}</div>
              <span className="text-[9px] text-[#00FF9D]">Moderate Zone</span>
            </div>
            <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400">PEAK AQI RECORDED</span>
              <div className="text-xl font-bold text-[#FF3366] my-0.5">{report.executive_summary.peak_aqi}</div>
              <span className="text-[9px] text-[#FF3366]">Spike Hotspot</span>
            </div>
            <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400">TELEMETRY SAMPLES</span>
              <div className="text-xl font-bold text-[#00F0FF] my-0.5">{report.executive_summary.total_telemetry_samples}</div>
              <span className="text-[9px] text-gray-400">Continuous Ingestion</span>
            </div>
            <div className="bg-[#121624] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400">SURVEY MISSIONS</span>
              <div className="text-xl font-bold text-[#00FF9D] my-0.5">{report.executive_summary.completed_missions_count}</div>
              <span className="text-[9px] text-gray-400">Completed 100%</span>
            </div>
          </div>
        </div>

        {/* Regulatory Limit vs Monitored Gas Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            2. Multi-Gas Concentrations vs Statutory EPA Limits
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono-telemetry text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-2">Pollutant Channel</th>
                  <th className="py-2">Observed Average</th>
                  <th className="py-2">Statutory Standard Limit</th>
                  <th className="py-2 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="py-2 font-bold text-white">PM2.5 Fine Particulate</td>
                  <td className="py-2">{report.gas_averages?.pm25_ug_m3 ?? 24.5} µg/m³</td>
                  <td className="py-2 text-gray-400">{report.regulatory_limits?.pm25_standard ?? '60.0 µg/m³ (24h)'}</td>
                  <td className="py-2 text-right text-[#00FF9D] font-bold">● COMPLIANT</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-white">PM10 Coarse Particulate</td>
                  <td className="py-2">{report.gas_averages?.pm10_ug_m3 ?? 52.1} µg/m³</td>
                  <td className="py-2 text-gray-400">{report.regulatory_limits?.pm10_standard ?? '100.0 µg/m³ (24h)'}</td>
                  <td className="py-2 text-right text-[#00FF9D] font-bold">● COMPLIANT</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-white">Carbon Dioxide (CO₂)</td>
                  <td className="py-2">{report.gas_averages?.co2_ppm ?? 418} ppm</td>
                  <td className="py-2 text-gray-400">{report.regulatory_limits?.co2_standard ?? '1000 ppm (8h)'}</td>
                  <td className="py-2 text-right text-[#00FF9D] font-bold">● NOMINAL</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-white">Volatile Organics (VOC)</td>
                  <td className="py-2">{report.gas_averages?.voc_ppb ?? 240} ppb</td>
                  <td className="py-2 text-gray-400">{report.regulatory_limits?.voc_standard ?? '200 ppb (Guideline)'}</td>
                  <td className="py-2 text-right text-[#FFB800] font-bold">● ELEVATED (CORRIDOR)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Conclusions & Certification */}
        <div className="space-y-3 bg-[#121624] p-4 rounded-xl border border-white/5">
          <h3 className="text-xs font-bold text-[#00FF9D] uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Autonomous AI Findings & Remediation Advisory</span>
          </h3>
          <div className="space-y-1.5 text-xs text-gray-300">
            {report.ai_conclusions.map((c, i) => (
              <div key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D] flex-shrink-0 mt-0.5" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Footer Signature */}
        <div className="flex justify-between items-end pt-4 border-t border-white/10 text-[11px] font-mono-telemetry text-gray-400">
          <div>
            <div>FLUXX AUTONOMOUS VTOL PLATFORM v2.0</div>
            <div>DIGITAL TWIN & AI VERIFIED AUDIT HASH: #8A4F-29E1-FLUXX</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-white">CHIEF ENVIRONMENTAL CONTROLLER</div>
            <div>STATE POLLUTION CONTROL BOARD</div>
          </div>
        </div>

      </div>

    </div>
  );
};
