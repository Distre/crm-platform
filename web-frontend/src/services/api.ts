import axios from 'axios';

export const useApi = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

