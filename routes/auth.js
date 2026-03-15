import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import Pokemon from '../models/pokemon.js'; // Import nécessaire pour lister les détails
import auth from '../middleware/auth.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.create({ username, password });
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 6.A — SYSTÈME DE FAVORIS (PROTÉGÉ)
 */

// POST /api/auth/favorites/:pokemonId - Ajouter un favori
router.post('/favorites/:pokemonId', auth, async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.pokemonId);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: pokemonId } }, // Évite les doublons
      { new: true }
    );
    res.json({ message: "Ajouté aux favoris", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/auth/favorites/:pokemonId - Retirer un favori
router.delete('/favorites/:pokemonId', auth, async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.pokemonId);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: pokemonId } }, // Retire l'ID du tableau
      { new: true }
    );
    res.json({ message: "Retiré des favoris", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/favorites - Lister mes Pokémon favoris
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const favPokemons = await Pokemon.find({ id: { $in: user.favorites } });
    res.json(favPokemons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;