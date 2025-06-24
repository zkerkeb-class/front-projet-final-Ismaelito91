import React from "react";
import { useTranslation } from "react-i18next";

const Recipes = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{t("recipes.title")}</h1>
      <p>🚧 Page en construction 🚧</p>
      <p>La liste des recettes sera bientôt disponible.</p>
    </div>
  );
};

export default Recipes;
