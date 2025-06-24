import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Traductions français
const fr = {
  translation: {
    // Navigation
    nav: {
      home: "Accueil",
      recipes: "Recettes",
      favorites: "Favoris",
      profile: "Profil",
      login: "Connexion",
      logout: "Déconnexion",
      register: "Inscription",
    },
    // Authentification
    auth: {
      login: "Connexion",
      register: "Inscription",
      email: "Adresse e-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      name: "Nom",
      loginSuccess: "Connexion réussie",
      loginError: "Erreur de connexion",
      registerSuccess: "Inscription réussie",
      registerError: "Erreur lors de l'inscription",
      logout: "Se déconnecter",
      welcomeBack: "Bon retour !",
      createAccount: "Créer un compte",
    },
    // Recettes
    recipes: {
      title: "Recettes",
      noRecipes: "Aucune recette trouvée",
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris",
      ingredients: "Ingrédients",
      instructions: "Instructions",
      cookingTime: "Temps de cuisson",
      difficulty: "Difficulté",
      servings: "Portions",
      createRecipe: "Créer une recette",
      editRecipe: "Modifier la recette",
      deleteRecipe: "Supprimer la recette",
    },
    // Interface
    ui: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      close: "Fermer",
      search: "Rechercher",
      language: "Langue",
      theme: "Thème",
      darkMode: "Mode sombre",
      lightMode: "Mode clair",
    },
    // Messages
    messages: {
      networkError: "Erreur de réseau",
      serverError: "Erreur du serveur",
      unauthorized: "Non autorisé",
      notFound: "Page non trouvée",
      welcome: "Bienvenue sur Mon Petit Chef",
    },
  },
};

// Traductions anglais
const en = {
  translation: {
    // Navigation
    nav: {
      home: "Home",
      recipes: "Recipes",
      favorites: "Favorites",
      profile: "Profile",
      login: "Login",
      logout: "Logout",
      register: "Register",
    },
    // Authentification
    auth: {
      login: "Login",
      register: "Register",
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      name: "Name",
      loginSuccess: "Login successful",
      loginError: "Login error",
      registerSuccess: "Registration successful",
      registerError: "Registration error",
      logout: "Logout",
      welcomeBack: "Welcome back!",
      createAccount: "Create account",
    },
    // Recettes
    recipes: {
      title: "Recipes",
      noRecipes: "No recipes found",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      ingredients: "Ingredients",
      instructions: "Instructions",
      cookingTime: "Cooking time",
      difficulty: "Difficulty",
      servings: "Servings",
      createRecipe: "Create recipe",
      editRecipe: "Edit recipe",
      deleteRecipe: "Delete recipe",
    },
    // Interface
    ui: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      search: "Search",
      language: "Language",
      theme: "Theme",
      darkMode: "Dark mode",
      lightMode: "Light mode",
    },
    // Messages
    messages: {
      networkError: "Network error",
      serverError: "Server error",
      unauthorized: "Unauthorized",
      notFound: "Page not found",
      welcome: "Welcome to Mon Petit Chef",
    },
  },
};

i18n.use(initReactI18next).init({
  resources: {
    fr,
    en,
  },
  lng: localStorage.getItem("language") || "fr",
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
