import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import Loader from "../common/Loader";
import { authService } from "../../services/api.service";
import "./Auth.css";

const Login = () => {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", formData);
    try {
      await login(formData);
      navigate("/");
    } catch {
      // L'erreur est déjà gérée dans useAuth
    }
  };

  const handleTestConnection = async () => {
    console.log("Testing backend connection...");
    try {
      const testCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      console.log("Sending test request...");
      const response = await authService.login(testCredentials);
      console.log("Backend response:", response);
      alert("Connexion au backend réussie ! Voir console pour détails.");
    } catch (error) {
      console.error("Test connection failed:", error);
      alert(`Erreur connexion backend: ${error.message}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon">👨‍🍳</span>
            <span>Mon Petit Chef</span>
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">{t("auth.login")}</h1>
            <p className="auth-subtitle">{t("auth.welcomeBack")}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t("auth.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="chef@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t("auth.password")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn--primary"
              disabled={loading}
            >
              {loading ? (
                <Loader size="small" />
              ) : (
                <>
                  <span>🔑</span>
                  {t("auth.login")}
                </>
              )}
            </button>

            {/* Bouton de test - À supprimer en production */}
            <button
              type="button"
              onClick={handleTestConnection}
              className="auth-btn auth-btn--secondary"
              style={{ marginTop: "1rem" }}
            >
              🔧 Test Backend
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Pas encore de compte ?{" "}
              <Link to="/register" className="auth-link">
                {t("auth.createAccount")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
