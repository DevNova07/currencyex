import axios from 'axios';

export const RAPIDAPI_KEY = '30cfff0008mshcd9738405b90602p1718bbjsn76a163aaa269';
export const RAPIDAPI_HOST = 'currency-conversion-and-exchange-rates.p.rapidapi.com';
export const BASE_URL = `https://${RAPIDAPI_HOST}`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
  },
});

export default api;
