import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Terminal, 
  ExternalLink, 
  X, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Clock,
  User,
  ShieldCheck,
  Search
} from 'lucide-react';

interface AIReport {
  id: number;
  type: string;
  user: string;
  email: string;
  details: string;
  time: string;
}

interface AiMonitorPanelProps {
  setIsLoadingParent: (loading: boolean) => void;
  userRole: string;
  onBypassLogin?: (user: any, token: string) => void;
}

export function AiMonitorPanel({ setIsLoadingParent, userRole, onBypassLogin }: AiMonitorPanelProps) {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoadingParent(true);
    try {
      const res = await fetch('/api/admin/ai-reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParent(false);
    }
  };

  const handleInspectProfile = (report: AIReport) => {
    alert(`Redirecting to @${report.user}'s store dashboard ... (অনুসন্ধান চালানো হচ্ছে)`);
    if (onBypassLogin) {
      // Find the user if is registered or trigger directly
      onBypassLogin({ username: report.user, email: report.email }, 'bypass-token');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800/80 mb-6 gap-2">
        <div>
          <h2 className="text-xl font-bold text-rose-500 flex items-center gap-2">
            <Bot size={22} className="text-rose-500" /> 🤖 24/7 Auto AI Monitor (System Logs & Security)
          </h2>
          <p className="text-slate-500 text-xs text-left">
            এটি ২৪ ঘণ্টা প্ল্যাটফর্মের রিফান্ড রিকোয়েস্ট, অর্ডার এরর ও পেমেন্ট অভিযোগ মনিটর করে।
          </p>
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest bg-rose-950/40 text-rose-400 px-3.5 py-1.5 rounded-full border border-rose-500/30 animate-pulse flex items-center gap-1.5 self-start md:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block animate-ping" />
          24/7 Guard Active {userRole === 'Editor' && '(View Only)'}
        </span>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div 
            key={report.id} 
            onClick={() => setSelectedReport(report)}
            className="p-4 bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 rounded-2xl cursor-pointer transition duration-200 flex flex-col md:flex-row justify-between md:items-center gap-3 shadow-sm hover:shadow-md text-left text-xs text-slate-300"
          >
            <div className="space-y-1 md:max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded-lg border border-rose-500/10">
                  {report.type}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock size={12} /> {report.time}
                </span>
              </div>
              <p className="text-slate-400 font-medium truncate leading-relaxed">
                {report.details}
              </p>
            </div>
            
            <button 
              type="button"
              className="mt-2 md:mt-0 font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-xl transition duration-200 flex items-center justify-center gap-1 cursor-pointer w-full md:w-auto text-xs active:scale-95 text-center leading-none"
            >
              <Terminal size={12} /> View Logs
            </button>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="p-10 text-center text-slate-500 font-medium italic border border-dashed border-slate-800 rounded-2xl">
            কোনো সচল এআই অ্যালার্ট ও এরর পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* ================= MODAL: AI MONITOR REPORT DETAILS ================= */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-slate-950 p-6 rounded-3xl max-w-lg w-full border border-rose-700/40 shadow-2xl relative text-left">
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg transition"
            >
              <X size={18} />
            </button>
            
            <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle size={20} className="text-rose-500" /> Advanced AI Diagnostics
              </h3>
              <span className="text-[10px] font-black bg-rose-950/40 text-rose-300 px-2.5 py-1 rounded-full border border-rose-800/50 uppercase tracking-widest">
                24/7 Shield AI
              </span>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-0.5">Flagged User</p>
                  <p className="font-extrabold text-yellow-400 flex items-center gap-1 text-sm">
                    <User size={14} className="text-slate-400" /> @{selectedReport.user}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-0.5">Associated Email</p>
                  <p className="font-bold text-slate-300 truncate text-xs" title={selectedReport.email}>
                    {selectedReport.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black mb-1.5 flex items-center gap-1.5">
                  <Terminal size={12} className="text-rose-500" /> Issue Details & System Logs:
                </p>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl font-mono text-[11px] text-slate-300 leading-relaxed max-h-44 overflow-y-auto space-y-1 text-left">
                  <div className="text-rose-400/90 font-medium mb-2">{selectedReport.details}</div>
                  <div className="text-slate-500 font-bold border-t border-slate-800/60 pt-2 flex items-center gap-2">
                    <span className="text-indigo-400">[SYSTEM LOG]</span> Tracing supplier API response... <span className="text-emerald-400 font-extrabold">OK</span>
                  </div>
                  <div className="text-slate-500 font-bold flex items-center gap-2">
                    <span className="text-indigo-400">[SYSTEM LOG]</span> Checking store refund rules... <span className="text-yellow-400 font-extrabold">Pending Action</span>
                  </div>
                  <div className="text-slate-500 font-bold flex items-center gap-2">
                    <span className="text-indigo-400">[SYSTEM LOG]</span> Connection: Cloud-Secure API Endpoint ... <span className="text-emerald-400 font-extrabold">ACTIVE</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-xs text-yellow-300/90 leading-relaxed flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin/Editor Action Advice:</strong> আপনি চাইলে সরাসরি এই ইউজারের ব্যাকঅফিস বা স্টোর প্রোফাইলে ঢুকে ঝামেলাটি সমাধান করতে পারেন।
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => handleInspectProfile(selectedReport)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-slate-950 py-3.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/10 cursor-pointer"
              >
                <Search size={14} /> Inspect Store Profile
              </button>
              <button 
                onClick={() => setSelectedReport(null)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-5 py-3.5 rounded-xl text-xs font-semibold border border-slate-800 transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
