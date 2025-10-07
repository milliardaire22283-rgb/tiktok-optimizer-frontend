const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simulateur d'analyse "IA" basique
function analyzeVideo({ videoUrl, objectif }) {
  const tips = [];
  let score = 50; // score de base

  // Règles simples pour la démo
  if (!videoUrl || !videoUrl.includes('tiktok')) {
    tips.push("Le lien ne semble pas être une URL TikTok valide. Vérifie le format.");
    score = 10;
  } else {
    // Déductions simples
    if (videoUrl.length > 80) tips.push("Raccourcis ton URL (utilise un shortener) pour un partage plus propre.");
    if (videoUrl.includes('music')) tips.push("La musique est détectée — assure-toi qu’elle est tendance cette semaine.");
    if (videoUrl.includes('video')) tips.push("Lien direct vidéo détecté — pense à ajuster la miniature au repost.");
  }

  // Conseils selon l’objectif
  if (objectif === 'Visibilité') {
    tips.push("Utilise un son tendance et garde les 3 premières secondes ultra accrocheuses.");
    tips.push("Ajoute 3–5 hashtags pertinents (#foryou, #viral, #ton_niche).");
    score += 20;
  } else if (objectif === 'Clients') {
    tips.push("Ajoute un CTA clair (‘Lien en bio’, ‘DM pour info’) dans les 3 dernières secondes.");
    tips.push("Montre le bénéfice produit dès le début avec une preuve sociale.");
    score += 15;
  } else if (objectif === 'Les deux') {
    tips.push("Combine hook visuel + preuve de valeur + CTA discret.");
    tips.push("Publie au meilleur horaire de ton audience (ex: 18h–21h).");
    score += 10;
  } else {
    tips.push("Choisis un objectif pour des recommandations plus précises.");
  }

  // Normaliser score
  score = Math.max(0, Math.min(100, score));

  return { score, tips };
}

app.post('/analyze-video', (req, res) => {
  const { videoUrl, objectif } = req.body;
  const result = analyzeVideo({ videoUrl, objectif });
  return res.json({
    objectif,
    videoUrl,
    score: result.score,
    tips: result.tips,
    updatedAt: new Date().toISOString(),
  });
});

app.get('/', (req, res) => res.send('TikTok Optimizer Backend OK'));
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend en écoute sur http://localhost:${PORT}`);
});
