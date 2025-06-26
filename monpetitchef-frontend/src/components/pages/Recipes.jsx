import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recipesService } from "../../services/api.service";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../hooks/useAuth";
import { getImageUrl } from "../../config/api.config";
import Loader from "../common/Loader";
import "./Recipes.css";

const Recipes = () => {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const { user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, selectedCategory, selectedDifficulty]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipesService.getAll();
      // Adapter au format de réponse du backend : { success, count, data: [...] }
      const recipesArray = Array.isArray(response)
        ? response
        : response.data || response.recipes || [];

      setRecipes(recipesArray);
    } catch (error) {
      console.error("Error loading recipes:", error);
      addNotification("error", "Erreur lors du chargement des recettes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.titre?.toLowerCase().includes(query) ||
          recipe.description?.toLowerCase().includes(query) ||
          recipe.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          recipe.categories?.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((recipe) =>
        recipe.categories?.includes(selectedCategory)
      );
    }

    // Filtre par difficulté
    if (selectedDifficulty) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulte === selectedDifficulty
      );
    }

    setFilteredRecipes(filtered);
  };

  const getUniqueCategories = () => {
    const categories = new Set();
    recipes.forEach((recipe) => {
      recipe.categories?.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
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

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="star-rating-simple">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star-simple ${
              star <= rating ? "star-simple--filled" : ""
            }`}
          >
            ⭐
          </span>
        ))}
        <span className="rating-value">({rating}/5)</span>
      </div>
    );
  };

  const RecipeCard = ({ recipe }) => {
    const imageUrl = getImageUrl(recipe.image);

    return (
      <div
        className="recipe-card"
        onClick={() => navigate(`/recipes/${recipe._id}`)}
      >
        {imageUrl ? (
          <div className="recipe-card-image">
            <img
              src={imageUrl}
              alt={recipe.titre}
              onLoad={() => {
                console.log("✅ Image loaded successfully:", imageUrl);
              }}
              onError={(e) => {
                console.error("❌ Image failed to load:", {
                  url: imageUrl,
                  originalImage: recipe.image,
                  recipeTitle: recipe.titre,
                  error: e,
                });
                // Remplacer par le placeholder
                e.target.style.display = "none";
                const placeholder = document.createElement("div");
                placeholder.className = "recipe-card-placeholder";
                placeholder.innerHTML =
                  '<span class="placeholder-icon">🍽️</span>';
                e.target.parentNode.replaceChild(placeholder, e.target);
              }}
            />
          </div>
        ) : (
          <div className="recipe-card-placeholder">
            <span className="placeholder-icon">🍽️</span>
            <span className="placeholder-text">Aucune image</span>
          </div>
        )}

        <div className="recipe-card-content">
          <h3 className="recipe-card-title">{recipe.titre}</h3>
          <p className="recipe-card-description">
            {recipe.description?.length > 100
              ? `${recipe.description.substring(0, 100)}...`
              : recipe.description}
          </p>

          <div className="recipe-card-stats">
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span>{formatTime(recipe.tempsPreparation)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <span>{recipe.portions} pers.</span>
            </div>
            <div className="stat-item">
              <span
                className="stat-difficulty"
                style={{ color: getDifficultyColor(recipe.difficulte) }}
              >
                {recipe.difficulte}
              </span>
            </div>
          </div>

          {recipe.noteMoyenne > 0 && (
            <div className="recipe-card-rating">
              <StarRating rating={recipe.noteMoyenne} />
            </div>
          )}

          <div className="recipe-card-tags">
            {recipe.categories?.slice(0, 2).map((category, index) => (
              <span key={index} className="recipe-tag recipe-tag--category">
                {category}
              </span>
            ))}
            {recipe.tags?.slice(0, 1).map((tag, index) => (
              <span key={index} className="recipe-tag recipe-tag--normal">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="recipe-card-overlay">
          <span className="overlay-text">Voir la recette</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="recipes-loading">
        <Loader />
        <p>Chargement des recettes...</p>
      </div>
    );
  }

  return (
    <div className="recipes-page">
      <div className="recipes-container">
        {/* En-tête */}
        <div className="recipes-header">
          <div className="header-content">
            <h1 className="recipes-title">
              <span className="title-icon">🍽️</span>
              Nos Recettes
            </h1>
            <p className="recipes-subtitle">
              Découvrez {recipes.length} délicieuses recettes créées par notre
              communauté
            </p>
          </div>

          <div className="header-actions">
            {user && (
              <Link to="/recipes/add" className="btn btn--primary">
                <span>✨</span>
                Créer une recette
              </Link>
            )}

            <button
              onClick={() => {
                // Forcer le rechargement des recettes
                console.log("🔄 Rechargement forcé des recettes...");
                loadRecipes();
              }}
              className="btn btn--secondary"
              style={{ marginLeft: "10px" }}
            >
              🔄 Recharger
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="recipes-filters">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Toutes les catégories</option>
              {getUniqueCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              <option value="">Toutes difficultés</option>
              <option value="Facile">Facile</option>
              <option value="Moyen">Moyen</option>
              <option value="Difficile">Difficile</option>
            </select>

            {(searchQuery || selectedCategory || selectedDifficulty) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSelectedDifficulty("");
                }}
                className="btn-clear-filters"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        </div>

        {/* Résultats */}
        <div className="recipes-results">
          <div className="results-info">
            <span className="results-count">
              {filteredRecipes.length} recette(s) trouvée(s)
            </span>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="no-recipes">
              <div className="no-recipes-icon">🍽️</div>
              <h3>Aucune recette trouvée</h3>
              <p>
                {recipes.length === 0
                  ? "Soyez le premier à créer une recette !"
                  : "Essayez de modifier vos critères de recherche"}
              </p>
              {user && recipes.length === 0 && (
                <Link to="/recipes/add" className="btn btn--primary">
                  <span>✨</span>
                  Créer la première recette
                </Link>
              )}
            </div>
          ) : (
            <div className="recipes-grid">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
