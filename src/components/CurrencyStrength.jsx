import React from 'react';
import { Activity, TrendingUp, TrendingDown, Info } from 'lucide-react';

const STRENGTH_DATA = [
  { code: 'USD', strength: 85, trend: '+0.45%', status: 'Bullish' },
  { code: 'EUR', strength: 42, trend: '-0.12%', status: 'Neutral' },
  { code: 'GBP', strength: 68, trend: '+0.28%', status: 'Bullish' },
  { code: 'JPY', strength: 15, trend: '-0.85%', status: 'Bearish' },
  { code: 'INR', strength: 55, trend: '+0.15%', status: 'Neutral' },
  { code: 'AED', strength: 75, trend: '+0.32%', status: 'Bullish' }
];

const CurrencyStrength = ({ t }) => {
  return (
    <div className="w-full premium-card p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-500">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">Market Momentum Gauge</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Real-time Currency Strength Index</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-800">
            <Info size={10} /> Calculation Node: Active
        </div>
      </div>

      <div className="space-y-4">
        {STRENGTH_DATA.map((currency) => (
          <div key={currency.code} className="space-y-1.5 group">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{currency.code}</span>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                  currency.status === 'Bullish' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  currency.status === 'Bearish' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-gray-500/10 text-gray-500'
                }`}>
                  {currency.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black flex items-center gap-0.5 ${currency.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {currency.trend.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {currency.trend}
                </span>
                <span className="text-[10px] font-black text-gray-400 transition-colors group-hover:text-indigo-500">{currency.strength}%</span>
              </div>
            </div>
            
            <div className="h-2 w-full bg-gray-100 dark:bg-[#0a0c10]/40 rounded-full overflow-hidden border border-gray-50 dark:border-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${
                  currency.strength > 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                  currency.strength > 40 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                }`}
                style={{ width: `${currency.strength}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 p-4 bg-gray-50 dark:bg-[#12141c] rounded-2xl border border-gray-100 dark:border-white/5 flex items-start gap-3">
         <TrendingUp size={16} className="text-indigo-500 mt-0.5" />
         <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-widest">
            Expert Context: USD index (DXY) dominance continues as inflation data remains sticky. EUR/USD under pressure from central bank divergence.
         </p>
      </div>
    </div>
  );
};

export default CurrencyStrength;
