import { useState, useEffect } from "react";
import { authService } from "../services/api.service";
import tokenService from "../services/token.service";
import { useApp } from "../contexts/AppContext";

export const useAuth = () => {
  const { setUser: setContextUser, setLoading, addNotification } = useApp();
  const [authLoading, setAuthLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Synchroniser l'état d'authentification au chargement
  useEffect(() => {
    console.log("useAuth - Initializing...");
    const token = tokenService.getToken();
    const user = tokenService.getUser();

    console.log("useAuth - Token:", !!token, "User:", !!user);

    if (token && user) {
      setIsAuthenticated(true);
      setContextUser(user);
      console.log("useAuth - User authenticated");
    } else {
      setIsAuthenticated(false);
      setContextUser(null);
      console.log("useAuth - User not authenticated");
    }

    setInitialLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setAuthLoading(true);
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      setIsAuthenticated(true);
      setContextUser(response.user);
      addNotification("success", "Connexion réussie !");

      return response;
    } catch (err) {
      setError(err.message);
      addNotification("error", err.message || "Erreur de connexion");
      throw err;
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      addNotification("success", "Déconnexion réussie");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      addNotification("warning", "Déconnexion locale effectuée");
    } finally {
      tokenService.clear();
      setIsAuthenticated(false);
      setContextUser(null);
      setLoading(false);
    }
  };

  const getUser = () => {
    return tokenService.getUser();
  };

  return {
    login,
    logout,
    loading: authLoading,
    initialLoading,
    error,
    isAuthenticated,
    getUser,
  };
};

export default useAuth;
