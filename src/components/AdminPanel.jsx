import React, { useState, useEffect } from 'react';
import { X, Shield, Activity, Database, AlertCircle, RefreshCcw, Lock } from 'lucide-react';
import { getUsageStats, PRIMARY_API, BACKUP_API } from '../utils/api';

const AdminPanel = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(getUsageStats());
  const [activeTab, setActiveTab] = useState('inventory');

  const ADMIN_PASSWORD = '1KINGkhan#';

  useEffect(() => {
    if (isOpen) {
      setStats(getUsageStats());
    }
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Administrative Credential');
      setPassword('');
    }
  };

  const handleReset = () => {
    const defaultStats = {
      primary: { used: 0, limit: 1000 },
      backup: { used: 0, limit: 500 },
      lastReset: new Date().toISOString()
    };
    localStorage.setItem('api_usage_stats', JSON.stringify(defaultStats));
    setStats(defaultStats);
  };

  if (!isOpen) return null;

  const calculateRemaining = (node) => Math.max(node.limit - node.used, 0);
  const calculatePercent = (node) => ((node.used / node.limit) * 100).toFixed(1);
  const getStatusColor = (percent) => {
    if (percent >= 90) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (percent >= 70) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0c10]/90 backdrop-blur-2xl"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[#0f1117] border border-white/5 rounded-[40px] shadow-[0_0_100px_rgba(79,70,229,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Security Gateway</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Admin Terminal v4.0</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all active:scale-90"
            >
              <X size={22} />
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="py-6">
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Access Credentials</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Lock className="text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        </div>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="SECURITY TOKEN REQUIRED"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono tracking-widest text-sm"
                            autoFocus
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest animate-bounce">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                </div>
                <button 
                    type="submit"
                    className="w-full bg-linear-to-br from-indigo-600 to-violet-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.3em] text-[11px]"
                >
                    Authorize Session
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-6">
                {/* Node Status Summary */}
                {[
                  { id: 'primary', data: stats.primary, api: PRIMARY_API, icon: Activity },
                  { id: 'backup', data: stats.backup, api: BACKUP_API, icon: Database }
                ].map((node) => {
                  const percent = calculatePercent(node.data);
                  const statusStyles = getStatusColor(parseFloat(percent));
                  
                  return (
                    <div key={node.id} className="group p-8 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/[0.07] transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusStyles}`}>
                            {percent < 70 ? 'Optimal' : percent < 90 ? 'High' : 'Exhausted'}
                        </div>
                      </div>

                      <div className="flex items-start gap-5 mb-8">
                        <div className="p-3.5 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                          <node.icon className="text-indigo-500" size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{node.api.name}</span>
                          <span className="text-sm font-black text-gray-400 mt-1">{node.api.host}</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Load Factor</span>
                                <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{percent}%</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full p-1 border border-white/5">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] ${
                                        parseFloat(percent) < 70 ? 'bg-emerald-500 text-emerald-500/50' : 
                                        parseFloat(percent) < 90 ? 'bg-amber-500 text-amber-500/50' : 'bg-red-500 text-red-500/50'
                                    }`}
                                    style={{ width: `${Math.min(parseFloat(percent), 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Consumed</span>
                                <span className="text-lg font-black text-white">{node.data.used}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Remaining</span>
                                <span className="text-lg font-black text-emerald-500">{calculateRemaining(node.data)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Max Node</span>
                                <span className="text-lg font-black text-gray-400">{node.data.limit}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Maintenance Footer */}
              <div className="flex items-center justify-between p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[24px]">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-indigo-500/70 uppercase tracking-[0.2em]">Network Last Synced</span>
                    <span className="text-[10px] text-gray-300 font-bold mt-1 tabular-nums">
                        {new Date(stats.lastReset).toLocaleDateString()} @ {new Date(stats.lastReset).toLocaleTimeString()}
                    </span>
                </div>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl text-gray-400 transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                  <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                  Flush Metrics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
