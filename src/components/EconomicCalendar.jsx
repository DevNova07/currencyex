import React from 'react';
import { Calendar, Clock, Globe, AlertTriangle, ChevronRight, Info } from 'lucide-react';

const EVENTS = [
  { id: 1, title: 'US Consumer Price Index (CPI)', country: 'USA', impact: 'High', date: 'Apr 12', time: '18:00 IST', trend: 'Inflation Watch' },
  { id: 2, title: 'ECB Interest Rate Decision', country: 'EUR', impact: 'High', date: 'Apr 14', time: '17:45 IST', trend: 'Monetary Policy' },
  { id: 3, title: 'UK GDP Growth Rate (QoQ)', country: 'GBP', impact: 'Medium', date: 'Apr 15', time: '11:30 IST', trend: 'Economic Growth' },
  { id: 4, title: 'India Foreign Exchange Reserves', country: 'INR', impact: 'Low', date: 'Apr 17', time: '17:00 IST', trend: 'Stable' },
  { id: 5, title: 'US Retail Sales (MoM)', country: 'USA', impact: 'Medium', date: 'Apr 18', time: '18:00 IST', trend: 'Consumer Spending' },
  { id: 6, title: 'BoJ Monetary Policy Meeting', country: 'JPY', impact: 'High', date: 'Apr 26', time: '08:30 IST', trend: 'Yen Volatility' }
];

const EconomicCalendar = ({ t }) => {
  return (
    <div className="w-full premium-card p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{t.pulse}</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">High-Impact Market Events</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-800">
            <Globe size={10} /> Live Market Depth
        </div>
      </div>

      <div className="space-y-3">
        {EVENTS.map((event) => (
          <div 
            key={event.id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-800 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
                 <span className="text-[9px] font-black text-blue-500 leading-none">{event.date.split(' ')[0]}</span>
                 <span className="text-sm font-black text-gray-900 dark:text-white leading-tight">{event.date.split(' ')[1]}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">{event.title}</h4>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    event.impact === 'High' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                    event.impact === 'Medium' ? 'bg-orange-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {event.impact === 'High' ? t.impact_high : event.impact === 'Medium' ? t.impact_med : t.impact_low}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="text-gray-500 dark:text-gray-300">{event.country}</span>
                  <span>•</span>
                  <span>{event.trend}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-800">
               <div className="flex flex-col items-start sm:items-end">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-900 dark:text-gray-100">
                    <Clock size={12} className="text-blue-500" />
                    {event.time}
                  </div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Countdown: Active</span>
               </div>
               <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 flex items-start gap-3">
         <     Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
         <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-widest">
            {t.expert_tip}: High-impact events often cause 1-2% volatility in major currency pairs. Monitor rates closely during {EVENTS[0].date}.
         </p>
      </div>
    </div>
  );
};

export default EconomicCalendar;
