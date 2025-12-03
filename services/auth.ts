import { BACKEND_URL } from '../constants';

const TOKEN_KEY = 'fairshare_auth_token';
const USER_ID_KEY = 'fairshare_user_id';

export const AuthService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  getUserId: () => localStorage.getItem(USER_ID_KEY),

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  login: async (inviteCode: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(err.error || 'Invalid invite code');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_ID_KEY, data.userId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    window.location.reload();
  },

  // Helper for authenticated fetch
  fetchWithAuth: async (endpoint: string, options: RequestInit = {}) => {
    const token = AuthService.getToken();
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      AuthService.logout();
      throw new Error('Session expired');
    }

    return response;
  }
};