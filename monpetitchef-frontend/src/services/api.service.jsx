import API_ENDPOINTS from "../config/api.endpoints";
import tokenService from "./token.service";

// Fonction utilitaire pour gérer les réponses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la requête");
  }

  return data;
};

// Fonction générique pour les appels API
export const apiCall = async (url, options = {}) => {
  try {
    const defaultHeaders = tokenService.getAuthHeaders();

    const response = await fetch(url, {
      headers: defaultHeaders,
      ...options,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

// Fonction pour les appels avec FormData (upload de fichiers)
export const apiCallWithFormData = async (url, formData, method = "POST") => {
  try {
    const headers = tokenService.getAuthHeadersForFormData();

    const response = await fetch(url, {
      method,
      headers,
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

// Services spécifiques pour chaque entité
export const authService = {
  register: (userData) =>
    apiCall(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: async (credentials) => {
    const data = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Stocker le token et l'utilisateur
    if (data.token) {
      tokenService.setToken(data.token);
      tokenService.setUser(data.user);
    }

    return data;
  },

  logout: () => apiCall(API_ENDPOINTS.AUTH.LOGOUT),

  getMe: () => apiCall(API_ENDPOINTS.AUTH.ME),

  updateDetails: (userData) =>
    apiCall(API_ENDPOINTS.AUTH.UPDATE_DETAILS, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  updatePassword: (passwordData) =>
    apiCall(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),
};

export const recettesService = {
  getAll: (params = "") =>
    apiCall(`${API_ENDPOINTS.RECETTES.GET_ALL}${params}`),

  getOne: (id) => apiCall(API_ENDPOINTS.RECETTES.GET_ONE(id)),

  create: (recetteData, image = null) => {
    if (image) {
      const formData = new FormData();
      Object.keys(recetteData).forEach((key) => {
        if (Array.isArray(recetteData[key])) {
          formData.append(key, JSON.stringify(recetteData[key]));
        } else {
          formData.append(key, recetteData[key]);
        }
      });
      formData.append("image", image);
      return apiCallWithFormData(API_ENDPOINTS.RECETTES.CREATE, formData);
    } else {
      return apiCall(API_ENDPOINTS.RECETTES.CREATE, {
        method: "POST",
        body: JSON.stringify(recetteData),
      });
    }
  },

  update: (id, recetteData, image = null) => {
    if (image) {
      const formData = new FormData();
      Object.keys(recetteData).forEach((key) => {
        if (Array.isArray(recetteData[key])) {
          formData.append(key, JSON.stringify(recetteData[key]));
        } else {
          formData.append(key, recetteData[key]);
        }
      });
      formData.append("image", image);
      return apiCallWithFormData(
        API_ENDPOINTS.RECETTES.UPDATE(id),
        formData,
        "PUT"
      );
    } else {
      return apiCall(API_ENDPOINTS.RECETTES.UPDATE(id), {
        method: "PUT",
        body: JSON.stringify(recetteData),
      });
    }
  },

  delete: (id) =>
    apiCall(API_ENDPOINTS.RECETTES.DELETE(id), {
      method: "DELETE",
    }),

  getPopulaires: (limit = 5) =>
    apiCall(`${API_ENDPOINTS.RECETTES.POPULAIRES}?limit=${limit}`),

  getRecentes: (limit = 5) =>
    apiCall(`${API_ENDPOINTS.RECETTES.RECENTES}?limit=${limit}`),

  addNote: (id, note) =>
    apiCall(API_ENDPOINTS.RECETTES.ADD_NOTE(id), {
      method: "POST",
      body: JSON.stringify({ valeur: note }),
    }),

  addToFavoris: (id) =>
    apiCall(API_ENDPOINTS.RECETTES.ADD_FAVORI(id), {
      method: "POST",
    }),

  removeFromFavoris: (id) =>
    apiCall(API_ENDPOINTS.RECETTES.REMOVE_FAVORI(id), {
      method: "DELETE",
    }),
};

export const commentairesService = {
  getByRecette: (recetteId) =>
    apiCall(API_ENDPOINTS.COMMENTAIRES.GET_BY_RECETTE(recetteId)),

  add: (recetteId, texte) =>
    apiCall(API_ENDPOINTS.COMMENTAIRES.ADD(recetteId), {
      method: "POST",
      body: JSON.stringify({ texte }),
    }),

  update: (id, texte) =>
    apiCall(API_ENDPOINTS.COMMENTAIRES.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify({ texte }),
    }),

  delete: (id) =>
    apiCall(API_ENDPOINTS.COMMENTAIRES.DELETE(id), {
      method: "DELETE",
    }),
};

export const usersService = {
  getProfile: (id) => apiCall(API_ENDPOINTS.USERS.GET_PROFILE(id)),

  getFavoris: (id) => apiCall(API_ENDPOINTS.USERS.GET_FAVORIS(id)),

  updateAvatar: (id, avatarFile) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    return apiCallWithFormData(
      API_ENDPOINTS.USERS.UPDATE_AVATAR(id),
      formData,
      "PUT"
    );
  },
};

export default {
  authService,
  recettesService,
  commentairesService,
  usersService,
};
