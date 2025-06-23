import { useState } from "react";
import { authService } from "../services/api.service";
import tokenService from "../services/token.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    tokenService.isAuthenticated()
  );

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      tokenService.clear();
      setIsAuthenticated(false);
    }
  };

  const getUser = () => {
    return tokenService.getUser();
  };

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated,
    getUser,
  };
};

export default useAuth;
