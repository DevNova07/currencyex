import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCcw, TrendingUp, Clock } from 'lucide-react';
import CurrencySelect from './CurrencySelect';
import { useCurrencyRates } from '../hooks/useCurrencyRates';

const CurrencyConverter = ({ fromCurrency, toCurrency, setFromCurrency, setToCurrency }) => {
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);

  const { data, loading, error } = useCurrencyRates(fromCurrency);

  useEffect(() => {
    if (data && data.rates[toCurrency]) {
      const rate = data.rates[toCurrency];
      setConvertedAmount((amount * rate).toFixed(2));
    }
  }, [data, toCurrency, amount]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const exchangeRate = data ? data.rates[toCurrency] : 1;
  const lastUpdated = data ? new Date(data.date).toLocaleDateString() : '';

  return (
    <div className="w-full h-full p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 border border-gray-50 dark:border-gray-700 flex flex-col justify-between">
      <div className="space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
            Conversion Tool
          </label>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">
            Enter Amount
          </label>
          <div className="relative group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-5 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-blue-400 dark:focus:border-blue-600 rounded-2xl text-3xl font-black text-gray-900 dark:text-gray-100 outline-none transition-all duration-300"
              placeholder="0.00"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm border border-gray-50 dark:border-gray-700">
              {fromCurrency}
            </div>
          </div>
        </div>

        {/* Currency Selectors */}
        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          <CurrencySelect
            label="From"
            value={fromCurrency}
            onChange={setFromCurrency}
          />

          <button
            onClick={handleSwap}
            className="md:mt-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all duration-300 transform active:scale-95 group z-10"
          >
            <ArrowLeftRight size={24} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>

          <CurrencySelect
            label="To"
            value={toCurrency}
            onChange={setToCurrency}
          />
        </div>

        {/* Result Area */}
        <div className="p-4 sm:p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:to-blue-900/20 rounded-[1.5rem] sm:rounded-[2rem] border border-blue-100/50 dark:border-blue-900/30 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold">
              <TrendingUp size={18} />
              <span className="text-xs uppercase tracking-[0.1em]">Live Converted Flow</span>
            </div>
            
            {loading ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-48 bg-blue-200/50 dark:bg-blue-800/50 rounded-lg"></div>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {convertedAmount}
                </h2>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{toCurrency}</span>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-5 text-[11px] text-gray-400 dark:text-gray-500 font-extrabold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Rate: 1.00 {fromCurrency} = {exchangeRate} {toCurrency}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-5">
                <Clock size={14} />
                <span>Sync: {lastUpdated}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/10 transition-colors duration-500"></div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-xs font-bold border border-red-100 dark:border-red-900/30">
            {error}. SYSTEM RETRY IN PROGRESS...
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
