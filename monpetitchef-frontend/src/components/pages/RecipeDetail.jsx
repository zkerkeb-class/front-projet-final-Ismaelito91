import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recipesService, favoritesService } from "../../services/api.service";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../config/api.config";
import Loader from "../common/Loader";
import "./RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [adjustedRecipe, setAdjustedRecipe] = useState(null);
  const [newPortions, setNewPortions] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    loadRecipe();
    if (user) {
      checkFavoriteStatus();
    }
  }, [id, user]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const data = await recipesService.getById(id);
      console.log("Recipe loaded:", data);
      setRecipe(data);
      setAdjustedRecipe(data);
      setNewPortions(data.portions.toString());

      // Vérifier si l'utilisateur a déjà noté cette recette
      if (user && data.notes) {
        const userNote = data.notes.find(
          (note) => note.utilisateur === user._id
        );
        if (userNote) {
          setUserRating(userNote.valeur);
        }
      }
    } catch (error) {
      console.error("Error loading recipe:", error);
      addNotification("error", "Erreur lors du chargement de la recette");
      navigate("/recipes");
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const isFav = await favoritesService.isFavorite(id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const handlePortionChange = (e) => {
    const portions = parseInt(e.target.value);
    setNewPortions(e.target.value);

    if (portions > 0 && recipe) {
      const adjusted = recipesService.calculatePortions(recipe, portions);
      setAdjustedRecipe(adjusted);
    } else {
      setAdjustedRecipe(recipe);
    }
  };

  const resetPortions = () => {
    setNewPortions(recipe.portions.toString());
    setAdjustedRecipe(recipe);
  };

  const toggleFavorite = async () => {
    if (!user) {
      addNotification("warning", t("messages.loginRequired"));
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.remove(id);
        setIsFavorite(false);
        addNotification("success", "Retiré des favoris");
      } else {
        await favoritesService.add(id);
        setIsFavorite(true);
        addNotification("success", "Ajouté aux favoris");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      addNotification("error", "Erreur lors de la modification des favoris");
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      addNotification("warning", "Connectez-vous pour noter cette recette");
      return;
    }

    try {
      await recipesService.addRating(id, rating);
      setUserRating(rating);
      setShowRatingForm(false);
      addNotification("success", "Note ajoutée avec succès");
      // Recharger la recette pour obtenir la nouvelle note moyenne
      loadRecipe();
    } catch (error) {
      console.error("Error adding rating:", error);
      addNotification("error", "Erreur lors de l'ajout de la note");
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Facile":
        return "var(--success-color)";
      case "Moyen":
        return "var(--warning-color)";
      case "Difficile":
        return "var(--error-color)";
      default:
        return "var(--text-secondary)";
    }
  };

  const StarRating = ({ rating, onRate = null, readonly = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? "star--filled" : ""} ${
              readonly ? "star--readonly" : ""
            }`}
            onClick={() => !readonly && onRate && onRate(star)}
            disabled={readonly}
          >
            ⭐
          </button>
        ))}
        {readonly && <span className="rating-text">({rating}/5)</span>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="recipe-loading">
        <Loader />
        <p>Chargement de la recette...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-error">
        <h2>Recette introuvable</h2>
        <button
          onClick={() => navigate("/recipes")}
          className="btn btn--primary"
        >
          Retour aux recettes
        </button>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <div className="recipe-detail-container">
        {/* En-tête de la recette */}
        <div className="recipe-header">
          <div className="recipe-header-content">
            <div className="recipe-meta">
              <button onClick={() => navigate("/recipes")} className="btn-back">
                ← Retour
              </button>
              <div className="recipe-actions">
                <button
                  onClick={toggleFavorite}
                  className={`btn-favorite ${
                    isFavorite ? "btn-favorite--active" : ""
                  }`}
                  title={
                    isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
                  }
                >
                  {isFavorite ? "❤️" : "🤍"}
                </button>
              </div>
            </div>

            <h1 className="recipe-title">{recipe.titre}</h1>
            <p className="recipe-description">{recipe.description}</p>

            <div className="recipe-stats">
              <div className="stat">
                <span className="stat-icon">⏱️</span>
                <div>
                  <div className="stat-label">Préparation</div>
                  <div className="stat-value">
                    {formatTime(recipe.tempsPreparation)}
                  </div>
                </div>
              </div>

              {recipe.tempsCuisson && (
                <div className="stat">
                  <span className="stat-icon">🔥</span>
                  <div>
                    <div className="stat-label">Cuisson</div>
                    <div className="stat-value">
                      {formatTime(recipe.tempsCuisson)}
                    </div>
                  </div>
                </div>
              )}

              <div className="stat">
                <span className="stat-icon">👥</span>
                <div>
                  <div className="stat-label">Portions</div>
                  <div className="stat-value">{adjustedRecipe.portions}</div>
                </div>
              </div>

              <div className="stat">
                <span className="stat-icon">📊</span>
                <div>
                  <div className="stat-label">Difficulté</div>
                  <div
                    className="stat-value"
                    style={{ color: getDifficultyColor(recipe.difficulte) }}
                  >
                    {recipe.difficulte}
                  </div>
                </div>
              </div>
            </div>

            {/* Note moyenne */}
            <div className="recipe-rating">
              <StarRating rating={recipe.noteMoyenne || 0} readonly />
              <span className="rating-count">
                {recipe.notes ? `${recipe.notes.length} avis` : "Aucun avis"}
              </span>
            </div>

            {/* Tags et catégories */}
            <div className="recipe-tags">
              {recipe.categories.map((category, index) => (
                <span key={index} className="tag tag--category">
                  {category}
                </span>
              ))}
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag tag--normal">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {getImageUrl(recipe.image) && (
            <div className="recipe-image">
              <img
                src={getImageUrl(recipe.image)}
                alt={recipe.titre}
                onError={(e) => {
                  console.error(
                    "Image failed to load in RecipeDetail:",
                    getImageUrl(recipe.image)
                  );
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="recipe-content">
          {/* Calculateur de portions */}
          <div className="portion-calculator">
            <h3>🔢 Calculateur de portions</h3>
            <div className="calculator-controls">
              <label htmlFor="portions">Nombre de portions souhaité :</label>
              <div className="calculator-input">
                <input
                  type="number"
                  id="portions"
                  value={newPortions}
                  onChange={handlePortionChange}
                  min="1"
                  max="50"
                  className="portion-input"
                />
                <button
                  onClick={resetPortions}
                  className="btn-reset"
                  title="Remettre aux portions originales"
                >
                  🔄
                </button>
              </div>
            </div>
            {parseInt(newPortions) !== recipe.portions && (
              <p className="calculator-info">
                Quantités ajustées pour {newPortions} portion(s)
                {parseInt(newPortions) > recipe.portions ? " ⬆️" : " ⬇️"}
              </p>
            )}
          </div>

          {/* Ingrédients */}
          <div className="recipe-section">
            <h2 className="section-title">🥕 Ingrédients</h2>
            <ul className="ingredients-list">
              {adjustedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-quantity">
                    {ingredient.quantite}
                    {ingredient.unite && ` ${ingredient.unite}`}
                  </span>
                  <span className="ingredient-name">{ingredient.nom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Étapes de préparation */}
          <div className="recipe-section">
            <h2 className="section-title">👩‍🍳 Préparation</h2>
            <ol className="steps-list">
              {recipe.etapesPreparation.map((step, index) => (
                <li key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">{step}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* Notation */}
          <div className="recipe-section">
            <h2 className="section-title">⭐ Votre avis</h2>
            {user ? (
              <div className="rating-section">
                {userRating > 0 ? (
                  <div className="user-rating">
                    <p>Votre note :</p>
                    <StarRating rating={userRating} readonly />
                    <button
                      onClick={() => setShowRatingForm(true)}
                      className="btn btn--secondary btn--small"
                    >
                      Modifier ma note
                    </button>
                  </div>
                ) : (
                  <div className="no-rating">
                    <p>Vous n'avez pas encore noté cette recette.</p>
                    <button
                      onClick={() => setShowRatingForm(true)}
                      className="btn btn--primary"
                    >
                      Noter cette recette
                    </button>
                  </div>
                )}

                {showRatingForm && (
                  <div className="rating-form">
                    <p>Donnez votre note :</p>
                    <StarRating
                      rating={0}
                      onRate={(rating) => handleRating(rating)}
                    />
                    <button
                      onClick={() => setShowRatingForm(false)}
                      className="btn btn--secondary btn--small"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="login-prompt">
                <a href="/login">Connectez-vous</a> pour noter cette recette.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
