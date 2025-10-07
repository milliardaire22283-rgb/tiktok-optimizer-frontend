import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ objectif }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [tips, setTips] = useState([]);
  const videoUrl = localStorage.getItem("videoUrl") || "";

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('http://localhost:4000/analyze-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoUrl, objectif }),
        });
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
        const data = await res.json();
        setScore(data.score || 0);
        setTips(data.tips || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [videoUrl, objectif]);

  const barData = {
    labels: ['Visibilité', 'Clients', 'Les deux'],
    datasets: [
      {
        label: 'Priorité',
        data: [
          objectif === "Visibilité" ? 100 : 30,
          objectif === "Clients" ? 100 : 30,
          objectif === "Les deux" ? 100 : 30,
        ],
        backgroundColor: ['#4a90e2', '#50e3c2', '#f5a623'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Analyse de ton objectif' } },
  };

  return (
    <div className="App">
      <h1>📊 Tableau de bord</h1>
      <nav>
        <Link to="/">Accueil</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>

      <h2>Ton objectif : {objectif || "Non défini"}</h2>

      {videoUrl ? (
        <div style={{ marginBottom: 10 }}>
          <strong>🎥 Lien vidéo:</strong> <a href={videoUrl} target="_blank" rel="noopener noreferrer">{videoUrl}</a>
        </div>
      ) : (
        <p>⚠️ Aucun lien vidéo fourni (retourne à l’accueil et colle ton lien).</p>
      )}

      {loading && <p>⏳ Analyse en cours…</p>}
      {error && <p>❌ Erreur: {error}</p>}

      {!loading && !error && (
        <>
          {/* Compteur animé */}
          <div style={{ margin: '20px', fontSize: '24px', fontWeight: 'bold' }}>
            Score d’optimisation : <CountUp end={score} duration={1.5} />%
          </div>

          {/* Jauge circulaire */}
          <div style={{ width: 160, height: 160, margin: '10px auto 20px' }}>
            <CircularProgressbar
              value={score}
              text={`${score}%`}
              styles={buildStyles({
                textColor: "#4a4aef",
                pathColor: score >= 70 ? "#4a90e2" : score >= 40 ? "#f5a623" : "#e94e4e",
                trailColor: "#d6d6d6",
              })}
            />
          </div>

          {/* Conseils personnalisés */}
          <div className="result">
            <h2>🔑 Recommandations en temps réel</h2>
            <ul>
              {tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Graphique */}
          <div style={{ width: '500px', margin: '20px auto' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
