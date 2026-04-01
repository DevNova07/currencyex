import { useState, useEffect } from 'react';
import { fetchRates } from '../utils/api';

// Simple in-memory cache corresponding to base currency
const cache = {};

export const useCurrencyRates = (baseCurrency) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRates = async () => {
      setLoading(true);
      setError(null);
      
      // Check cache first (cache for 1 hour approx, but simplified here)
      if (cache[baseCurrency] && (Date.now() - cache[baseCurrency].timestamp < 3600000)) {
        setData(cache[baseCurrency].data);
        setLoading(false);
        return;
      }

      try {
        const responseData = await fetchRates('/latest', { base: baseCurrency });
        
        if (responseData && responseData.success) {
          // Save to cache
          cache[baseCurrency] = {
            timestamp: Date.now(),
            data: responseData
          };

          setData(responseData);
        } else {
          throw new Error('RapidAPI: Failed to fetch live rates');
        }
      } catch (err) {
        console.error('Rates fetch error:', err);
        setError(err.message || 'Failed to fetch currency rates');
      } finally {
        setLoading(false);
      }
    };

    if (baseCurrency) {
      loadRates();
    }
  }, [baseCurrency]);

  return { data, loading, error };
};
