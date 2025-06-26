import tokenService from "./token.service";
import { API_CONFIG } from "../config/api.config";

// Service HTTP générique
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API Request:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
      body: config.body,
    });

    try {
      const response = await fetch(url, config);

      console.log("API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        let errorData = null;

        try {
          errorData = await response.json();
          console.log("Error response data:", errorData);

          // Gestion spécifique selon le format de votre backend
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Si on ne peut pas parser le JSON d'erreur, on garde le message par défaut
        }

        const error = new Error(errorMessage);
        // Ajouter les erreurs de validation si elles existent
        if (errorData && errorData.errors) {
          error.errors = errorData.errors;
          error.validationErrors = true;
        }

        throw error;
      }

      // Si la réponse est vide (204 No Content), retourner un objet vide
      if (response.status === 204) {
        return {};
      }

      const data = await response.json();
      console.log("API Data:", data);
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Méthodes HTTP
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  // Pour les uploads de fichiers
  postFormData(endpoint, formData, options = {}) {
    const headers = { ...options.headers };
    delete headers["Content-Type"]; // Laisser le navigateur définir le Content-Type pour FormData

    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers,
    });
  }

  // Pour les mises à jour avec fichiers
  putFormData(endpoint, formData, options = {}) {
    const headers = { ...options.headers };
    delete headers["Content-Type"]; // Laisser le navigateur définir le Content-Type pour FormData

    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: formData,
      headers,
    });
  }
}

const apiService = new ApiService();

// Services spécialisés
export const authService = {
  async login(credentials) {
    const response = await apiService.post("/auth/login", credentials);

    // Gestion flexible des différents formats de réponse
    if (response.token || response.access_token) {
      const token = response.token || response.access_token;

      // Essayer différentes façons d'extraire l'utilisateur
      let user = null;
      if (response.user) {
        user = response.user;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        response.data.nom
      ) {
        user = response.data;
      } else if (response.nom) {
        // Si l'utilisateur est directement dans la réponse
        user = response;
      }

      if (user) {
        tokenService.setToken(token);
        tokenService.setUser(user);
      }
    }

    return response;
  },

  async logout() {
    try {
      await apiService.post("/auth/logout");
    } finally {
      tokenService.clear();
    }
  },

  async register(userData) {
    const response = await apiService.post("/auth/register", userData);

    // Gestion flexible des différents formats de réponse
    if (response.token || response.access_token) {
      const token = response.token || response.access_token;

      // Essayer différentes façons d'extraire l'utilisateur
      let user = null;
      if (response.user) {
        user = response.user;
      } else if (
        response.data &&
        typeof response.data === "object" &&
        response.data.nom
      ) {
        user = response.data;
      } else if (response.nom) {
        // Si l'utilisateur est directement dans la réponse
        user = response;
      }

      if (user) {
        tokenService.setToken(token);
        tokenService.setUser(user);
      }
    }

    return response;
  },

  async getCurrentUser() {
    return await apiService.get("/auth/me");
  },
};

export const recipesService = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/recettes?${queryString}` : "/recettes";
    const response = await apiService.get(endpoint);

    // Adapter au format de réponse du backend : { success, count, data: [...] }
    return response.data || response;
  },

  async getById(id) {
    const response = await apiService.get(`/recettes/${id}`);

    // Adapter au format de réponse du backend
    return response.data || response;
  },

  async create(recipeData) {
    return await apiService.post("/recettes", recipeData);
  },

  async createWithImage(recipeData, imageFile = null) {
    // Si pas d'image, envoyer en JSON normal
    if (!imageFile) {
      console.log("📝 Création sans image:", recipeData);
      return await apiService.post("/recettes", recipeData);
    }

    // Avec image : utiliser FormData comme attendu par le backend
    console.log("📝 Création avec image:", { recipeData, imageFile });

    const formData = new FormData();

    // Ajouter l'image d'abord (champ attendu par Multer)
    formData.append("image", imageFile);

    // Ajouter tous les champs de la recette
    Object.keys(recipeData).forEach((key) => {
      const value = recipeData[key];

      if (Array.isArray(value)) {
        // Pour les tableaux, utiliser la notation PHP/Express standard
        value.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            // Pour les objets (comme ingredients)
            Object.keys(item).forEach((subKey) => {
              formData.append(
                `${key}[${index}][${subKey}]`,
                item[subKey] || ""
              );
            });
          } else {
            // Pour les chaînes simples (comme etapesPreparation)
            formData.append(`${key}[${index}]`, item || "");
          }
        });
      } else {
        formData.append(key, value);
      }
    });

    return await apiService.postFormData("/recettes", formData);
  },

  async update(id, recipeData) {
    return await apiService.put(`/recettes/${id}`, recipeData);
  },

  async updateWithImage(id, recipeData, imageFile = null) {
    // Si pas d'image, envoyer en JSON normal
    if (!imageFile) {
      return await apiService.put(`/recettes/${id}`, recipeData);
    }

    const formData = new FormData();

    // Ajouter l'image d'abord (champ attendu par Multer)
    formData.append("image", imageFile);

    // Ajouter tous les champs de la recette
    Object.keys(recipeData).forEach((key) => {
      const value = recipeData[key];

      if (Array.isArray(value)) {
        // Pour les tableaux, les convertir en JSON string
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    return await apiService.putFormData(`/recettes/${id}`, formData);
  },

  async delete(id) {
    return await apiService.delete(`/recettes/${id}`);
  },

  async search(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await apiService.get(`/recettes/search?${queryString}`);
  },

  async uploadImage(recipeId, imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    return await apiService.postFormData(
      `/recettes/${recipeId}/image`,
      formData
    );
  },

  async addRating(recipeId, rating) {
    return await apiService.post(`/recettes/${recipeId}/rating`, {
      valeur: rating,
    });
  },

  async getUserRecipes() {
    return await apiService.get("/recettes/user");
  },

  // Validation d'image côté client
  validateImage(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!file) {
      return { valid: true };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "L'image ne doit pas dépasser 5MB",
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Format d'image non supporté. Utilisez JPG, PNG, GIF ou WebP",
      };
    }

    return { valid: true };
  },

  // Calcul des portions ajustées
  calculatePortions(recipe, newPortions) {
    const originalPortions = recipe.portions;
    const ratio = newPortions / originalPortions;

    return {
      ...recipe,
      portions: newPortions,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        quantite: this.adjustQuantity(ingredient.quantite, ratio),
      })),
      tempsPreparation: recipe.tempsPreparation,
      tempsCuisson: recipe.tempsCuisson,
    };
  },

  // Ajustement intelligent des quantités
  adjustQuantity(originalQuantity, ratio) {
    // Extraire le nombre de la chaîne de quantité
    const numberMatch = originalQuantity.match(/(\d+(?:[.,]\d+)?)/);
    if (!numberMatch) return originalQuantity;

    const originalNumber = parseFloat(numberMatch[1].replace(",", "."));
    const newNumber = originalNumber * ratio;

    // Arrondir intelligemment
    let adjustedNumber;
    if (newNumber < 1) {
      adjustedNumber = Math.round(newNumber * 100) / 100; // 2 décimales pour les petites quantités
    } else if (newNumber < 10) {
      adjustedNumber = Math.round(newNumber * 10) / 10; // 1 décimale
    } else {
      adjustedNumber = Math.round(newNumber); // Nombre entier
    }

    // Remplacer dans la chaîne originale
    return originalQuantity.replace(
      numberMatch[1],
      adjustedNumber.toString().replace(".", ",")
    );
  },
};

export const favoritesService = {
  async getAll() {
    return await apiService.get("/favoris");
  },

  async add(recipeId) {
    return await apiService.post("/favoris", { recette_id: recipeId });
  },

  async remove(recipeId) {
    return await apiService.delete(`/favoris/${recipeId}`);
  },

  async isFavorite(recipeId) {
    try {
      const favorites = await this.getAll();
      return favorites.some(
        (fav) => fav.recette_id === recipeId || fav._id === recipeId
      );
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  },
};

export default apiService;
