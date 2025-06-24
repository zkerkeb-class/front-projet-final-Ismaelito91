import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts/AppContext";
import useAuth from "../../hooks/useAuth";
import "./Header.css";

const Header = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, setLanguage } = useApp();
  const { isAuthenticated, logout, getUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = getUser();

  console.log("Header - isAuthenticated:", isAuthenticated); // Debug

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLoginClick = () => {
    console.log("Login button clicked"); // Debug
    navigate("/login");
  };

  const handleRegisterClick = () => {
    console.log("Register button clicked"); // Debug
    navigate("/register");
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Menu burger pour mobile */}
        <button
          className="header__menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Ouvrir le menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">👨‍🍳</span>
          <span className="header__logo-text">Mon Petit Chef</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">
            {t("nav.home")}
          </Link>
          <Link to="/recipes" className="header__nav-link">
            {t("nav.recipes")}
          </Link>
          {isAuthenticated && (
            <Link to="/favorites" className="header__nav-link">
              {t("nav.favorites")}
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Bouton thème */}
          <button
            className="header__action-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? t("ui.darkMode") : t("ui.lightMode")
            }
            title={theme === "light" ? t("ui.darkMode") : t("ui.lightMode")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Sélecteur de langue */}
          <div className="header__dropdown">
            <button
              className="header__action-btn"
              onClick={toggleDropdown}
              aria-label={t("ui.language")}
            >
              🌐
            </button>
            {dropdownOpen && (
              <div className="header__dropdown-menu">
                <button
                  className={`header__dropdown-item ${
                    i18n.language === "fr" ? "active" : ""
                  }`}
                  onClick={() => handleLanguageChange("fr")}
                >
                  🇫🇷 Français
                </button>
                <button
                  className={`header__dropdown-item ${
                    i18n.language === "en" ? "active" : ""
                  }`}
                  onClick={() => handleLanguageChange("en")}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>

          {/* Menu utilisateur */}
          {isAuthenticated ? (
            <div className="header__user-menu">
              {/* <Link to="/profile" className="header__user-info"> */}
              <div
                onClick={() => navigate("/profile")}
                className="header__user-avatar"
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="header__user-name">{user?.name}</span>
              {/* </Link> */}
              <button
                className="header__action-btn header__logout"
                onClick={handleLogout}
                title={t("auth.logout")}
              >
                🚪
              </button>
            </div>
          ) : (
            <div className="header__auth-buttons">
              <button
                onClick={handleLoginClick}
                className="header__btn header__btn--secondary"
                type="button"
              >
                {t("nav.login")}
              </button>
              <button
                onClick={handleRegisterClick}
                className="header__btn header__btn--primary"
                type="button"
              >
                <span className="header__btn-icon">✨</span>
                {t("nav.register")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
