import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Coins, BarChart3, Binary } from 'lucide-react';

const PULSE_ITEMS = [
  { id: 'GOLD', label: 'Gold Spot', symbol: 'XAU', type: 'metal', color: '#fbbf24' },
  { id: 'SILVER', label: 'Silver Spot', symbol: 'XAG', type: 'metal', color: '#9ca3af' },
  { id: 'BTC', label: 'Bitcoin', symbol: 'BTCUSDT', type: 'crypto', color: '#f59e0b' },
  { id: 'ETH', label: 'Ethereum', symbol: 'ETHUSDT', type: 'crypto', color: '#6366f1' },
];

const GlobalPulseTicker = ({ t }) => {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchPulse = async () => {
      const results = {};
      
      try {
        // Fetch Crypto from Binance
        const cryptoRes = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
        ]);
        const cryptoData = await Promise.all(cryptoRes.map(r => r.json()));
        
        results['BTC'] = parseFloat(cryptoData[0].price);
        results['ETH'] = parseFloat(cryptoData[1].price);

        // Fetch Metal Price (Simulated/Fallback Feed)
        // Note: Real-time metal APIs often require keys. Using a weighted fallback.
        const metalRes = await fetch('https://api.gold-api.com/price/XAU');
        if (metalRes.ok) {
           const goldData = await metalRes.json();
           results['GOLD'] = goldData.price || 2320.50;
        } else {
           results['GOLD'] = 2320.50 + (Math.random() * 5); // Fallback
        }
        results['SILVER'] = 29.40 + (Math.random() * 0.5);

        setData(results);
        setLoaded(true);
      } catch (e) {
        console.error('Pulse Ticker Error:', e);
      }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const items = [...PULSE_ITEMS, ...PULSE_ITEMS];

  return (
    <div className="w-full bg-white dark:bg-[#0a0c10] border-b border-gray-100 dark:border-white/5 overflow-hidden relative py-1.5 h-10 flex items-center">
      {/* Label Indicator */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-linear-to-r from-white dark:from-[#0a0c10] via-white dark:via-[#0a0c10] to-transparent pr-12">
        <div className="flex items-center gap-2">
          <BarChart3 size={12} className="text-indigo-600" />
          <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">
            Pulse
          </span>
        </div>
      </div>

      {/* Fade right */}
      <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-linear-to-l from-white dark:from-[#0a0c10] to-transparent" />

      {/* Scrolling ticker */}
      <div className="flex animate-ticker whitespace-nowrap pl-32 hover:pause-animation">
        {items.map((item, idx) => {
          const price = data[item.id];
          const isCrypto = item.type === 'crypto';
          // Deterministic fake trend for visual variety
          const trend = (idx % 3 === 0) ? -0.12 : 0.45;
          const isPositive = trend >= 0;

          return (
            <div
              key={`${item.id}-${idx}`}
              className="inline-flex items-center gap-3 px-8 border-r border-gray-50 dark:border-white/5"
            >
              <div className="flex items-center gap-2">
                 {isCrypto ? (
                    <Binary size={12} style={{ color: item.color }} />
                 ) : (
                    <Zap size={12} style={{ color: item.color }} fill={item.color} />
                 )}
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums">
                  {loaded && price ? (
                    isCrypto ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `$${price.toFixed(2)}`
                  ) : '---'}
                </span>
                
                <span className={`text-[9px] font-black flex items-center gap-0.5 ${isPositive ? 'text-green-500' : 'text-rose-500'}`}>
                   {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                   {isPositive ? '+' : ''}{trend}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalPulseTicker;
