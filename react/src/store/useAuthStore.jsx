import axios from 'axios';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null, // Initialize token from localStorage
  isAuthenticated: !!localStorage.getItem('token'), // Check if the token exists

  setAuth: (user, token) => {
    localStorage.setItem('token', token); // Store token in localStorage
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    console.log('The token is:', token);
    
    if (token) {
      try {
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const user = response.data;
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        console.error('Token validation failed:', error.response?.data || error.message);
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      }
    } else {
      console.log('No token found.');
    }
  },
  
}));

export default useAuthStore;