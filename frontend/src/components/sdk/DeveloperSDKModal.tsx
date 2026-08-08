import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  X, 
  Terminal, 
  Layers, 
  Download, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../../services/api';
import { DeveloperSDKSpy } from '../../types';

interface DeveloperSDKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperSDKModal: React.FC<DeveloperSDKModalProps> = ({ isOpen, onClose }) => {
  const [sdkData, setSdkData] = useState<DeveloperSDKSpy | null>(null);
  const [activeTab, setActiveTab] = useState<'python' | 'typescript' | 'curl'>('python');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadSDK();
    }
  }, [isOpen]);

  const loadSDK = async () => {
    try {
      const data = await api.getSDKSpy();
      setSdkData(data);
    } catch (err) {
      console.error('Failed to load SDK specifications:', err);
    }
  };

  const handleCopy = () => {
    if (!sdkData) return;
    const code = sdkData.code_examples[activeTab];
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                DEVELOPER SDK &amp; INTEGRATION WORKBENCH
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {sdkData?.version || 'v2.0.4'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official programmatic clients for Python, TypeScript/Node.js, and REST/MQTT WebHooks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Packages Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sdkData?.sdk_packages.map((pkg, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{pkg.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{pkg.version}</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">{pkg.downloads}</span>
              </div>
            ))}
          </div>

          {/* Language Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['python', 'typescript', 'curl'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            {/* Code Block */}
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-80">
              {sdkData?.code_examples[activeTab]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
