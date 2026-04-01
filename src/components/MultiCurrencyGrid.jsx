import React from 'react';
import { Globe, ArrowUpRight, TrendingUp } from 'lucide-react';

const BASKET = [
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'SAR', name: 'Saudi Riyal' }
];

const MultiCurrencyGrid = ({ amount, rates, baseCurrency, t }) => {
  if (!rates) return null;

  return (
    <div className="w-full premium-card p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-500 shadow-sm border border-indigo-100/10">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{t?.grid || 'Global Conversion Grid'}</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Live conversion for {amount} {baseCurrency}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100/50 dark:border-emerald-800">
            <TrendingUp size={10} /> Market Depth Active
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BASKET.map((target) => {
          const rate = rates[target.code];
          const converted = rate ? (parseFloat(amount) * rate).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '---';
          
          return (
            <div 
              key={target.code}
              className="group p-4 bg-gray-50/50 dark:bg-[#0a0c10]/40 hover:bg-white dark:hover:bg-[#12141c] rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all duration-300 shadow-sm overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{target.code}</span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{converted}</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{target.name}</span>
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiCurrencyGrid;
