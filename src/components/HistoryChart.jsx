import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const HistoryChart = ({ data, loading, fromCurrency, toCurrency, timeframe, setTimeframe }) => {
  const timeframes = [
    { id: 1, label: '1D' },
    { id: 7, label: '1W' },
    { id: 30, label: '1M' },
  ];

  const getAiSuggestion = () => {
    if (!data || data.length < 2) return null;
    
    const rates = data.map(d => d.rate);
    const currentRate = rates[rates.length - 1];
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    
    const range = maxRate - minRate;
    if (range === 0) return { text: "Market is stable. Safe to send.", badge: "bg-gray-500/10 text-gray-500 border-gray-200 dark:border-gray-800" };
    
    const position = (currentRate - minRate) / range;
    const tfText = timeframe === 1 ? '24-hour' : timeframe === 7 ? '7-day' : '30-day';

    if (position > 0.8) {
      return { 
        text: `✅ Great time to send! Rate is near ${tfText} highs.`, 
        badge: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30" 
      };
    } else if (position < 0.2) {
      return { 
        text: `⏳ Wait if possible. Rates are near ${tfText} lows.`, 
        badge: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30" 
      };
    } else if (position > 0.5) {
      return { 
        text: `📈 Good time to send. Rate is above ${tfText} average.`, 
        badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30" 
      };
    } else {
      return { 
        text: `📉 Fair time to send. Rate is below ${tfText} average.`, 
        badge: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/30" 
      };
    }
  };

  const aiSuggestion = getAiSuggestion();

  return (
    <div className="w-full h-full p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 border border-gray-50 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Market Trends
            </h3>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-0.5">
              {fromCurrency} to {toCurrency}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                timeframe === tf.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {aiSuggestion && !loading && (
        <div className={`mb-6 p-3 sm:px-5 rounded-2xl border shadow-sm transition-all duration-500 flex items-center justify-center text-center sm:text-left sm:justify-start gap-2 ${aiSuggestion.badge}`}>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none">{aiSuggestion.text}</span>
        </div>
      )}

      <div className="flex-grow flex flex-col justify-center min-h-0">
        {loading ? (
          <div className="w-full h-full min-h-[250px] bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl animate-pulse flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-gray-400 text-sm font-medium">Fetching market data...</span>
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="w-full h-full min-h-[250px] bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 font-medium">Market data temporarily unavailable</span>
          </div>
        ) : (
          <div className="w-full h-[250px] sm:h-[400px] relative">
            <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                  width={40}
                  tickFormatter={(val) => val.toFixed(2)}
                />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRate)" 
                  animationDuration={1500}
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-shrink-0 items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 px-4 py-2 rounded-xl w-fit">
        <Calendar size={12} />
        <span>Real-time Market Feed</span>
      </div>
    </div>
  );
};

export default HistoryChart;
