import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      path: "/",
      icon: "🏠",
      label: t("nav.home"),
      description: "Page d'accueil",
      public: true,
    },
    {
      path: "/recipes",
      icon: "🍽️",
      label: t("nav.recipes"),
      description: "Découvrir les recettes",
      public: true,
    },
    {
      path: "/favorites",
      icon: "❤️",
      label: t("nav.favorites"),
      description: "Mes recettes favorites",
      public: false,
    },
    {
      path: "/profile",
      icon: "👤",
      label: t("nav.profile"),
      description: "Mon profil",
      public: false,
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* En-tête de la sidebar */}
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <span className="sidebar__brand-icon">👨‍🍳</span>
            <div className="sidebar__brand-text">
              <h3>MonPetitChef</h3>
              <p>Votre compagnon culinaire</p>
            </div>
          </div>

          {/* Bouton fermer pour mobile */}
          <button className="sidebar__close" onClick={onClose}>
            <span>✕</span>
          </button>
        </div>

        {/* Informations utilisateur */}
        {isAuthenticated && user && (
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.nom} />
              ) : (
                <span className="sidebar__avatar-placeholder">
                  {user.nom?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="sidebar__user-info">
              <h4>Bonjour, {user.nom || "Utilisateur"} !</h4>
              <p>Chef amateur</p>
            </div>
          </div>
        )}

        {/* Navigation principale */}
        <nav className="sidebar__nav">
          <div className="sidebar__nav-section">
            <h5 className="sidebar__nav-title">Navigation</h5>
            {navigationItems
              .filter((item) => item.public || isAuthenticated)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar__link ${
                    isActiveLink(item.path) ? "sidebar__link--active" : ""
                  }`}
                  onClick={onClose}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  <div className="sidebar__link-content">
                    <span className="sidebar__link-label">{item.label}</span>
                    <span className="sidebar__link-description">
                      {item.description}
                    </span>
                  </div>
                  {isActiveLink(item.path) && (
                    <span className="sidebar__link-indicator">●</span>
                  )}
                </Link>
              ))}
          </div>

          {/* Section actions rapides */}
          {isAuthenticated && (
            <div className="sidebar__nav-section">
              <h5 className="sidebar__nav-title">Actions rapides</h5>
              <Link
                to="/recipes/add"
                className="sidebar__quick-action"
                onClick={onClose}
              >
                <span className="sidebar__icon">✨</span>
                <div className="sidebar__link-content">
                  <span className="sidebar__link-label">Créer une recette</span>
                  <span className="sidebar__link-description">
                    Partagez votre création
                  </span>
                </div>
              </Link>
            </div>
          )}
        </nav>

        {/* Pied de page de la sidebar */}
        <div className="sidebar__footer">
          <div className="sidebar__stats">
            <div className="sidebar__stat">
              <span className="sidebar__stat-icon">📊</span>
              <div>
                <span className="sidebar__stat-number">1,234</span>
                <span className="sidebar__stat-label">Recettes</span>
              </div>
            </div>
            <div className="sidebar__stat">
              <span className="sidebar__stat-icon">👥</span>
              <div>
                <span className="sidebar__stat-number">567</span>
                <span className="sidebar__stat-label">Chefs</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
