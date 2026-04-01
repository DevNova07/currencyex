import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCcw, TrendingUp, Clock, Star, Bell } from 'lucide-react';
import CurrencySelect from './CurrencySelect';
import { useCurrencyRates } from '../hooks/useCurrencyRates';

const CurrencyConverter = ({ fromCurrency, toCurrency, setFromCurrency, setToCurrency, amount, setAmount, toggleFavorite, isFavorite, t }) => {
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [includeMarkup, setIncludeMarkup] = useState(false);

  const { data, loading, error } = useCurrencyRates(fromCurrency);

  useEffect(() => {
    if (data && data.rates[toCurrency]) {
      let rate = data.rates[toCurrency];
      if (includeMarkup) {
        rate = rate * 1.02; // Add 2% bank markup
      }
      const numericAmount = parseFloat(amount) || 0;
      setConvertedAmount((numericAmount * rate).toFixed(2));
    }
  }, [data, toCurrency, amount, includeMarkup]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const exchangeRate = data ? data.rates[toCurrency] : 1;
  const effectiveRate = includeMarkup ? exchangeRate * 1.02 : exchangeRate;
  const lastUpdated = data ? new Date(data.date).toLocaleDateString() : '';

  return (
    <div className="w-full h-full p-6 sm:p-10 premium-card flex flex-col justify-between group overflow-hidden relative">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-700"></div>
      <div className="space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t.conv_tool}
          </label>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">
            {t.enter_amt}
          </label>
          <div className="relative group">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                  setAmount(val);
                }
              }}
              className="w-full p-5 bg-gray-50 dark:bg-[#0a0c10]/40 border border-transparent focus:border-indigo-400 dark:focus:border-indigo-600 rounded-2xl text-3xl font-black text-gray-900 dark:text-gray-100 outline-none transition-all duration-300"
              placeholder="0.00"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm border border-gray-50 dark:border-gray-700">
              {fromCurrency}
            </div>
          </div>
        </div>

        {/* Currency Selectors */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-6 relative">
          <CurrencySelect
            label={t.from}
            value={fromCurrency}
            onChange={setFromCurrency}
            t={t}
          />

          <button
            onClick={handleSwap}
            className="translate-y-3 md:translate-y-0 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all duration-300 transform active:scale-95 group z-10"
          >
            <ArrowLeftRight size={24} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>

          <CurrencySelect
            label={t.to}
            value={toCurrency}
            onChange={setToCurrency}
            t={t}
          />
        </div>

        {/* Result Area */}
        <div className="p-4 sm:p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:to-blue-900/20 rounded-[1.5rem] sm:rounded-[2rem] border border-blue-100/50 dark:border-blue-900/30 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                <TrendingUp size={18} />
                <span className="text-xs uppercase tracking-[0.1em]">{t.live_flow}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Save to Favorites (Only for Logged In) */}
                {toggleFavorite && (
                  <button 
                    onClick={() => toggleFavorite(fromCurrency, toCurrency)}
                    className={`p-2 rounded-xl transition-all duration-300 ${isFavorite ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-gray-100 dark:bg-[#12141c] text-gray-400 hover:text-indigo-500 hover:border-indigo-500/30'}`}
                    title={isFavorite ? t.favorites : t.favorites}
                  >
                    <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                )}

                {/* Markup Toggle */}
              <label className="flex items-center gap-2 cursor-pointer group/toggle">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="appearance-none w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded-full checked:bg-indigo-500 transition-colors duration-300 cursor-pointer"
                    checked={includeMarkup}
                    onChange={(e) => setIncludeMarkup(e.target.checked)}
                  />
                  <div className={`absolute w-3 h-3 bg-white rounded-full transition-transform duration-300 left-0.5 pointer-events-none ${includeMarkup ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-gray-500 dark:text-gray-400 group-hover/toggle:text-gray-900 dark:group-hover/toggle:text-gray-200 transition-colors">
                  {t.bank_fee}
                </span>
              </label>
            </div>
          </div>

            {loading ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-48 bg-blue-200/50 dark:bg-blue-800/50 rounded-lg"></div>
              </div>
            ) : (
              <div className="group/result flex items-center justify-between w-full">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {convertedAmount}
                  </h2>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{toCurrency}</span>
                </div>
                
                <button 
                  onClick={() => {
                    const alerts = JSON.parse(localStorage.getItem('price_alerts') || '[]');
                    const newAlert = { from: fromCurrency, to: toCurrency, target: exchangeRate, date: new Date().toISOString() };
                    localStorage.setItem('price_alerts', JSON.stringify([...alerts, newAlert]));
                    alert(`${t.alert_set}: ${fromCurrency}/${toCurrency} @ ${exchangeRate.toFixed(4)}`);
                  }}
                  className="p-3 bg-gray-50 dark:bg-[#12141c] rounded-2xl text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-gray-100 dark:border-white/5 group-hover/result:translate-y-0 translate-y-2 opacity-0 group-hover/result:opacity-100 duration-300"
                  title={t.notify}
                >
                  <Bell size={20} />
                </button>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-5 text-[11px] text-gray-400 dark:text-gray-500 font-extrabold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                <span>{t.rate}: 1.00 {fromCurrency} = {effectiveRate.toFixed(4)} {toCurrency}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-5">
                <Clock size={14} />
                <span>{t.sync}: {lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-xs font-bold border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
