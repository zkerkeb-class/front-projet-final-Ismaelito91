import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "../../services/api.service";
import { useApp } from "../../contexts/AppContext";
import Loader from "../common/Loader";
import "./Auth.css";

const Register = () => {
  const { t } = useTranslation();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Supprimer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation du prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Validation de la confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation est requise";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Registering user with:", formData);

      const userData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await authService.register(userData);
      console.log("Registration response:", response);

      addNotification("success", "Inscription réussie ! Bienvenue !");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      // Gestion spécifique des erreurs de validation du backend
      if (error.message.includes("validation") && error.errors) {
        const backendErrors = {};
        error.errors.forEach((err) => {
          if (err.includes("nom")) backendErrors.nom = err;
          if (err.includes("prénom")) backendErrors.prenom = err;
          if (err.includes("email")) backendErrors.email = err;
          if (err.includes("password")) backendErrors.password = err;
        });
        setErrors(backendErrors);
      }

      addNotification("error", error.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleTestRegistration = async () => {
    console.log("Testing registration...");
    try {
      const testUserData = {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        password: "password123",
      };

      console.log("Sending test registration...");
      const response = await authService.register(testUserData);
      console.log("Backend registration response:", response);
      alert("Test d'inscription réussi ! Voir console pour détails.");
    } catch (error) {
      console.error("Test registration failed:", error);
      alert(`Erreur test inscription: ${error.message}`);
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
            <h1 className="auth-title">{t("auth.register")}</h1>
            <p className="auth-subtitle">
              Créez votre compte et commencez à cuisiner !
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom" className="form-label">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.nom ? "form-input--error" : ""
                  }`}
                  placeholder="Dupont"
                  disabled={loading}
                />
                {errors.nom && <span className="form-error">{errors.nom}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="prenom" className="form-label">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.prenom ? "form-input--error" : ""
                  }`}
                  placeholder="Jean"
                  disabled={loading}
                />
                {errors.prenom && (
                  <span className="form-error">{errors.prenom}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t("auth.email")} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${
                  errors.email ? "form-input--error" : ""
                }`}
                placeholder="jean.dupont@example.com"
                disabled={loading}
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t("auth.password")} *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${
                  errors.password ? "form-input--error" : ""
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
              <small className="form-hint">Minimum 6 caractères</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${
                  errors.confirmPassword ? "form-input--error" : ""
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
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
                  <span>✨</span>
                  {t("auth.register")}
                </>
              )}
            </button>

            {/* Bouton de test - À supprimer en production */}
            <button
              type="button"
              onClick={handleTestRegistration}
              className="auth-btn auth-btn--secondary"
              style={{ marginTop: "1rem" }}
            >
              🔧 Test Inscription
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Déjà un compte ?{" "}
              <Link to="/login" className="auth-link">
                {t("auth.login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
