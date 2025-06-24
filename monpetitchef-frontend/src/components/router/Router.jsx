import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../common/Loader";

// Layouts
import MainLayout from "../layout/MainLayout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Recipes from "../pages/Recipes";
import RecipeDetail from "../pages/RecipeDetail";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

// Composant pour les routes protégées
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialLoading } = useAuth();

  console.log(
    "ProtectedRoute - isAuthenticated:",
    isAuthenticated,
    "initialLoading:",
    initialLoading
  );

  if (initialLoading) {
    return <Loader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Composant pour les routes publiques (redirection si connecté)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, initialLoading } = useAuth();

  console.log(
    "PublicRoute - isAuthenticated:",
    isAuthenticated,
    "initialLoading:",
    initialLoading
  );

  if (initialLoading) {
    return <Loader />;
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const Router = () => {
  console.log("Router rendering");

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Routes avec layout principal */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />

          {/* Routes protégées */}
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
