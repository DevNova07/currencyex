import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Trash2, TrendingUp, DollarSign, Calculator } from 'lucide-react';

const PortfolioTracker = ({ rates, baseCurrency, t }) => {
  const [holdings, setHoldings] = useState([
    { currency: 'USD', amount: 1000 },
    { currency: 'EUR', amount: 500 }
  ]);
  const [newCurrency, setNewCurrency] = useState('GBP');
  const [newAmount, setNewAmount] = useState('');

  const availableCurrencies = Object.keys(rates || {}).sort();

  const totalValue = useMemo(() => {
    if (!rates) return 0;
    return holdings.reduce((acc, holding) => {
      const rate = rates[holding.currency];
      if (!rate) return acc;
      // Convert holding to base currency: amount / rateToTarget (if rates are vs Base)
      // Standard API gives rates as 1 Base = X Target.
      // So BaseValue = Amount / Rate
      return acc + (holding.amount / rate);
    }, 0);
  }, [holdings, rates]);

  const addHolding = () => {
    if (!newAmount || isNaN(newAmount)) return;
    setHoldings([...holdings, { currency: newCurrency, amount: parseFloat(newAmount) }]);
    setNewAmount('');
  };

  const removeHolding = (index) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full premium-card p-6 sm:p-8 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
            <Wallet size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{t.portfolio}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t.track_holdings}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{t.total_val}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className="text-xs font-black text-gray-500">{baseCurrency}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
          <Calculator className="text-gray-300 dark:text-gray-700 hidden sm:block" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Holdings List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.active_holdings}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.amount}</span>
          </div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {holdings.map((item, idx) => (
              <div key={idx} className="group flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-800 rounded-[1.25rem] border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center font-black text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                    {item.currency}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.currency} {t.holding}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{t.live_node}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-black text-gray-900 dark:text-white">{item.amount.toLocaleString()}</p>
                  <button 
                    onClick={() => removeHolding(idx)}
                    className="p-1.5 text-gray-300 hover:text-red-500 dark:text-gray-700 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Asset Card */}
        <div className="p-6 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-4xl border border-emerald-100/50 dark:border-emerald-900/20 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Plus size={14} /> {t.add_asset}
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest ml-1">{t.asset_cur}</label>
                <select 
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-black text-gray-900 dark:text-white outline-none focus:ring-1 ring-emerald-500"
                >
                  {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest ml-1">{t.qty}</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-black text-gray-900 dark:text-white outline-none focus:ring-1 ring-emerald-500"
                  />
                  <DollarSign size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-200" />
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={addHolding}
            className="w-full mt-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_10px_30px_rgba(20,138,103,0.3)] hover:scale-102 flex items-center justify-center gap-2"
          >
            {t.update_port} <TrendingUp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTracker;
