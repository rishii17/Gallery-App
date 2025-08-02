import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const useAuthStore = create((set, get) => ({
  /**
   * STATE
   * user: Holds the user object ({ _id, name, email, role }) once authenticated.
   * token: The JWT received from the backend, stored in localStorage for persistence.
   * loading: A boolean to track if the initial authentication check is in progress.
   */
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,

  /**
   * DERIVED STATE (Getters)
   * These are functions that derive state from the core state variables.
   */
  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',

  /**
   * ACTIONS
   * These are functions that modify the state.
   */

  /**
   * Logs in a user by sending credentials to the backend, storing the token,
   * and updating the user state.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data, token: data.token });
    return data;
  },

  /**
   * Logs out the user by removing the token from localStorage and clearing the state.
   */
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  /**
   * Checks for a token in localStorage upon application load. If a token exists,
   * it verifies it with the backend's `/profile` endpoint to ensure it's still valid
   * and fetches the latest user data.
   */
  checkAuth: async () => {
    const token = get().token;
    if (token) {
      try {
        // 1. Quick client-side check for token expiration
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }
        
        // 2. If not expired, verify with the backend and get fresh user data
        const { data } = await api.get('/auth/profile');
        set({ user: data });

      } catch (error) {
        // If the token is invalid, expired, or the API call fails, log the user out
        console.error("Authentication check failed:", error.message);
        get().logout();
      }
    }
    // Set loading to false once the check is complete
    set({ loading: false });
  },
}));

export default useAuthStore;