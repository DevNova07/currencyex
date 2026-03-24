import React, { useState } from 'react';
import { useCurrencyRates } from '../hooks/useCurrencyRates';
import { Send, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const PROVIDERS = [
  {
    id: 'wise',
    name: 'Wise (TransferWise)',
    icon: Zap,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    feeStructure: { type: 'mixed', fixed: 1.0, percent: 0.005 }, // $1 + 0.5%
    exchangeMargin: 0, // No markup on exchange rate
    speed: 'Minutes'
  },
  {
    id: 'remitly',
    name: 'Remitly',
    icon: Send,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    feeStructure: { type: 'fixed', fixed: 3.99 }, // $3.99 flat
    exchangeMargin: 0.008, // 0.8% markup
    speed: 'Express (Mins)'
  },
  {
    id: 'wu',
    name: 'Western Union',
    icon: ShieldCheck,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    feeStructure: { type: 'fixed', fixed: 0 }, // Often 0 fee to bank
    exchangeMargin: 0.015, // 1.5% markup
    speed: '0-2 Days'
  },
  {
    id: 'xoom',
    name: 'Xoom (PayPal)',
    icon: ArrowRight,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    feeStructure: { type: 'fixed', fixed: 2.99 },
    exchangeMargin: 0.02, // 2% markup
    speed: 'Minutes'
  }
];

const RemittanceComparison = ({ fromCurrency, toCurrency }) => {
  const [sendAmount, setSendAmount] = useState('1000');
  const { data, loading, error } = useCurrencyRates(fromCurrency);

  const midMarketRate = data && data.rates ? data.rates[toCurrency] : null;

  const calculateTransfer = (provider) => {
    if (!midMarketRate) return null;
    const amount = parseFloat(sendAmount) || 0;
    
    // Calculate exchange rate applied by provider
    const providerRate = midMarketRate * (1 - provider.exchangeMargin);
    
    // Convert base USD fees to local currency automatically
    const rateToUSD = data && data.rates && data.rates.USD ? data.rates.USD : 1;
    const usdToLocal = 1 / rateToUSD;
    
    // Calculate fee
    let fee = 0;
    if (provider.feeStructure.type === 'fixed') {
      fee = provider.feeStructure.fixed * usdToLocal;
    } else if (provider.feeStructure.type === 'mixed') {
      fee = (provider.feeStructure.fixed * usdToLocal) + (amount * provider.feeStructure.percent);
    }
    
    // Calculate total receive amount
    const amountAfterFee = Math.max(0, amount - fee);
    const receiveAmount = amountAfterFee * providerRate;
    
    return {
      rate: providerRate,
      fee: fee,
      receiveAmount: receiveAmount
    };
  };

  const results = midMarketRate ? PROVIDERS.map(p => ({
    ...p,
    ...calculateTransfer(p)
  })).sort((a, b) => b.receiveAmount - a.receiveAmount) : [];

  return (
    <div className="w-full p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-50 dark:border-gray-700">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Send className="text-blue-500" size={24} />
            Best Transfer Rates
          </h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Compare Top Providers
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold text-gray-400 pl-3">Send</span>
          <div className="relative">
            <input 
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="w-24 sm:w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-sm font-black text-gray-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs font-black text-gray-900 dark:text-white pr-3">{fromCurrency}</span>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl"></div>)}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold">{error}</div>
      ) : (
        <div className="space-y-4">
          {results.map((provider, index) => {
            const isBest = index === 0;
            const Icon = provider.icon;
            
            return (
              <div 
                key={provider.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
                  isBest 
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 ring-1 ring-blue-500/20' 
                    : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className={`p-3 rounded-xl ${provider.bg} ${provider.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-gray-900 dark:text-white text-sm">{provider.name}</h4>
                      {isBest && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md">Best Rate</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <span>Rate: {provider.rate.toFixed(4)}</span>
                      <span>•</span>
                      <span>Fee: {provider.fee.toFixed(2)} {fromCurrency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-200 dark:border-gray-700">
                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Recipient Gets</span>
                    <span className={`text-lg sm:text-xl font-black ${isBest ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {provider.receiveAmount.toFixed(2)} <span className="text-sm">{toCurrency}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <p className="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        *Rates and fees are estimated based on typical provider structures
      </p>
    </div>
  );
};

export default RemittanceComparison;
