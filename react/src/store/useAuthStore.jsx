import create from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (userData, token) => {
    set({ user: userData, token });
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
    localStorage.setItem('token', token); // Save token to localStorage
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('user'); // Remove user data from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
  },
  loadUser: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) set({ user, token });
  },
}));

export default useAuthStore;
