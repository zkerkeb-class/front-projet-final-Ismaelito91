import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import "./Home.css";

const Home = () => {
  const { t } = useTranslation();
  const { addNotification } = useApp();

  const handleTestNotification = () => {
    addNotification("success", t("messages.welcome"));
  };

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">
            <span className="home__title-icon">👨‍🍳</span>
            {t("messages.welcome")}
          </h1>
          <p className="home__subtitle">
            Découvrez, partagez et savourez les meilleures recettes du monde
          </p>
          <div className="home__actions">
            <Link to="/recipes" className="home__btn home__btn--primary">
              🍳 Voir les recettes
            </Link>
            <button
              onClick={handleTestNotification}
              className="home__btn home__btn--secondary"
            >
              🔔 Test notification
            </button>
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
          <div className="home__feature-icon">📚</div>
          <h3>Recettes variées</h3>
          <p>Des milliers de recettes pour tous les goûts</p>
        </div>
        <div className="home__feature">
          <div className="home__feature-icon">❤️</div>
          <h3>Favoris</h3>
          <p>Sauvegardez vos recettes préférées</p>
        </div>
        <div className="home__feature">
          <div className="home__feature-icon">👥</div>
          <h3>Communauté</h3>
          <p>Partagez et commentez vos créations</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
