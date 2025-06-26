import React, { useEffect } from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import Router from "./components/router/Router";
import "./styles/variables.css";
import "./App.css";
import "./i18n";

const AppContent = () => {
  const { theme } = useApp();

  // Appliquer le thème au document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <Router />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
