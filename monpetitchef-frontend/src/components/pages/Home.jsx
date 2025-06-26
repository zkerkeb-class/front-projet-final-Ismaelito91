import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">
            <span className="home__title-icon">👨‍🍳</span>
            {t("messages.welcome")}
          </h1>
          <p className="home__subtitle">{t("home.subtitle")}</p>
          <div className="home__actions">
            <Link to="/recipes" className="home__btn home__btn--primary">
              🍳 {t("ui.seeRecipes")}
            </Link>
          </div>
        </div>
        <div className="home__hero-image">
          <div className="home__food-icons">
            <span>🥗</span>
            <span>🍕</span>
            <span>🍝</span>
            <span>🍰</span>
            <span>🥘</span>
            <span>🍜</span>
          </div>
        </div>
      </div>

      <div className="home__features">
        <div className="home__feature">
          <div className="home__feature-icon">🍽️</div>
          <h3>{t("home.features.recipes.title")}</h3>
          <p>{t("home.features.recipes.description")}</p>
        </div>
        <div className="home__feature">
          <div className="home__feature-icon">❤️</div>
          <h3>{t("home.features.favorites.title")}</h3>
          <p>{t("home.features.favorites.description")}</p>
        </div>
        <div className="home__feature">
          <div className="home__feature-icon">👥</div>
          <h3>{t("home.features.community.title")}</h3>
          <p>{t("home.features.community.description")}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
