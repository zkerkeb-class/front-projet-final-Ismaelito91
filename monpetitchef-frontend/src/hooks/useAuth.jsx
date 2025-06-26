import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../services/api.service";
import tokenService from "../services/token.service";
import { useApp } from "../contexts/AppContext";

export const useAuth = () => {
  const { t } = useTranslation();
  const { setUser: setContextUser, setLoading, addNotification } = useApp();
  const [authLoading, setAuthLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Synchroniser l'état d'authentification au chargement
  useEffect(() => {
    const token = tokenService.getToken();
    const storedUser = tokenService.getUser();

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setContextUser(storedUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setContextUser(null);
      // Nettoyer le stockage si les données sont incohérentes
      tokenService.clear();
    }

    setInitialLoading(false);
  }, []); // Retirer setContextUser des dépendances pour éviter la boucle

  const login = useCallback(
    async (credentials) => {
      try {
        setAuthLoading(true);
        setLoading(true);
        setError(null);

        const response = await authService.login(credentials);

        // Récupérer l'utilisateur depuis le token service après la connexion
        const loggedUser = tokenService.getUser();

        setIsAuthenticated(true);
        setUser(loggedUser);
        setContextUser(loggedUser);

        addNotification("success", t("messages.loginSuccess"));

        return response;
      } catch (err) {
        setError(err.message);
        addNotification("error", err.message || t("messages.loginError"));
        throw err;
      } finally {
        setAuthLoading(false);
        setLoading(false);
      }
    },
    [setLoading, addNotification, setContextUser]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      addNotification("success", t("messages.logoutSuccess"));
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      addNotification("warning", t("messages.logoutOffline"));
    } finally {
      tokenService.clear();
      setIsAuthenticated(false);
      setUser(null);
      setContextUser(null);
      setLoading(false);
    }
  }, [setLoading, addNotification, setContextUser]);

  const getUser = useCallback(() => {
    return user || tokenService.getUser();
  }, [user]);

  return {
    login,
    logout,
    loading: authLoading,
    initialLoading,
    error,
    isAuthenticated,
    user, // Retourner directement l'utilisateur
    getUser,
  };
};

export default useAuth;
