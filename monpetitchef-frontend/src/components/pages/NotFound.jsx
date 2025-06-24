import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: "0" }}>404</h1>
      <h2>{t("messages.notFound")}</h2>
      <p>La page que vous cherchez n'existe pas.</p>
      <Link
        to="/"
        style={{
          marginTop: "2rem",
          padding: "1rem 2rem",
          background: "var(--primary-color)",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
