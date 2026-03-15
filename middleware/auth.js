import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // On récupère le token dans le header "Authorization"
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
  }

  try {
    // Vérification du token avec la phrase secrète du .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On ajoute les infos de l'utilisateur à la requête
    next(); // On passe à la suite (la route)
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

export default auth;