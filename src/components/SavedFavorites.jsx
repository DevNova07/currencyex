import React, { useState, useEffect } from 'react';
import { Star, Trash2, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Mini Sparkline component for watchlist
const Sparkline = ({ positive }) => {
  const [data] = useState(() => 
    Array.from({ length: 15 }).map((_, i) => ({
      value: 80 + Math.random() * (positive ? 40 : 20) + (positive ? i * 2 : -i * 2)
    }))
  );
  
  return (
    <div className="h-8 w-20 opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={positive ? '#22c55e' : '#ef4444'} 
            fill={positive ? '#22c55e' : '#ef4444'} 
            fillOpacity={0.1} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const SavedFavorites = ({ favorites, onRemove, onSelect, user, t }) => {
  if (!user) return null;

  return (
    <div className="w-full premium-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-500">
            <Star size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{t.favorites}</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{t.quick_access} {user?.name || 'User'}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {favorites.length} {t.tracked}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm">
            <TrendingUp size={24} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="max-w-[180px]">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-widest">
              {t.watchlist_empty}. {t.click_to_track}.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((pair, idx) => {
            const isUpmkt = (pair.from.charCodeAt(0) + pair.to.charCodeAt(0)) % 2 === 0;
            return (
              <div 
                key={idx}
                className="group relative bg-gray-50/80 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-800 p-5 rounded-3xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 hover:shadow-[0_15px_35px_rgba(37,99,235,0.06)] transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => onSelect(pair.from, pair.to)}
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="text-base font-black text-gray-900 dark:text-white uppercase">{pair.from}</span>
                       <ArrowRightLeft size={10} className="text-gray-400" />
                       <span className="text-base font-black text-gray-900 dark:text-white uppercase">{pair.to}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(pair);
                      }}
                      className="p-1 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                       <span className={`text-xs font-black flex items-center gap-1 ${isUpmkt ? 'text-green-500' : 'text-red-500'}`}>
                          {isUpmkt ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isUpmkt ? '+0.42%' : '-0.15%'}
                       </span>
                       <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active Node Update</span>
                    </div>
                    <Sparkline positive={isUpmkt} />
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-2xl -translate-y-6 translate-x-6"></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedFavorites;
