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
}

const apiService = new ApiService();

// Services spécialisés
export const authService = {
  async login(credentials) {
    console.log("Attempting login with:", credentials);
    const response = await apiService.post("/auth/login", credentials);

    // Gestion flexible des différents formats de réponse
    if (response.token || response.access_token) {
      const token = response.token || response.access_token;
      const user = response.user || response.data || response;

      tokenService.setToken(token);
      tokenService.setUser(user);
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
    console.log("Attempting registration with:", userData);
    const response = await apiService.post("/auth/register", userData);

    // Gestion flexible des différents formats de réponse
    if (response.token || response.access_token) {
      const token = response.token || response.access_token;
      const user = response.user || response.data || response;

      tokenService.setToken(token);
      tokenService.setUser(user);
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
    const endpoint = queryString ? `/recipes?${queryString}` : "/recipes";
    return await apiService.get(endpoint);
  },

  async getById(id) {
    return await apiService.get(`/recipes/${id}`);
  },

  async search(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await apiService.get(`/recipes/search?${queryString}`);
  },
};

export const favoritesService = {
  async getAll() {
    return await apiService.get("/favorites");
  },

  async add(recipeId) {
    return await apiService.post("/favorites", { recipe_id: recipeId });
  },

  async remove(recipeId) {
    return await apiService.delete(`/favorites/${recipeId}`);
  },
};

export default apiService;
