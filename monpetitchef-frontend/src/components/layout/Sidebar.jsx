import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <nav className="sidebar__nav">
          <Link to="/" className="sidebar__link" onClick={onClose}>
            <span className="sidebar__icon">🏠</span>
            {t("nav.home")}
          </Link>
          <Link to="/recipes" className="sidebar__link" onClick={onClose}>
            <span className="sidebar__icon">📚</span>
            {t("nav.recipes")}
          </Link>
          {isAuthenticated && (
            <Link to="/favorites" className="sidebar__link" onClick={onClose}>
              <span className="sidebar__icon">❤️</span>
              {t("nav.favorites")}
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/profile" className="sidebar__link" onClick={onClose}>
              <span className="sidebar__icon">👤</span>
              {t("nav.profile")}
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
