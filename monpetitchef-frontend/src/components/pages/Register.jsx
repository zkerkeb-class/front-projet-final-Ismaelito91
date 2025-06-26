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
      newErrors.nom = t("validation.nameRequired");
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = t("validation.minLength", { count: 2 });
    }

    // Validation du prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = t("validation.firstNameRequired");
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = t("validation.minLength", { count: 2 });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("validation.invalidEmail");
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = t("validation.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("validation.minLength", { count: 6 });
    }

    // Validation de la confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("validation.passwordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("validation.passwordMismatch");
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

      addNotification("success", t("messages.registrationSuccess"));
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

      addNotification(
        "error",
        error.message || t("messages.registrationError")
      );
    } finally {
      setLoading(false);
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
            <p className="auth-subtitle">{t("auth.registerSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom" className="form-label">
                  {t("auth.lastName")} *
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
                  placeholder={t("auth.placeholders.lastName")}
                  disabled={loading}
                />
                {errors.nom && <span className="form-error">{errors.nom}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="prenom" className="form-label">
                  {t("auth.firstName")} *
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
                  placeholder={t("auth.placeholders.firstName")}
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
                placeholder={t("auth.placeholders.email")}
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
                placeholder={t("auth.placeholders.password")}
                disabled={loading}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
              <small className="form-hint">{t("auth.passwordHint")}</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                {t("auth.confirmPassword")} *
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
                placeholder={t("auth.placeholders.password")}
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
          </form>

          <div className="auth-footer">
            <p>
              {t("auth.alreadyAccount")}{" "}
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
