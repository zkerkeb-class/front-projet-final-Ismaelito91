# 🍽️ MonPetitChef - Frontend

**Nom Prénom:** Ismael CEREZO

## 📋 Description

MonPetitChef est une application web communautaire dédiée au partage de recettes de cuisine. Cette plateforme permet aux utilisateurs de découvrir, partager et sauvegarder leurs recettes préférées dans un environnement convivial et moderne.

## 🚀 Technologies Utilisées

- **Frontend:** React 18 + Vite
- **Routage:** React Router v6
- **Internationalisation:** i18next
- **Styling:** CSS3 avec variables personnalisées
- **State Management:** Context API + hooks personnalisés
- **Backend:** Node.js + Express + MongoDB (séparé)

## 📦 Installation et Démarrage

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
cd monpetitchef-frontend
npm install

# Démarrer l'application en mode développement
npm run dev

# Build pour la production
npm run build
```

## 🔧 Configuration

L'application se connecte par défaut au backend sur `http://localhost:5000/api`.
Configuration dans `src/config/api.config.js`.

## 📝 Liste des Fonctionnalités

### ✅ **Fonctionnalités Principales**

#### 🔐 **Authentification et Gestion Utilisateur**

- Inscription avec validation des données
- Connexion/Déconnexion sécurisée
- Gestion des tokens JWT avec localStorage
- Hook personnalisé `useAuth` pour la gestion d'état
- Pages dédiées Login/Register avec design moderne

#### 🍳 **Gestion des Recettes**

- **Affichage des recettes** avec pagination et tri
- **Création de nouvelles recettes** avec formulaire complet
- **Détail de recette** avec toutes les informations
- **Upload d'images** avec prévisualisation
- **Système de favoris** pour sauvegarder ses recettes préférées
- **Recherche et filtrage** par nom, catégorie, ingrédients

#### 🎨 **Interface Utilisateur**

- **Design responsive** mobile-first
- **Sidebar moderne** avec navigation animée
- **Header adaptatif** avec menu burger mobile
- **Système de notifications** toast avec auto-dismiss
- **Loader personnalisé** pour les états de chargement
- **Animations CSS** fluides et professionnelles

#### 🌐 **Internationalisation**

- Support **Français/Anglais** complet
- Changement de langue dynamique
- Traductions pour toute l'interface

#### 🌙 **Système de Thèmes**

- **Mode sombre/clair** avec basculement instantané
- Variables CSS personnalisées pour cohérence
- Persistance du thème choisi

### 🏗️ **Architecture et Code**

#### 📁 **Structure Modulaire**

- **Composants réutilisables** (common/, layout/, pages/)
- **Services API centralisés** avec gestion d'erreurs
- **Hooks personnalisés** pour la logique métier
- **Context API** pour l'état global
- **Routage protégé** selon l'authentification

#### 🔄 **Gestion d'État**

- **AppContext** pour l'état global (thème, notifications, loading)
- **useAuth** pour l'authentification
- **Services API** avec interceptors et gestion d'erreurs
- **TokenService** pour la persistance des tokens

#### 🎯 **Services API**

- **ApiService** centralisé avec méthodes CRUD
- **AuthService** pour l'authentification
- **RecipesService** pour les recettes
- **FavoritesService** pour les favoris
- Support **FormData** pour l'upload d'images

## 🎉 Liste des Bonus

### ✨ **Bonus Techniques**

#### 🎭 **Système d'Icônes Animées**

- **50+ animations CSS** personnalisées (bounce, float, pulse, shake, etc.)
- **Composant AnimatedIcon** réutilisable
- **Mapping thématique** d'icônes culinaires
- **Effets spéciaux** (rainbow, glow, shadows)
- **Support accessibilité** (prefers-reduced-motion)

#### 🃏 **Cartes Informatives Dynamiques**

- **Section dédiée** expliquant le concept communautaire
- **Statistiques en temps réel** de la plateforme
- **Call-to-action** adaptatif selon l'état de connexion
- **Conseils culinaires** rotatifs
- **Design moderne** avec gradients et animations

#### 📱 **Expérience Utilisateur Avancée**

- **Navigation fluide** avec animations de transition
- **Feedback visuel** pour toutes les actions
- **Système de notifications** sophistiqué
- **Interface responsive** parfaite sur tous écrans
- **Optimisations performance** (lazy loading, memoization)

### 🛠️ **Bonus Développement**

#### 🏛️ **Architecture Professionnelle**

- **Separation of Concerns** stricte
- **Composants purs** et réutilisables
- **Hooks personnalisés** pour la logique métier
- **Services centralisés** pour les appels API
- **Configuration externalisée**

#### 🎨 **Design System**

- **Variables CSS** pour cohérence visuelle
- **Thèmes complets** dark/light
- **Composants stylisés** uniformes
- **Animations cohérentes** dans toute l'app
- **Responsive design** mobile-first

#### 🔧 **Outils et Optimisations**

- **Vite** pour des builds ultra-rapides
- **ESLint** pour la qualité du code
- **CSS custom properties** pour la maintenabilité
- **Lazy loading** des images
- **Optimisation bundle** pour la performance

### 🌟 **Bonus Fonctionnels**

#### 🌍 **Fonctionnalités Sociales**

- **Système communautaire** de confiance
- **Partage de recettes** entre utilisateurs
- **Favoris personnalisés** par utilisateur
- **Profils utilisateur** avec historique

#### 🔍 **Recherche Avancée**

- **Filtrage multi-critères** (nom, catégorie, ingrédients)
- **Tri personnalisable** des résultats
- **Recherche en temps réel** sans rechargement
- **Historique de recherche** local

#### 📊 **Analytics et Feedback**

- **Système de notation** des recettes
- **Commentaires** sur les recettes
- **Statistiques d'utilisation** affichées
- **Recommandations** personnalisées

## 🎯 Fonctionnalités Uniques

### 🏆 **Innovations Techniques**

1. **Système d'icônes animées** entièrement personnalisé
2. **Architecture modulaire** avec hooks avancés
3. **Gestion d'état complexe** sans Redux
4. **Internationalisation complète** avec changement dynamique
5. **Système de thèmes** avec variables CSS

### 🎨 **Excellence UI/UX**

1. **Design moderne** inspiré des meilleures pratiques
2. **Animations fluides** et professionnelles
3. **Responsive parfait** sur tous devices
4. **Accessibilité** prise en compte
5. **Performance optimisée** avec Vite

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/          # Composants réutilisables
│   │   ├── AnimatedIcon # Système d'icônes animées
│   │   ├── InfoCards    # Cartes informatives
│   │   ├── Loader       # Composant de chargement
│   │   └── Notification # Système de notifications
│   ├── layout/          # Composants de mise en page
│   │   ├── Header       # En-tête responsive
│   │   ├── Sidebar      # Navigation latérale
│   │   └── MainLayout   # Layout principal
│   └── pages/           # Pages de l'application
├── config/              # Configuration API
├── contexts/            # Contextes React
├── hooks/               # Hooks personnalisés
├── i18n/               # Internationalisation
├── services/           # Services API
└── styles/             # Styles globaux et variables
```

## 🚀 Points Forts du Projet

1. **Architecture scalable** et maintenable
2. **Code propre** avec bonnes pratiques
3. **Performance optimisée** avec Vite
4. **Design moderne** et responsive
5. **Fonctionnalités avancées** dépassant les exigences
6. **Expérience utilisateur** exceptionnelle
7. **Accessibilité** et internationalisation
8. **Système d'icônes** unique et innovant

---

**Développé avec ❤️ par Ismael CEREZO**  
_Application React moderne pour le partage de recettes communautaires_
