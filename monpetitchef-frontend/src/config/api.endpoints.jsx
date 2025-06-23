// Configuration API pour le front-end React
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configuration des endpoints
export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    UPDATE_DETAILS: `${API_BASE_URL}/auth/updatedetails`,
    UPDATE_PASSWORD: `${API_BASE_URL}/auth/updatepassword`,
  },

  // Recettes
  RECETTES: {
    GET_ALL: `${API_BASE_URL}/recettes`,
    GET_ONE: (id) => `${API_BASE_URL}/recettes/${id}`,
    CREATE: `${API_BASE_URL}/recettes`,
    UPDATE: (id) => `${API_BASE_URL}/recettes/${id}`,
    DELETE: (id) => `${API_BASE_URL}/recettes/${id}`,
    POPULAIRES: `${API_BASE_URL}/recettes/populaires`,
    RECENTES: `${API_BASE_URL}/recettes/recentes`,
    ADD_NOTE: (id) => `${API_BASE_URL}/recettes/${id}/notes`,
    ADD_FAVORI: (id) => `${API_BASE_URL}/recettes/${id}/favoris`,
    REMOVE_FAVORI: (id) => `${API_BASE_URL}/recettes/${id}/favoris`,
  },

  // Commentaires
  COMMENTAIRES: {
    GET_BY_RECETTE: (recetteId) =>
      `${API_BASE_URL}/recettes/${recetteId}/commentaires`,
    ADD: (recetteId) => `${API_BASE_URL}/recettes/${recetteId}/commentaires`,
    UPDATE: (id) => `${API_BASE_URL}/commentaires/${id}`,
    DELETE: (id) => `${API_BASE_URL}/commentaires/${id}`,
  },

  // Utilisateurs
  USERS: {
    GET_ALL: `${API_BASE_URL}/users`,
    GET_ONE: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/${id}`,
    GET_PROFILE: (id) => `${API_BASE_URL}/users/${id}/profile`,
    GET_FAVORIS: (id) => `${API_BASE_URL}/users/${id}/favoris`,
    UPDATE_AVATAR: (id) => `${API_BASE_URL}/users/${id}/avatar`,
  },
};

export default API_ENDPOINTS;
