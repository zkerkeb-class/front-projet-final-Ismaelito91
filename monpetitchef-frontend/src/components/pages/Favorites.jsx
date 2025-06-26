import React from "react";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{t("nav.favorites")}</h1>
      <p>🚧 Page en construction 🚧</p>
    </div>
  );
};

export default Favorites;
