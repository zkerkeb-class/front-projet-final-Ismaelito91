// Configuration de l'API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// URL de base pour les images (sans /api)
export const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

// Fonction utilitaire pour construire les URLs d'images
export const getImageUrl = (imagePath) => {
  console.log("🖼️ getImageUrl called with:", {
    imagePath,
    type: typeof imagePath,
  });

  if (!imagePath) {
    console.log("❌ No image path provided, returning null");
    return null;
  }

  // Pour default.jpg, on retourne null pour afficher le placeholder
  if (imagePath === "default.jpg") {
    console.log("🔄 Default image detected, returning null for placeholder");
    return null;
  }

  // Si l'URL commence par http, c'est une URL externe (Google, etc.)
  if (imagePath.startsWith("http")) {
    console.log("🌐 External URL detected (Google, etc.):", imagePath);
    return imagePath;
  }

  // Si c'est un chemin relatif, construire l'URL complète avec notre serveur
  let fullUrl;
  if (imagePath.startsWith("/")) {
    fullUrl = `${IMAGE_BASE_URL}${imagePath}`;
  } else {
    // D'après votre backend : fichiers stockés dans /uploads/
    // Format : image-{timestamp}.{extension}
    fullUrl = `${IMAGE_BASE_URL}/uploads/${imagePath}`;
  }

  console.log("🔗 Local file URL constructed:", {
    original: imagePath,
    full: fullUrl,
    baseUrl: IMAGE_BASE_URL,
    expectedFormat: "image-{timestamp}.{extension}",
  });
  return fullUrl;
};

export default API_CONFIG;
