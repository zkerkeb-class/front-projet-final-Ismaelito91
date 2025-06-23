import { useState } from "react";
import "./App.css";
import useAuth from "./hooks/useAuth";

function App() {
  const { login, logout, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mon Petit Chef</h1>
      </header>

      <main>
        {isAuthenticated ? (
          <div>
            <h2>Bienvenue sur Mon Petit Chef</h2>
            <button onClick={logout}>Déconnexion</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
            <button type="submit">Connexion</button>
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
