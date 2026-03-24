import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, TrendingUp, Globe, Newspaper, Info, History, User as UserIcon } from 'lucide-react';
import CurrencyConverter from './components/CurrencyConverter';
import HistoryChart from './components/HistoryChart';
import HistoricalComparison from './components/HistoricalComparison';
import TrendingPairs from './components/TrendingPairs';
import LiveTicker from './components/LiveTicker';
import RemittanceComparison from './components/RemittanceComparison';
import MarketNews from './components/MarketNews';
import AIChatbot from './components/AIChatbot';
import AuthModal from './components/AuthModal';
import SavedFavorites from './components/SavedFavorites';
import { useRateHistory } from './hooks/useRateHistory';

function App() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('currency-favorites');
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });
  const [timeframe, setTimeframe] = useState(7);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

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

  // Handle PWA Install Prompt
  useEffect(() => {
    // Don't show if user already dismissed
    if (localStorage.getItem('pwa-dismissed') === 'true') return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setShowInstallBtn(false);
    setDeferredPrompt(null);
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-dismissed', 'true');
    }
  };

  const handleInstallDismiss = () => {
    setShowInstallBtn(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  const { data: historyData, loading: historyLoading } = useRateHistory(fromCurrency, toCurrency, timeframe);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('currency-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (from, to) => {
    const exists = favorites.find(f => f.from === from && f.to === to);
    if (exists) {
      setFavorites(favorites.filter(f => !(f.from === from && f.to === to)));
    } else {
      setFavorites([...favorites, { from, to }]);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 transition-colors duration-500 selection:bg-blue-100 selection:text-blue-700 font-sans relative">

      {/* PWA Install Prompt (Floating popup) */}
      {showInstallBtn && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] bg-white/90 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-[0_20px_50px_rgba(37,99,235,0.15)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none flex-shrink-0">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">Install CurrencyEx</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Add to Home Screen</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            Get App
          </button>
          <button
            onClick={handleInstallDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0 p-1"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
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
                Currency<span className="text-blue-600">Ex</span>
              </h1>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.3em] leading-none mt-1 block">
                Institutional Node
              </span>
            </div>
          </div>

          {/* Mobile: clock and auth */}
          <div className="flex md:hidden items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Time</span>
              <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums">
                {currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {user ? (
              <button 
                onClick={() => setUser(null)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center text-white font-black text-[12px] transform transition-transform active:scale-95"
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </button>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                <UserIcon size={18} />
              </button>
            )}
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

            <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-900 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Authenticated</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{user?.name || 'User'}</p>
                </div>
                <button 
                  onClick={() => setUser(null)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-white font-black text-xs transform hover:scale-110 transition-all active:scale-95"
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <UserIcon size={14} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Live Currency Ticker */}
      <LiveTicker />

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
                toggleFavorite={user ? toggleFavorite : null}
                isFavorite={favorites.some(f => f.from === fromCurrency && f.to === toCurrency)}
              />
            </div>
          </div>

          {/* Section 1.5: Trending Pairs */}
          <div className="flex flex-col pt-6 sm:pt-12 border-t border-gray-100 dark:border-gray-900 w-full max-w-4xl mx-auto">
            <TrendingPairs
              onSelect={(from, to) => {
                setFromCurrency(from);
                setToCurrency(to);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* Section 1.7: Saved Favorites (Only for Logged In) */}
          {user && (
            <div className="flex flex-col pt-6 sm:pt-12 border-t border-gray-100 dark:border-gray-900 w-full max-w-4xl mx-auto">
              <SavedFavorites 
                user={user}
                favorites={favorites}
                onRemove={(pair) => toggleFavorite(pair.from, pair.to)}
                onSelect={(from, to) => {
                  setFromCurrency(from);
                  setToCurrency(to);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {/* Section 4: Remittance Comparison */}
          <div className="flex flex-col pt-6 sm:pt-12 border-t border-gray-100 dark:border-gray-900 w-full max-w-4xl mx-auto">
            <div className="px-1 mb-6 flex items-center justify-center gap-2">
              <Globe size={18} className="text-emerald-500" />
              <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">Remittance Providers</h3>
            </div>
            <div className="w-full">
              <RemittanceComparison
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
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

      <MarketNews />

      <AIChatbot />

      {/* Enhanced Footer with Finance Links */}
      <footer className="relative z-10 mt-0 pb-12 pt-16 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950">
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

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={(userData) => setUser(userData)}
      />
    </div>
  );
}

export default App;
