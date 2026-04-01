import React from 'react';
import { Layers, Info, Filter } from 'lucide-react';

const PAIRS = ['USD/EUR', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'];

const CORRELATIONS = [
  [1.0, 0.85, -0.42, 0.12, 0.35],
  [0.85, 1.0, -0.28, 0.45, 0.12],
  [-0.42, -0.28, 1.0, -0.65, -0.12],
  [0.12, 0.45, -0.65, 1.0, 0.78],
  [0.35, 0.12, -0.12, 0.78, 1.0]
];

const CorrelationHeatmap = ({ t }) => {
  return (
    <div className="w-full premium-card p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-500">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">Correlation Heatmap</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Asset Relationship Intelligence</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
            <button className="p-2 bg-gray-100 dark:bg-[#12141c] rounded-xl text-gray-400 hover:text-indigo-500 transition-colors border border-transparent hover:border-indigo-100/30">
              <Filter size={16} />
            </button>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[400px]">
          <div className="grid grid-cols-6 gap-2 mb-2">
             <div className="w-10 h-10"></div>
             {PAIRS.map(p => (
               <div key={p} className="flex items-center justify-center p-2">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest vertical-rl transform rotate-360 text-center">{p}</span>
               </div>
             ))}
          </div>

          <div className="space-y-2">
            {PAIRS.map((pair, rowIdx) => (
              <div key={pair} className="grid grid-cols-6 gap-2 items-center">
                <div className="text-right pr-2">
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{pair}</span>
                </div>
                {CORRELATIONS[rowIdx].map((val, colIdx) => {
                  const isPositive = val >= 0;
                  const intensity = Math.abs(val);
                  
                  return (
                    <div 
                      key={colIdx}
                      className="group relative aspect-square rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:z-20 border border-transparent dark:border-white/5 shadow-sm overflow-hidden"
                      style={{
                        backgroundColor: isPositive 
                          ? `rgba(99, 102, 241, ${intensity * 0.95})` 
                          : `rgba(239, 68, 68, ${intensity * 0.95})`
                      }}
                      title={`${PAIRS[rowIdx]} / ${PAIRS[colIdx]}: ${val.toFixed(2)}`}
                    >
                       <span className={`text-[10px] font-black tracking-tight ${intensity > 0.5 ? 'text-white' : 'text-gray-400 dark:text-gray-200'}`}>
                         {val.toFixed(2)}
                       </span>
                       
                       <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 grayscale opacity-50 contrast-125">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                <span className="text-[8px] font-black text-gray-400 uppercase">Negative</span>
             </div>
             <div className="flex items-center gap-1.5 grayscale opacity-50 contrast-125">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[8px] font-black text-gray-400 uppercase">Positive</span>
             </div>
         </div>
         <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            <Info size={12} className="text-indigo-500" /> 
            30-Day Rolling Window
         </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
