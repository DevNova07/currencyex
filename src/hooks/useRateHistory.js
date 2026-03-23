import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, subDays } from 'date-fns';

export const useRateHistory = (fromCurrency, toCurrency, days = 7) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
        const endDate = format(new Date(), 'yyyy-MM-dd');
        
        const response = await axios.get(`https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`);
        
        if (response.data && response.data.rates) {
          const chartData = Object.keys(response.data.rates).sort().map(date => ({
            date: format(new Date(date), days <= 1 ? 'HH:mm' : 'MMM dd'),
            rate: response.data.rates[date][toCurrency]
          }));
          setData(chartData);
        } else {
          throw new Error('No historical data found');
        }
      } catch (err) {
        console.error('History fetch error:', err);
        // Fallback to mock data with same length as days
        const mockData = Array.from({ length: days + 1 }).map((_, i) => {
          const date = subDays(new Date(), days - i);
          return {
            date: format(date, 'MMM dd'),
            rate: parseFloat((Math.random() * 5 + 80).toFixed(2))
          };
        });
        setData(mockData);
        setError('Using demo data');
      } finally {
        setLoading(false);
      }
    };

    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      fetchHistory();
    } else if (fromCurrency === toCurrency) {
      setData(Array.from({ length: days + 1 }).map((_, i) => ({
        date: format(subDays(new Date(), days - i), 'MMM dd'),
        rate: 1
      })));
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, days]);

  return { data, loading, error };
};
