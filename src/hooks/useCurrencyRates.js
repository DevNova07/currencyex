import { useState, useEffect } from 'react';
import axios from 'axios';

// Simple in-memory cache corresponding to base currency
const cache = {};

export const useCurrencyRates = (baseCurrency) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      
      // Check cache first (cache for 1 hour approx, but simplified here)
      if (cache[baseCurrency] && (Date.now() - cache[baseCurrency].timestamp < 3600000)) {
        setData(cache[baseCurrency].data);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        
        const responseData = response.data;
        // Save to cache
        cache[baseCurrency] = {
          timestamp: Date.now(),
          data: responseData
        };

        setData(responseData);
      } catch (err) {
        setError(err.message || 'Failed to fetch currency rates');
      } finally {
        setLoading(false);
      }
    };

    if (baseCurrency) {
      fetchRates();
    }
  }, [baseCurrency]);

  return { data, loading, error };
};
