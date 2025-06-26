import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import AnimatedIcon from "./AnimatedIcon";
import "./InfoCards.css";

const InfoCards = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const infoCards = [
    {
      id: "community",
      iconName: "user",
      title: t("infoCards.community.title"),
      description: t("infoCards.community.description"),
      highlight: t("infoCards.community.highlight"),
      color: "primary",
    },
    {
      id: "sharing",
      iconName: "favorite",
      title: t("infoCards.sharing.title"),
      description: t("infoCards.sharing.description"),
      highlight: t("infoCards.sharing.highlight"),
      color: "secondary",
    },
    {
      id: "discovery",
      iconName: "search",
      title: t("infoCards.discovery.title"),
      description: t("infoCards.discovery.description"),
      highlight: t("infoCards.discovery.highlight"),
      color: "accent",
    },
    {
      id: "quality",
      iconName: "star",
      title: t("infoCards.quality.title"),
      description: t("infoCards.quality.description"),
      highlight: t("infoCards.quality.highlight"),
      color: "success",
    },
  ];

  return (
    <aside className="info-cards">
      <div className="info-cards__header">
        <h2 className="info-cards__title">
          <AnimatedIcon
            name="recipe"
            size="lg"
            className="info-cards__title-icon"
          />
          {t("infoCards.whyTitle")}
        </h2>
        <p className="info-cards__subtitle">{t("infoCards.subtitle")}</p>
      </div>

      <div className="info-cards__grid">
        {infoCards.map((card) => (
          <div key={card.id} className={`info-card info-card--${card.color}`}>
            <div className="info-card__header">
              <div className="info-card__icon">
                <AnimatedIcon name={card.iconName} size="lg" />
              </div>
              <h3 className="info-card__title">{card.title}</h3>
            </div>

            <p className="info-card__description">{card.description}</p>

            <div className="info-card__highlight">
              <AnimatedIcon
                name="sparkle"
                size="sm"
                className="info-card__highlight-icon"
              />
              {card.highlight}
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      {!isAuthenticated && (
        <div className="info-cards__cta">
          <div className="info-cta">
            <div className="info-cta__content">
              <h3 className="info-cta__title">
                {t("infoCards.joinCommunity")}
              </h3>
              <p className="info-cta__description">
                {t("infoCards.joinDescription")}
              </p>
            </div>
            <div className="info-cta__actions">
              <Link to="/register" className="btn btn--primary">
                <AnimatedIcon emoji="🚀" size="sm" />
                {t("auth.signUpFree")}
              </Link>
              <Link to="/login" className="btn btn--outline">
                {t("infoCards.connect")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques communauté */}
      <div className="info-cards__stats">
        <h4 className="info-stats__title">{t("infoCards.statsTitle")}</h4>
        <div className="info-stats__grid">
          <div className="info-stat">
            <span className="info-stat__number">1,234</span>
            <span className="info-stat__label">
              {t("infoCards.stats.recipes")}
            </span>
            <AnimatedIcon
              name="cooking"
              size="sm"
              className="info-stat__icon"
            />
          </div>
          <div className="info-stat">
            <span className="info-stat__number">567</span>
            <span className="info-stat__label">
              {t("infoCards.stats.chefs")}
            </span>
            <AnimatedIcon name="chef" size="sm" className="info-stat__icon" />
          </div>
          <div className="info-stat">
            <span className="info-stat__number">8,910</span>
            <span className="info-stat__label">
              {t("infoCards.stats.reviews")}
            </span>
            <AnimatedIcon name="star" size="sm" className="info-stat__icon" />
          </div>
          <div className="info-stat">
            <span className="info-stat__number">2,345</span>
            <span className="info-stat__label">
              {t("infoCards.stats.favorites")}
            </span>
            <AnimatedIcon
              name="favorite"
              size="sm"
              className="info-stat__icon"
            />
          </div>
        </div>
      </div>

      {/* Conseils du jour */}
      <div className="info-cards__tip">
        <div className="info-tip">
          <div className="info-tip__header">
            <AnimatedIcon name="info" size="md" className="info-tip__icon" />
            <h4 className="info-tip__title">{t("infoCards.tipOfDay")}</h4>
          </div>
          <p className="info-tip__content">{t("infoCards.tipContent")}</p>
          <div className="info-tip__author">{t("infoCards.tipAuthor")}</div>
        </div>
      </div>
    </aside>
  );
};

export default InfoCards;
