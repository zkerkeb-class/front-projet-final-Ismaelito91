// Service de gestion des tokens
const TOKEN_KEY = "token";
const USER_KEY = "user";

export const tokenService = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  getAuthHeaders: () => {
    const token = tokenService.getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        };
  },

  getAuthHeadersForFormData: () => {
    const token = tokenService.getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  },

  isAuthenticated: () => {
    return !!tokenService.getToken();
  },

  clear: () => {
    tokenService.removeToken();
    tokenService.removeUser();
  },
};

export default tokenService;
