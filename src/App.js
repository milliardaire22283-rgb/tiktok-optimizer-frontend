import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';

function Home({ setObjectif }) {
  const [choix, setChoix] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setObjectif(choix);
    localStorage.setItem("videoUrl", videoUrl); // on sauvegarde le lien
  };

  return (
    <div className="App">
      <h1>🚀 TikTok Optimizer</h1>
      <nav>
        <Link to="/">Accueil</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>

      <p>Colle le lien de ta vidéo TikTok :</p>
      <input
        type="text"
        placeholder="https://www.tiktok.com/..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        style={{ width: "80%", padding: "8px", marginBottom: "15px" }}
      />

      <p>Choisis ton objectif :</p>

      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            value="Visibilité"
            checked={choix === 'Visibilité'}
            onChange={(e) => setChoix(e.target.value)}
          />
          📢 Visibilité
        </label>
        <br />

        <label>
          <input
            type="radio"
            value="Clients"
            checked={choix === 'Clients'}
            onChange={(e) => setChoix(e.target.value)}
          />
          💰 Clients
        </label>
        <br />

        <label>
          <input
            type="radio"
            value="Les deux"
            checked={choix === 'Les deux'}
            onChange={(e) => setChoix(e.target.value)}
          />
          ⚡ Les deux
        </label>
        <br />

        <button type="submit">Valider</button>
      </form>
    </div>
  );
}

function App() {
  const [objectif, setObjectif] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setObjectif={setObjectif} />} />
        <Route path="/dashboard" element={<Dashboard objectif={objectif} />} />
      </Routes>
    </Router>
  );
}

export default App;
