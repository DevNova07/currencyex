import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { CURRENCIES, getFlagUrl } from '../utils/currencies';
import { useDebounce } from '../hooks/useDebounce';

const CurrencySelect = ({ value, label, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const dropdownRef = useRef(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];

  const filteredCurrencies = CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 text-left"
      >
        <div className="flex items-center gap-3">
          <img 
            src={getFlagUrl(selectedCurrency.country)} 
            alt={selectedCurrency.code}
            className="w-6 h-4.5 object-cover rounded-sm shadow-xs"
          />
          <div>
            <span className="font-bold text-gray-800 dark:text-gray-100">{selectedCurrency.code}</span>
            <span className="text-sm text-gray-400 dark:text-gray-500 ml-2 font-medium">
              {selectedCurrency.name}
            </span>
          </div>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              placeholder="Search currency or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`flex items-center justify-between w-full p-3.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left ${
                    value === currency.code ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={getFlagUrl(currency.country)} 
                      alt={currency.code}
                      className="w-6 h-4.5 object-cover rounded-sm shadow-xs"
                    />
                    <div>
                      <span className={`font-semibold ${value === currency.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
                        {currency.code}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                        {currency.name}
                      </span>
                    </div>
                  </div>
                  {value === currency.code && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelect;
