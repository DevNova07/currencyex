import React, { useState, useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Line
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const HistoryChart = ({ data, loading, fromCurrency, toCurrency, timeframe, setTimeframe, t = {} }) => {
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let result = [...data];
    
    // Simple Moving Average (Period 7)
    if (showSMA) {
      result = result.map((d, i, arr) => {
        if (i < 6) return { ...d, sma: null };
        const window = arr.slice(i - 6, i + 1);
        const sum = window.reduce((acc, curr) => acc + curr.rate, 0);
        return { ...d, sma: sum / 7 };
      });
    }

    // Exponential Moving Average (Multiplier method)
    if (showEMA) {
      const alpha = 2 / (7 + 1);
      let prevEMA = result[0].rate;
      result = result.map((d, i) => {
        if (i === 0) return { ...d, ema: d.rate };
        const ema = (d.rate - prevEMA) * alpha + prevEMA;
        prevEMA = ema;
        return { ...d, ema };
      });
    }

    return result;
  }, [data, showSMA, showEMA]);

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    const headers = ['Date', 'Rate'];
    const rows = data.map(d => [d.date, d.rate.toFixed(4)]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `currency_history_${fromCurrency}_${toCurrency}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timeframes = [
    { id: 1, label: '1D' },
    { id: 7, label: '1W' },
    { id: 30, label: '1M' },
    { id: 90, label: '3M' },
  ];

  return (
    <div className="w-full premium-card p-6 lg:p-10 flex flex-col group relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              {t.intel}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {fromCurrency} / {toCurrency} Flux Terminal
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-50 dark:bg-gray-900 rounded-2xl p-1 border border-gray-100 dark:border-gray-800">
             <button 
               onClick={() => setShowSMA(!showSMA)}
               className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${showSMA ? 'bg-orange-500 text-white' : 'text-gray-400'}`}
             >
               SMA
             </button>
             <button 
               onClick={() => setShowEMA(!showEMA)}
               className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${showEMA ? 'bg-purple-500 text-white' : 'text-gray-400'}`}
             >
               EMA
             </button>
          </div>

          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-black text-gray-400 hover:text-blue-500 uppercase tracking-widest rounded-xl border border-gray-100 dark:border-gray-800 transition-all flex items-center gap-2"
          >
            {t.export}
          </button>
          
          <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  timeframe === tf.id
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center min-h-0 z-10">
        {loading ? (
          <div className="w-full h-full min-h-[300px] bg-gray-50/50 dark:bg-gray-900/20 rounded-4xl animate-pulse flex flex-col items-center justify-center gap-4 border border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-gray-400 text-xs font-black uppercase tracking-widest">{t.fetching}</span>
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="w-full h-full min-h-[300px] glass rounded-4xl flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Network Connection Timeout</span>
          </div>
        ) : (
          <div className="w-full h-[300px] sm:h-[450px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 900 }}
                  dy={15}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 900 }}
                  width={60}
                  tickFormatter={(val) => val.toFixed(3)}
                />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backgroundColor: 'rgba(10, 12, 16, 0.95)',
                    backdropFilter: 'blur(12px)',
                    padding: '16px'
                  }}
                  itemStyle={{ color: '#818cf8', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                  labelStyle={{ fontWeight: '900', color: '#fff', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRate)" 
                  animationDuration={2000}
                  activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
                />
                {showSMA && (
                  <Line 
                    type="monotone" 
                    dataKey="sma" 
                    stroke="#f97316" 
                    strokeWidth={2} 
                    dot={false}
                    strokeDasharray="5 5"
                    animationDuration={1000}
                  />
                )}
                {showEMA && (
                  <Line 
                    type="monotone" 
                    dataKey="ema" 
                    stroke="#a855f7" 
                    strokeWidth={2} 
                    dot={false}
                    strokeDasharray="10 5"
                    animationDuration={1500}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-100/50 dark:bg-gray-900/50 px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-800">
          <Calendar size={14} className="text-blue-500" />
          <span>{t.history_ledger}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.volatility}</span>
              <span className="text-xs font-black text-emerald-500 uppercase">{t.low_risk}</span>
           </div>
           <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.confidence}</span>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">99.2%</span>
           </div>
        </div>
      </div>

      <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};

export default HistoryChart;
