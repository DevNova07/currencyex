import axios from 'axios';

// Default Limits
const PRIMARY_LIMIT = 1000;
const BACKUP_LIMIT = 500;

export const PRIMARY_API = {
  host: 'currency-converter241.p.rapidapi.com',
  name: 'Primary Node (Converter 241)'
};

export const BACKUP_API = {
  host: 'currency-conversion-and-exchange-rates.p.rapidapi.com',
  name: 'Backup Node (Institutional)'
};

const RAPIDAPI_KEY = '30cfff0008mshcd9738405b90602p1718bbjsn76a163aaa269';

// Persistent tracking logic
const getUsageStats = () => {
  const defaultStats = {
    primary: { used: 0, limit: PRIMARY_LIMIT },
    backup: { used: 0, limit: BACKUP_LIMIT },
    lastReset: new Date().toISOString()
  };
  
  try {
    const saved = localStorage.getItem('api_usage_stats');
    return saved ? JSON.parse(saved) : defaultStats;
  } catch (e) {
    return defaultStats;
  }
};

const trackUsage = (provider) => {
  const stats = getUsageStats();
  if (provider === 'primary') stats.primary.used += 1;
  else stats.backup.used += 1;
  localStorage.setItem('api_usage_stats', JSON.stringify(stats));
};

// Create base instances
const primaryApi = axios.create({
  baseURL: `https://${PRIMARY_API.host}`,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': PRIMARY_API.host,
  },
});

const backupApi = axios.create({
  baseURL: `https://${BACKUP_API.host}`,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': BACKUP_API.host,
  },
});

// Fallback logic
export const fetchRates = async (endpoint, params = {}) => {
  // Determine if we should prioritize the currency-converter241 (now Primary)
  // New Primary uses /conversion_rate. New Backup uses /latest & /timeseries.
  
  try {
    if (endpoint === '/latest' || endpoint === '/conversion_rate' || endpoint === '/convert') {
      // Try the NEW Primary (Simple Converter)
      const primaryParams = {
        from: params.base || params.from || 'USD',
        to: params.symbols || params.to || 'INR'
      };
      
      // Clean up symbols if it's a list for the simple converter
      if (typeof primaryParams.to === 'string' && primaryParams.to.includes(',')) {
        primaryParams.to = primaryParams.to.split(',')[0];
      }

      try {
        const response = await primaryApi.get('/conversion_rate', { params: primaryParams });
        if (response.data && response.data.rate) {
          trackUsage('primary');
          return {
            success: true,
            base: primaryParams.from,
            rates: { [primaryParams.to]: response.data.rate },
            timestamp: response.data.timestamp || Date.now() / 1000
          };
        }
      } catch (err) {
        console.warn('Primary (Converter 241) failed, switching to backup...', err.message);
        // Fall through to backup
      }
    }

    // Use BACKUP (Old Primary - Supports bulk rates and timeseries)
    const response = await backupApi.get(endpoint, { params });
    
    if (response.data && response.data.success === false) {
      throw new Error(response.data.error?.info || 'Backup API reported failure');
    }
    
    trackUsage('backup');
    return response.data;

  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export { getUsageStats };
export default primaryApi;


