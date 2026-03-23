import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, TrendingUp, Globe, Newspaper, Info, History } from 'lucide-react';
import CurrencyConverter from './components/CurrencyConverter';
import HistoryChart from './components/HistoryChart';
import HistoricalComparison from './components/HistoricalComparison';
import { useRateHistory } from './hooks/useRateHistory';

function App() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [timeframe, setTimeframe] = useState(7);

  // Auto-Detect User Location & Currency
  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data && data.currency) {
          // If user is in India, keep USD as base to check against INR.
          // For everywhere else (Dubai, UK etc), set their local currency as base.
          if (data.currency === 'INR') {
            setFromCurrency('USD');
            setToCurrency('INR');
          } else {
            setFromCurrency(data.currency);
            setToCurrency('INR');
          }
        }
      } catch (error) {
        console.log('Location auto-detect skipped (using defaults).');
      }
    };

    detectUserCurrency();
  }, []);

  const { data: historyData, loading: historyLoading } = useRateHistory(fromCurrency, toCurrency, timeframe);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-gray-950 transition-colors duration-500 selection:bg-blue-100 selection:text-blue-700 font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-50 dark:indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Professional Navbar */}
      <nav className="relative z-50 px-6 py-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-900 sticky top-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-transform group-hover:scale-105">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                Curency<span className="text-blue-600">Ex</span>
              </h1>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.3em] leading-none mt-1 block">
                Institutional Node
              </span>
            </div>
          </div>

          {/* Mobile: only clock */}
          <div className="flex md:hidden flex-col items-end">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Market Time</span>
            <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
              {currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Desktop: full bar */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-green-50 dark:bg-green-900/10 rounded-full border border-green-100 dark:border-green-900/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[10px] font-black text-green-700 dark:text-green-500 uppercase tracking-widest">
                Network: Optimal
              </span>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-900"></div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Global Market Time</span>
              <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                {currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-8 md:py-12">
        {/* Page Heading */}
        <div className="mb-6 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2 tracking-tight">Live Markets</h2>
          <p className="text-xs sm:text-sm font-bold text-blue-500 uppercase tracking-[0.3em]">Institutional Grade Data Feed</p>
        </div>

        <div className="space-y-8 sm:space-y-16">
          {/* Section 1: Main Converter (Reference Width) */}
          <div className="flex flex-col w-full max-w-4xl mx-auto">
            <div className="px-1 mb-6 flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-blue-500" />
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">Rapid Conversion</h3>
            </div>
            <div className="w-full">
              <CurrencyConverter
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                setFromCurrency={setFromCurrency}
                setToCurrency={setToCurrency}
              />
            </div>
          </div>

          {/* Section 2: Chart (Matched Width) */}
          <div className="flex flex-col pt-6 sm:pt-12 border-t border-gray-100 dark:border-gray-900 w-full max-w-4xl mx-auto">
            <div className="px-1 mb-6 flex items-center justify-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">Performance Metrics</h3>
            </div>
            <div className="w-full">
              <HistoryChart
                data={historyData}
                loading={historyLoading}
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
              />
            </div>
          </div>

          {/* Section 3: Historical Comparison (Matched Width) */}
          <div className="flex flex-col pt-6 sm:pt-12 border-t border-gray-100 dark:border-gray-900 w-full max-w-4xl mx-auto">
            <div className="px-1 mb-6 flex items-center justify-center gap-2">
              <History size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">Historical Audit</h3>
            </div>
            <div className="w-full">
              <HistoricalComparison
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer with Finance Links */}
      <footer className="relative z-10 mt-24 pb-12 pt-16 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Sparkles className="text-white" size={16} />
                </div>
                <span className="font-black text-gray-900 dark:text-white tracking-tighter text-xl">Currency<span className="text-blue-600">Ex</span></span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                Your professional gateway to global currency markets. Powered by real-time exchange nodes and historical analytical data.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Newspaper size={16} className="text-blue-500" /> Finance News
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.bloomberg.com/markets/currencies" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                    Bloomberg Currencies <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.reuters.com/markets/currencies/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                    Reuters FX Market <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.investing.com/currencies/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                    Investing.com Real-time <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Info size={16} className="text-blue-500" /> Quick Resources
              </h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-blue-600">Trading Guides</a></li>
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-blue-600">Market Hours</a></li>
                <li><a href="#" className="text-sm font-bold text-gray-400 hover:text-blue-600">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.1em]">
              © 2026 CurrencyEx • Professional FinTech Solution
            </p>
            <div className="flex items-center gap-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Status: Optimal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
