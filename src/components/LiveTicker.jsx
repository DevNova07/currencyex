import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getFlagUrl } from '../utils/currencies';

const TICKER_PAIRS = [
  { from: 'USD', fromFlag: 'us', to: 'INR', label: 'US Dollar' },
  { from: 'AED', fromFlag: 'ae', to: 'INR', label: 'UAE Dirham' },
  { from: 'GBP', fromFlag: 'gb', to: 'INR', label: 'British Pound' },
  { from: 'EUR', fromFlag: 'eu', to: 'INR', label: 'Euro' },
  { from: 'SAR', fromFlag: 'sa', to: 'INR', label: 'Saudi Riyal' },
  { from: 'KWD', fromFlag: 'kw', to: 'INR', label: 'Kuwaiti Dinar' },
];

const LiveTicker = () => {
  const [rates, setRates] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await res.json();
        const result = {};
        TICKER_PAIRS.forEach(pair => {
          const rate = data.rates[pair.from];
          if (rate) result[pair.from] = (1 / rate);
        });
        setRates(result);
        setLoaded(true);
      } catch (e) {
        console.error('Ticker fetch error:', e);
      }
    };
    fetchRates();
    // Refresh every 60 seconds
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate items for seamless loop
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS];

  return (
    <div className="w-full bg-gray-950 dark:bg-gray-900 border-b border-gray-800 overflow-hidden relative">
      {/* Live indicator */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3 bg-gradient-to-r from-gray-950 via-gray-950 to-transparent pr-8">
        <div className="flex items-center gap-1.5">
          <Activity size={11} className="text-green-400" />
          <span className="text-[9px] font-black text-green-400 uppercase tracking-[0.2em]">Live</span>
        </div>
      </div>

      {/* Fade right */}
      <div className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-gray-950 to-transparent" />

      {/* Scrolling ticker */}
      <div className="flex animate-ticker whitespace-nowrap pl-20">
        {items.map((pair, idx) => {
          const rate = rates[pair.from];
          // Deterministic simulated change
          const seed = pair.from.charCodeAt(0) * 3 + pair.from.charCodeAt(1);
          const change = (((seed % 10) - 5) * 0.1).toFixed(2);
          const isPositive = parseFloat(change) >= 0;

          return (
            <div
              key={`${pair.from}-${idx}`}
              className="inline-flex items-center gap-2 px-5 py-2 border-r border-gray-800 flex-shrink-0"
            >
              <img
                src={getFlagUrl(pair.fromFlag)}
                alt={pair.from}
                className="w-4 h-3 object-cover rounded-sm opacity-90 flex-shrink-0"
              />
              <span className="text-[11px] font-black text-gray-300 tracking-wide">
                {pair.from}/INR
              </span>
              <span className="text-[11px] font-black text-white tabular-nums">
                {loaded && rate ? rate.toFixed(3) : '---'}
              </span>
              <span className={`text-[9px] font-black flex items-center gap-0.5 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {isPositive ? '+' : ''}{change}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveTicker;
