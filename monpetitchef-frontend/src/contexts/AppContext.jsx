import React, { createContext, useContext, useReducer, useEffect } from "react";

// État initial
const initialState = {
  theme: "light",
  language: "fr",
  notifications: [],
  loading: false,
  user: null,
  isAuthenticated: false,
};

// Types d'actions
const actionTypes = {
  SET_THEME: "SET_THEME",
  SET_LANGUAGE: "SET_LANGUAGE",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_THEME:
      localStorage.setItem("theme", action.payload);
      return { ...state, theme: action.payload };

    case actionTypes.SET_LANGUAGE:
      localStorage.setItem("language", action.payload);
      return { ...state, language: action.payload };

    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...action.payload,
          },
        ],
      };

    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

// Contexte
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Charger les préférences sauvegardées
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLanguage = localStorage.getItem("language") || "fr";

    dispatch({ type: actionTypes.SET_THEME, payload: savedTheme });
    dispatch({ type: actionTypes.SET_LANGUAGE, payload: savedLanguage });
  }, []);

  // Actions
  const toggleTheme = () => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    dispatch({ type: actionTypes.SET_THEME, payload: newTheme });
  };

  const setLanguage = (language) => {
    dispatch({ type: actionTypes.SET_LANGUAGE, payload: language });
  };

  const addNotification = (type, message, duration = 5000) => {
    const notification = { type, message, duration };
    dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification });

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
  };

  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };

  const setUser = (user) => {
    dispatch({ type: actionTypes.SET_USER, payload: user });
  };

  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT });
  };

  const value = {
    ...state,
    toggleTheme,
    setLanguage,
    addNotification,
    removeNotification,
    setLoading,
    setUser,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook personnalisé
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
