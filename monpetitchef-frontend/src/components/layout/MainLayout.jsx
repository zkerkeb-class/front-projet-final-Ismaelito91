import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts/AppContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationContainer from "../common/Notification";
import Loader from "../common/Loader";
import "./MainLayout.css";

const MainLayout = () => {
  const { t } = useTranslation();
  const { loading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div
      className="main-layout"
      data-theme={localStorage.getItem("theme") || "light"}
    >
      <Header onToggleSidebar={toggleSidebar} />

      <div className="main-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="main-layout__main">
          <div className="main-layout__container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay pour fermer la sidebar sur mobile */}
      {sidebarOpen && (
        <div
          className="main-layout__overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Loader global */}
      {loading && <Loader overlay message={t("ui.loading")} />}

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
};

export default MainLayout;
