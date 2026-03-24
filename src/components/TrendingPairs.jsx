import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Flame, RefreshCcw } from 'lucide-react';
import { getFlagUrl } from '../utils/currencies';
import { format, subDays } from 'date-fns';

const WATCH_LIST = [
  { code: 'USD', flag: 'us', name: 'US Dollar' },
  { code: 'AED', flag: 'ae', name: 'UAE Dirham' },
  { code: 'GBP', flag: 'gb', name: 'British Pound' },
  { code: 'EUR', flag: 'eu', name: 'Euro' },
  { code: 'SAR', flag: 'sa', name: 'Saudi Riyal' },
  { code: 'KWD', flag: 'kw', name: 'Kuwaiti Dinar' },
  { code: 'JPY', flag: 'jp', name: 'Japanese Yen' },
  { code: 'CAD', flag: 'ca', name: 'Canadian Dollar' },
  { code: 'CHF', flag: 'ch', name: 'Swiss Franc' },
  { code: 'AUD', flag: 'au', name: 'Australian Dollar' },
  { code: 'CNY', flag: 'cn', name: 'Chinese Yuan' },
  { code: 'SGD', flag: 'sg', name: 'Singapore Dollar' },
];

const TrendingPairs = ({ onSelect }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch today and yesterday rates (base USD)
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

        const [todayRes, yestRes] = await Promise.all([
          fetch('https://api.exchangerate-api.com/v4/latest/USD'),
          fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${yesterday}/v1/currencies/usd.json`),
        ]);

        const todayData = await todayRes.json();
        const yestData = await yestRes.json();

        const calculated = WATCH_LIST.map(cur => {
          const todayRate = todayData.rates[cur.code];
          const yestRate = yestData?.usd?.[cur.code.toLowerCase()];
          let change = null;
          if (todayRate && yestRate) {
            change = ((todayRate - yestRate) / yestRate * 100);
          }
          return { ...cur, rate: todayRate, change };
        }).filter(c => c.change !== null)
          .sort((a, b) => b.change - a.change);

        setItems(calculated);
      } catch (e) {
        console.error('TrendingPairs fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sorted = [...items].sort((a, b) => b.change - a.change);
  const gainers = sorted.slice(0, 3);
  const losers = sorted.slice(-3).reverse();

  const CurrencyCard = ({ cur, positive }) => (
    <button
      onClick={() => onSelect && onSelect(cur.code, 'INR')}
      className={`group flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-300 active:scale-95 w-full text-left ${positive
          ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700'
          : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700'
        }`}
    >
      <div className="flex items-center gap-2.5">
        <img
          src={getFlagUrl(cur.flag)}
          alt={cur.code}
          className="w-7 h-5 object-cover rounded-sm shadow-sm flex-shrink-0"
        />
        <div>
          <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{cur.code}</p>
          <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 tabular-nums mt-0.5">
            ${cur.rate ? cur.rate.toFixed(3) : '—'}
          </p>
        </div>
      </div>
      <div className={`flex flex-col items-end gap-0.5 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
        <div className="flex items-center gap-1 text-xs font-black">
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {positive ? '+' : ''}{cur.change?.toFixed(2)}%
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">vs yday</span>
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="px-1 mb-5 flex items-center justify-center gap-2">
          <Flame size={18} className="text-orange-500" />
          <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">Trending Today</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-1 mb-5 flex items-center justify-center gap-2">
        <Flame size={18} className="text-orange-500" />
        <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
          Trending Today
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Gainers */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp size={13} className="text-green-500" />
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Top Gainers</span>
          </div>
          {gainers.map(cur => <CurrencyCard key={cur.code} cur={cur} positive={cur.change >= 0} />)}
        </div>

        {/* Losers */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingDown size={13} className="text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Top Losers</span>
          </div>
          {losers.map(cur => <CurrencyCard key={cur.code} cur={cur} positive={cur.change >= 0} />)}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <RefreshCcw size={11} />
        <span>vs Yesterday · Tap to convert</span>
      </div>
    </div>
  );
};

export default TrendingPairs;
