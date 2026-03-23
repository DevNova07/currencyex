import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Clock, Info } from 'lucide-react';
import axios from 'axios';
import { format, subDays } from 'date-fns';

const HistoricalComparison = ({ fromCurrency, toCurrency }) => {
  const [selectedDate, setSelectedDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [historicalRate, setHistoricalRate] = useState(null);
  const [currentRate, setCurrentRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Current Rate (Frankfurter)
      const currentRes = await axios.get(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
      const cRate = currentRes.data.rates[toCurrency];
      setCurrentRate(cRate);

      // Fetch Historical Rate
      const histRes = await axios.get(`https://api.frankfurter.app/${selectedDate}?from=${fromCurrency}&to=${toCurrency}`);
      const hRate = histRes.data.rates[toCurrency];
      setHistoricalRate(hRate);
    } catch (err) {
      setError("Unable to fetch historical data for this date.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [fromCurrency, toCurrency, selectedDate]);

  const calculateChange = () => {
    if (!historicalRate || !currentRate) return null;
    const change = ((currentRate - historicalRate) / historicalRate) * 100;
    return {
      value: Math.abs(change).toFixed(2),
      isPositive: change >= 0
    };
  };

  const change = calculateChange();
  const maxDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  return (
    <div className="w-full h-full p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-50 dark:border-gray-700 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Past Comparison</h3>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-0.5">Then vs Now</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar size={12} /> Select Past Date
            </label>
            <input 
              type="date"
              value={selectedDate}
              max={maxDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-400 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-gray-50 dark:bg-gray-900/30 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">On {selectedDate}</p>
              {loading ? (
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {historicalRate ? `${historicalRate.toFixed(4)}` : '--'}
                </p>
              )}
            </div>
            <div className="p-5 bg-gray-50 dark:bg-gray-900/30 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Rate</p>
              {loading ? (
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {currentRate ? `${currentRate.toFixed(4)}` : '--'}
                </p>
              )}
            </div>
          </div>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        ) : change && (
          <div className={`p-6 rounded-[2rem] border flex items-center justify-between ${
            change.isPositive 
              ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100/50 dark:border-green-900/30' 
              : 'bg-red-50/50 dark:bg-red-900/10 border-red-100/50 dark:border-red-900/30'
          }`}>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Performance</p>
              <div className="flex items-center gap-2">
                {change.isPositive ? (
                  <TrendingUp className="text-green-500" size={20} />
                ) : (
                  <TrendingDown className="text-red-500" size={20} />
                )}
                <span className={`text-2xl font-black ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {change.isPositive ? '+' : '-'}{change.value}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Verdict</p>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg no-underline ${
                change.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {change.isPositive ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 px-4 py-2 rounded-xl w-fit">
        <Info size={12} className="text-indigo-500" />
        <span>Historical Insight Analysis</span>
      </div>
    </div>
  );
};

export default HistoricalComparison;
