import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'X-Api-Key': import.meta.env.VITE_API_KEY // Correct header for your middleware
  }
});


export default api;