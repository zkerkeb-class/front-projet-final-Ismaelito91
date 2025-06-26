import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipesService } from "../../services/api.service";
import { useApp } from "../../contexts/AppContext";
import ImageUpload from "../common/ImageUpload";
import Loader from "../common/Loader";
import "./AddRecipe.css";

const AddRecipe = () => {
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    tempsPreparation: "",
    tempsCuisson: "",
    portions: "",
    difficulte: "Facile",
  });

  const [ingredients, setIngredients] = useState([
    { nom: "", quantite: "", unite: "" },
  ]);

  const [etapesPreparation, setEtapesPreparation] = useState([""]);
  const [categories, setCategories] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation des données
  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (!formData.tempsPreparation || formData.tempsPreparation <= 0) {
      newErrors.tempsPreparation =
        "Le temps de préparation doit être supérieur à 0";
    }

    if (!formData.portions || formData.portions <= 0) {
      newErrors.portions = "Le nombre de portions doit être supérieur à 0";
    } else if (formData.portions > 50) {
      newErrors.portions = "Le nombre de portions ne peut pas dépasser 50";
    }

    // Validation des ingrédients
    const validIngredients = ingredients.filter(
      (ing) => ing.nom.trim() && ing.quantite.trim()
    );
    if (validIngredients.length === 0) {
      newErrors.ingredients = "Au moins un ingrédient est requis";
    }

    // Validation des étapes
    const validEtapes = etapesPreparation.filter((etape) => etape.trim());
    if (validEtapes.length === 0) {
      newErrors.etapesPreparation = "Au moins une étape est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des champs simples
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Supprimer l'erreur si le champ est maintenant valide
    if (errors[name] && value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Gestion des ingrédients
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);

    // Supprimer l'erreur d'ingrédients si au moins un est valide
    if (errors.ingredients) {
      const validIngredients = newIngredients.filter(
        (ing) => ing.nom.trim() && ing.quantite.trim()
      );
      if (validIngredients.length > 0) {
        setErrors((prev) => ({
          ...prev,
          ingredients: "",
        }));
      }
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { nom: "", quantite: "", unite: "" }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Gestion des étapes
  const handleEtapeChange = (index, value) => {
    const newEtapes = [...etapesPreparation];
    newEtapes[index] = value;
    setEtapesPreparation(newEtapes);

    // Supprimer l'erreur d'étapes si au moins une est valide
    if (errors.etapesPreparation) {
      const validEtapes = newEtapes.filter((etape) => etape.trim());
      if (validEtapes.length > 0) {
        setErrors((prev) => ({
          ...prev,
          etapesPreparation: "",
        }));
      }
    }
  };

  const addEtape = () => {
    setEtapesPreparation([...etapesPreparation, ""]);
  };

  const removeEtape = (index) => {
    if (etapesPreparation.length > 1) {
      setEtapesPreparation(etapesPreparation.filter((_, i) => i !== index));
    }
  };

  // Gestion des catégories
  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, ""]);
  };

  const removeCategory = (index) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  // Gestion des tags
  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  // Gestion de l'image
  const handleImageSelect = (imageFile) => {
    setSelectedImage(imageFile);
    console.log("Image sélectionnée:", imageFile);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification("error", "Veuillez corriger les erreurs du formulaire");
      return;
    }

    setLoading(true);

    try {
      // Préparer les données de la recette
      const recipeData = {
        ...formData,
        tempsPreparation: parseInt(formData.tempsPreparation),
        tempsCuisson: parseInt(formData.tempsCuisson) || 0,
        portions: parseInt(formData.portions),
        ingredients: ingredients.filter(
          (ing) => ing.nom.trim() && ing.quantite.trim()
        ),
        etapesPreparation: etapesPreparation.filter((etape) => etape.trim()),
        categories: categories.filter((cat) => cat.trim()),
        tags: tags.filter((tag) => tag.trim()),
      };

      console.log("Données de la recette à envoyer:", recipeData);
      console.log("Image à uploader:", selectedImage);

      // Utiliser la méthode avec image si une image est sélectionnée
      let response;
      if (selectedImage) {
        response = await recipesService.createWithImage(
          recipeData,
          selectedImage
        );
      } else {
        response = await recipesService.create(recipeData);
      }

      console.log("Réponse de création:", response);

      addNotification("success", "Recette créée avec succès !");

      // Rediriger vers la page de détail de la recette ou la liste
      const recipeId = response._id || response.data?._id || response.id;
      if (recipeId) {
        navigate(`/recipes/${recipeId}`);
      } else {
        navigate("/recipes");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);

      if (error.validationErrors && error.errors) {
        // Erreurs de validation du backend
        const backendErrors = {};
        error.errors.forEach((err) => {
          backendErrors[err.field || "general"] = err.message;
        });
        setErrors(backendErrors);
        addNotification("error", "Erreurs de validation détectées");
      } else {
        addNotification(
          "error",
          error.message || "Erreur lors de la création de la recette"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-page">
      <div className="add-recipe-container">
        <div className="add-recipe-header">
          <h1 className="add-recipe-title">
            <span className="recipe-icon">👨‍🍳</span>
            Créer une nouvelle recette
          </h1>
          <p className="add-recipe-subtitle">
            Partagez votre création culinaire avec la communauté
          </p>
        </div>

        <form onSubmit={handleSubmit} className="add-recipe-form">
          {/* Informations générales */}
          <div className="form-section">
            <h2 className="section-title">📝 Informations générales</h2>

            <div className="form-group">
              <label htmlFor="titre" className="form-label">
                Titre de la recette *
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.titre ? "form-input--error" : ""
                }`}
                placeholder="Ex: Tarte aux pommes de grand-mère"
                disabled={loading}
                maxLength={100}
              />
              {errors.titre && (
                <span className="form-error">{errors.titre}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-textarea ${
                  errors.description ? "form-input--error" : ""
                }`}
                placeholder="Décrivez votre recette, son origine, ce qui la rend spéciale..."
                disabled={loading}
                rows={4}
              />
              {errors.description && (
                <span className="form-error">{errors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tempsPreparation" className="form-label">
                  Temps de préparation (min) *
                </label>
                <input
                  type="number"
                  id="tempsPreparation"
                  name="tempsPreparation"
                  value={formData.tempsPreparation}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.tempsPreparation ? "form-input--error" : ""
                  }`}
                  placeholder="30"
                  disabled={loading}
                  min="1"
                />
                {errors.tempsPreparation && (
                  <span className="form-error">{errors.tempsPreparation}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tempsCuisson" className="form-label">
                  Temps de cuisson (min)
                </label>
                <input
                  type="number"
                  id="tempsCuisson"
                  name="tempsCuisson"
                  value={formData.tempsCuisson}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="45"
                  disabled={loading}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="portions" className="form-label">
                  Nombre de portions *
                </label>
                <input
                  type="number"
                  id="portions"
                  name="portions"
                  value={formData.portions}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.portions ? "form-input--error" : ""
                  }`}
                  placeholder="4"
                  disabled={loading}
                  min="1"
                  max="50"
                />
                {errors.portions && (
                  <span className="form-error">{errors.portions}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="difficulte" className="form-label">
                  Difficulté
                </label>
                <select
                  id="difficulte"
                  name="difficulte"
                  value={formData.difficulte}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ingrédients */}
          <div className="form-section">
            <h2 className="section-title">🥕 Ingrédients</h2>
            {errors.ingredients && (
              <span className="form-error">{errors.ingredients}</span>
            )}

            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <div className="ingredient-fields">
                  <input
                    type="text"
                    placeholder="Nom de l'ingrédient"
                    value={ingredient.nom}
                    onChange={(e) =>
                      handleIngredientChange(index, "nom", e.target.value)
                    }
                    className="form-input ingredient-name"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    placeholder="Quantité"
                    value={ingredient.quantite}
                    onChange={(e) =>
                      handleIngredientChange(index, "quantite", e.target.value)
                    }
                    className="form-input ingredient-quantity"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    placeholder="Unité (optionnel)"
                    value={ingredient.unite}
                    onChange={(e) =>
                      handleIngredientChange(index, "unite", e.target.value)
                    }
                    className="form-input ingredient-unit"
                    disabled={loading}
                  />
                </div>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn-remove"
                    disabled={loading}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="btn-add"
              disabled={loading}
            >
              ➕ Ajouter un ingrédient
            </button>
          </div>

          {/* Étapes de préparation */}
          <div className="form-section">
            <h2 className="section-title">👩‍🍳 Étapes de préparation</h2>
            {errors.etapesPreparation && (
              <span className="form-error">{errors.etapesPreparation}</span>
            )}

            {etapesPreparation.map((step, index) => (
              <div key={index} className="step-row">
                <div className="step-number">{index + 1}</div>
                <textarea
                  placeholder={`Étape ${index + 1}...`}
                  value={step}
                  onChange={(e) => handleEtapeChange(index, e.target.value)}
                  className="form-textarea step-textarea"
                  disabled={loading}
                  rows={2}
                />
                {etapesPreparation.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEtape(index)}
                    className="btn-remove"
                    disabled={loading}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addEtape}
              className="btn-add"
              disabled={loading}
            >
              ➕ Ajouter une étape
            </button>
          </div>

          {/* Catégories et Tags */}
          <div className="form-section">
            <h2 className="section-title">🏷️ Classification</h2>

            <div className="form-subsection">
              <h3 className="subsection-title">Catégories *</h3>
              {errors.categories && (
                <span className="form-error">{errors.categories}</span>
              )}

              {categories.map((category, index) => (
                <div key={index} className="tag-row">
                  <input
                    type="text"
                    placeholder="Ex: Dessert, Plat principal, Entrée..."
                    value={category}
                    onChange={(e) =>
                      handleCategoryChange(index, e.target.value)
                    }
                    className="form-input"
                    disabled={loading}
                  />
                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="btn-remove"
                      disabled={loading}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addCategory}
                className="btn-add"
                disabled={loading}
              >
                ➕ Ajouter une catégorie
              </button>
            </div>

            <div className="form-subsection">
              <h3 className="subsection-title">Tags (optionnel)</h3>

              {tags.map((tag, index) => (
                <div key={index} className="tag-row">
                  <input
                    type="text"
                    placeholder="Ex: Végétarien, Sans gluten, Rapide..."
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="btn-remove"
                      disabled={loading}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addTag}
                className="btn-add"
                disabled={loading}
              >
                ➕ Ajouter un tag
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="form-section">
            <h2 className="section-title">📸 Photo de la recette</h2>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Image (optionnel)
              </label>
              <ImageUpload onImageSelect={handleImageSelect} />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/recipes")}
              className="btn btn--secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? (
                <Loader size="small" />
              ) : (
                <>
                  <span>✨</span>
                  Créer la recette
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
